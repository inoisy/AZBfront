const pkg = require('./package')
const backendUrl = process.env.BACKEND_URL || "http://api.yakutov.com"
const imageBaseUrl = process.env.IMAGE_BASE_URL || "http://api.yakutov.com"
module.exports = {
  mode: 'universal',
  // router: {
  // routes: [{
  //   name: "catalog-category-subCategory-filter",
  //   path: "/catalog/:category/:subCategory/:filter",
  //   component: "pages/catalog/_category/_subCategory/index.vue"
  // }],
  // extendRoutes(nuxtRoutes, resolve) {
  //   nuxtRoutes.splice(0, nuxtRoutes.length, ...routes.map((route) => {
  //     return {
  //       ...route,
  //       component: resolve(__dirname, route.component)
  //     }
  //   }))
  // },
  // },
  // routes: [{
  //   path: '/about-us',
  //   name: 'about_us',
  //   component: 'pages/aboutus',
  //   alias: [
  //     '/qui-sommes-nous',
  //     '/quienes-somos'
  //   ]
  // }, {
  //   path: '/about-us/:id',
  //   name: 'about_us-id',
  //   component: 'pages/aboutus-id',

  // }],
  env: {
    baseUrl: backendUrl,
    imageBaseUrl: imageBaseUrl
    //  imageBaseUrl: imageBaseUrl,
    //  formFrom: process.env.FORM_FROM || 'hydroservice24ru@gmail.com',
  },
  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,800,900&amp;subset=cyrillic'
      }, {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Material+Icons'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: [
    '~/assets/style/app.styl'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/debounce',
    '@/plugins/instant',
    // [, {
    //   ssr: false
    // }],
    // {
    //   src: '@/plugins/affix',
    //   ssr: false
    // },
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/apollo', ['vue-yandex-maps/nuxt', { // you may define your apiKey, lang and version or skip this.
      apiKey: '1f0f5e98-1b55-407d-b09a-60f373e6dcce',
      lang: 'ru_RU',
      version: '2.1'
    }]
  ],
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: backendUrl
  },
  apollo: {

    // errorHandler(error) {
    //   console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
    // },
    clientConfigs: {
      default: {
        httpEndpoint: backendUrl + '/graphql',

      },

    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {

    }
  }
}
