import { I18N } from "./config";
export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "SITE - Sistema Informático de gestión del PTE",
    htmlAttrs: {
      lang: "en"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/main.scss"],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ["~/plugins/axios","~/plugins/refresh"],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    "@nuxt/typescript-build",
    '@nuxtjs/dotenv'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    "nuxt-buefy",
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
    "@nuxtjs/proxy",
    [
      "@nuxtjs/i18n",
      {
        parsePages: false,
        pages: I18N,
        locales: [
          {
            code: "en",
            file: "en-US.js"
          },
          {
            code: "es",
            file: "es-ES.js"
          }
        ],
        lazy: true,
        langDir: "lang/",
        defaultLocale: "es"
      }
    ]
  ],
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: process.env.API_BASE_URL,
    proxyHeaders: false,
    proxy: false
  },
  auth: {
    strategies: {
      local: false,
      keycloak: {
        scheme: "oauth2",
        endpoints: {
          authorization:
            `${process.env.KEYCLOAK_BASE_URL}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth`,
          userInfo:
            `${process.env.KEYCLOAK_BASE_URL}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/userinfo`,
          token:
          `${process.env.KEYCLOAK_BASE_URL}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
          logout:
          `${process.env.KEYCLOAK_BASE_URL}/auth/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout?redirect_uri=` +
            encodeURIComponent(String(`${process.env.BASE_URL}/login`))
        },
        token: {
          property: "access_token",
          type: "Bearer",
          name: "Authorization",
          maxAge: 1800 // Can be dynamic ?
        },
        refreshToken: {
          property: "refresh_token",
          data: "refresh_token",
          maxAge: 60 * 60 * 24 * 30
        },
        responseType: "code",
        grantType: "authorization_code",
        clientId: process.env.KEYCLOAK_CLIENT_ID,
        scope: ["openid", "profile", "email"],
        codeChallengeMethod: "S256"
      }
    },
    redirect: {
      logout: "/",
      callback: "/",
      login: "/login",
      home: process.env.BASE_URL
    }
  },
  proxy: {
    "/auth": {
      target: process.env.KEYCLOAK_BASE_URL
    }
  },

  router: {
    middleware: ["auth"]
  },
  env: {
    baseUrl: process.env.BASE_URL
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {}
};
