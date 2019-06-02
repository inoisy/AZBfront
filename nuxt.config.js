const pkg = require('./package')
const backendUrl = process.env.BACKEND_URL || "http://api.yakutov.com"
const imageBaseUrl = process.env.IMAGE_BASE_URL || "http://api.yakutov.com"


module.exports = {
  mode: 'universal',
  env: {
    baseUrl: backendUrl,
    imageBaseUrl: imageBaseUrl
  },
  router: {
    scrollBehavior: async (to, from, savedPosition) => {
      if (savedPosition) {
        return savedPosition
      }

      const findEl = async (hash, x) => {
        return document.querySelector(hash) ||
          new Promise((resolve, reject) => {
            if (x > 50) {
              return resolve()
            }
            setTimeout(() => {
              resolve(findEl(hash, ++x || 1))
            }, 100)
          })
      }

      if (to.hash) {
        let el = await findEl(to.hash)
        if ('scrollBehavior' in document.documentElement.style) {
          return window.scrollTo({
            top: el.offsetTop,
            behavior: 'smooth'
          })
        } else {
          return window.scrollTo(0, el.offsetTop)
        }
      }

      return {
        x: 0,
        y: 0
      }
    }
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - Азбука электроснабжения',
    // title: "Азбука электроснабжения",
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
        content: "Электротехника и электрооборудование со склада и на заказ - Азбука электронабжения"
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
    }],
    ['@nuxtjs/component-cache', {
      max: 10000,
      maxAge: 1000 * 60 * 60
    }],
    // ['vue-scrollto/nuxt', {
    //   duration: 300
    // }],
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
