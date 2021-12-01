import Vue from "vue";
import axios from "axios";
import TokenService from "~/services/token.service";
import qs from "qs";
const axiosApiInstance = axios.create();
axios.defaults.baseURL = process.env.API_BASE_URL;
axios.defaults.headers.get["Accept"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";

axios.interceptors.request.use(
  async config => {
    let token = TokenService.getLocalAccessToken();
    if (token) {
      axios.defaults.headers.common["Authorization"] = `${token}`;
    }
    return config;
  },
  error => {
    return error.hasRefreshedToken ? axios(config) : Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalConfig = error.config;
    // Reject promise if usual error
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    originalConfig._retry = true;
    const urlRefreshToken = `${process.env.KEYCLOAK_BASE_URL}/auth/realms/site/protocol/openid-connect/token`;
    await axios
      .post(
        urlRefreshToken,
        qs.stringify({
          refresh_token: TokenService.getLocalRefreshToken(),
          grant_type: "refresh_token",
          client_id: process.env.KEYCLOAK_CLIENT_ID
        }),
        { headers: { "content-type": "application/x-www-form-urlencoded" } }
      )
      .then(response => {
        TokenService.updateLocalAccessToken(response.data.access_token);
        TokenService.updateLocalRefreshToken(response.data.refresh_token);
        error.response.config.headers["Authorization"] =
          "Bearer " + response.data.access_token;
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + response.data.access_token;
        error.hasRefreshedToken = true;
        return axios(error.response.config);
      })
      .catch(err => {
        TokenService.removeLocalAccessToken();
        TokenService.removeLocalRefreshToken();
        return Promise.reject(err);
      });
  }
);
Vue.use(axios);
