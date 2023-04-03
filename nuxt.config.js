const inProduction = process.env.NODE_ENV === 'production'
const host = inProduction ? '127.0.0.1' : `app.sms.test`
const apiRoot = process.env.APP_API_ROOT

export default {
  ssr: false,
  server: {
    host,
    port: process.env.APP_PORT,
    changeOrigin: true,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'School App',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      {
        name: 'format-detection',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  loading: {
    color: '#0d8fff',
  },
  loadingIndicator: {
    name: 'three-bounce',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/assets/scss/index.scss', 'bootstrap-vue/dist/bootstrap-vue.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/bootstrap-vue-icons',
    '~/plugins/global-components',
    '~/plugins/otp',
    '~/plugins/form',
    { src: '~/plugins/apex-chart', ssr: false },
    { src: '~/plugins/html2Pdf', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    // '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    // '@nuxtjs/stylelint-module',
    '@nuxtjs/composition-api/module',
    ['@pinia/nuxt', { disableVuex: false }],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/auth-next',
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    '@nuxtjs/apollo',
    'nuxt-paystack',
    ['vue2-editor/nuxt'],
    // 'vue-sweetalert2/nuxt',
  ],
  hooks: {
    render: {
      errorMiddleware(app) {
        app.use((error, req, res, next) => {
          res.writeHead(307, {
            Location: '/network-error',
          })
          res.end()
        })
      },
    },
  },

  // bootstrapVue: {
  //   bootstrapCSS: false,
  //   bootstrapVueCSS: false,
  // },

  styleResources: {
    scss: [
      '~/node_modules/bootstrap/scss/_functions.scss',
      '~/node_modules/bootstrap/scss/_variables.scss',
      '~/node_modules/bootstrap/scss/_mixins.scss',
    ],
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
  },

  // Auth configuration
  auth: {
    redirect: {
      login: '/login',
      logout: '/login',
      callback: false,
      home: '/default/dashboard',
    },
    strategies: {
      graphql: {
        scheme: '~/graphql/auth/scheme.js',
      },
    },

    cookie: {
      options: {
        path: '/',
        domain: apiRoot.substring(apiRoot.indexOf('.')), // optional
      },
    },
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  // build: { extend(config, ctx) {} },
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    
  },
  publicRuntimeConfig: {
    APIRoot: apiRoot,
  },

  apollo: {
    // tokenName: 'yourApolloTokenName', // optional, default: apollo-token
    cookieAttributes: {
      /**
       * Define when the cookie will be removed. Value can be a Number
       * which will be interpreted as days from time of creation or a
       * Date instance. If omitted, the cookie becomes a session cookie.
       */
      expires: 7, // optional, default: 7 (days)

      /**
       * Define the path where the cookie is available. Defaults to '/'
       */
      // path: '/', // optional
      /**
       * Define the domain where the cookie is available. Defaults to
       * the domain of the page where the cookie was created.
       */
      // domain: `.${host}`, // optional
      domain: apiRoot.substring(apiRoot.indexOf('.')), // optional
      /**
       * A Boolean indicating if the cookie transmission requires a
       * secure protocol (https). Defaults to false.
       */
      secure: inProduction,
    },
    includeNodeModules: true, // optional, default: false (this includes graphql-tag for node_modules folder)
    // authenticationType: 'Bearer', // optional, default: 'Bearer'
    // (Optional) Default 'apollo' definition
    defaultOptions: {
      // See 'apollo' definition
      // For example: default query options
      $query: {
        loadingKey: 'loading',
        fetchPolicy: 'cache-and-network',
      },
    },

    // setup a global query loader observer
    watchLoading: '~/plugins/watch-loading-handler.js',
    // optional
    errorHandler: '~/plugins/apollo-error-handler.js',
    // required
    clientConfigs: {
      default: '~/graphql/apollo/default-client.js',
    },
  },
  pwa: {
    manifest: {
      lang: 'en',
    },
  },
}
