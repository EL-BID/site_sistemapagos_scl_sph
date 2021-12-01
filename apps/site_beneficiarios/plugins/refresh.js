import axios from "axios";
import TokenService from "~/services/token.service";
import qs from "qs";

const urlRefreshToken = `${process.env.KEYCLOAK_BASE_URL}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`;
   
setInterval(() => {
    axios
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
    })
    .catch(error => {
      TokenService.removeLocalAccessToken();
      TokenService.removeLocalRefreshToken();
    });
}, 60000)




