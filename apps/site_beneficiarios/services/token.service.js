class TokenService {
    getLocalRefreshToken() {
      return localStorage.getItem("auth._refresh_token.keycloak");
    }
  
    getLocalAccessToken() {
      return localStorage.getItem("auth._token.keycloak");
    }
  
    updateLocalAccessToken(token) {
      localStorage.setItem("auth._token.keycloak", 'Bearer ' + token);
    }

    updateLocalRefreshToken(token) {
      localStorage.setItem("auth._refresh_token.keycloak", token);
    }

    removeLocalAccessToken(){
      localStorage.removeItem("auth._token.keycloak");
    }
    removeLocalRefreshToken(){
      localStorage.removeItem("auth._refresh_token.keycloak");
    }
   
  }
  
  export default new TokenService()