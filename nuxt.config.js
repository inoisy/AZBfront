const pkg = require('./package')
// const axios = require("axios")
const routes = require("./routes")

const siteURL = "https://azb-es.ru"
// const backURL = "https://api.azb-es.ru"
const backendUrl = process.env.BACKEND_URL || "https://api.azb-es.ru"
// const imageBaseUrl = process.env.IMAGE_BASE_URL || backURL



module.exports = {
  version: pkg.version,
  mode: 'universal',
  env: {
    siteUrl: siteURL,
    baseUrl: backendUrl,
    imageBaseUrl: backendUrl
  },
  router: {
    scrollBehavior: async (to, from, savedPosition) => {
      const fromName = from.name
      const toName = to.name
      if (to.hash) {
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
      if (fromName === "manufacturers-slug" && toName === "catalog-category-subCategory-filter") {
        return {
          x: 0,
          y: 0
        }
      }
      if (fromName === "catalog-category-subCategory-filter" || toName === "catalog-category-subCategory-filter" || fromName === "catalog-category-subCategory" && toName === "catalog-category-subCategory") {
        return
      }
      if (fromName === "catalog-category-subCategory-filter" && toName === "catalog-category-subCategory" || fromName === "catalog-category-subCategory" && toName === "catalog-category-subCategory-filter" && savedPosition) {
        return savedPosition
      }

      return {
        x: 0,
        y: 0
      }

      // const catalogToCategory = fromName === "catalog" && toName === "catalog-category"
      // const catalogToSubcategory = fromName === "catalog-category" && toName === "catalog-category-subCategory"
      // const subcategoryToProduct = fromName === "catalog-category-subCategory" && toName === "product-slug"

      // if (catalogToSubcategory || subcategoryToProduct || catalogToCategory) {
      //   console.log("true")
      //   return {
      //     x: 0,
      //     y: 0
      //   }

      // }
      // console.log("to, from", to, from)
      //     if (savedPosition) {
      //       return savedPosition
      //     }




      //     return {
      //       x: 0,
      //       y: 0
      //     }
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
      // {
      //   rel: 'stylesheet',
      //   href: 'https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,800,900&amp;subset=cyrillic'
      // }, {
      //   rel: 'stylesheet',
      //   href: 'https://fonts.googleapis.com/css?family=Material+Icons'
      // }
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
    '~/assets/style/app.styl',
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/cache.js',
    // '@/plugins/vuetify',
    '@/plugins/debounce',
    // '@/plugins/instant',
    "@/plugins/lazyload.js",
    {
      src: '@/plugins/aos.js',
      ssr: false
    },

  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // "nuxt-ssr-cache",
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/apollo', ['vue-yandex-maps/nuxt', { // you may define your apiKey, lang and version or skip this.
      apiKey: '1f0f5e98-1b55-407d-b09a-60f373e6dcce',
      lang: 'ru_RU',
      version: '2.1'
    }],

    '@nuxtjs/markdownit',

    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    // '@nuxtjs/redirect-module',
    // ['@nuxtjs/google-analytics', {
    //   id: 'UA-12301-2'
    // }],
    [
      '@nuxtjs/yandex-metrika',
      {
        id: '54922627',
        webvisor: true,
        // clickmap:true,
        // useCDN:false,
        // trackLinks:true,
        // accurateTrackBounce:true,
      }
    ],
    ['@nuxtjs/vuetify', {
      treeShake: true,
      defaultAssets: {
        font: {
          family: 'Montserrat'
        },
        icons: "md"
      },
      customVariables: ['~/assets/variables.scss'],
      theme: {
        primary: '#121212', // a color that is not in the material colors palette
        //  accent: colors.grey.darken3,
        //  secondary: colors.amber.darken3,
        //  info: colors.teal.lighten1,
        //  warning: colors.amber.base,
        //  error: colors.deepOrange.accent4,
        //  success: colors.green.accent3
      }
      /* module options */
    }],
  ],
  // redirect: [{
  //   from: '^/about_us',
  //   to: '/about'
  // }],
  robots: {
    UserAgent: '*',
    Allow: '/',
    Sitemap: siteURL + "/sitemap.xml"
  },
  cache: {
    // if you're serving multiple host names (with differing
    // results) from the same server, set this option to true.
    // (cache keys will be prefixed by your host name)
    // if your server is behind a reverse-proxy, please use
    // express or whatever else that uses 'X-Forwarded-Host'
    // header field to provide req.hostname (actual host name)
    useHostPrefix: true,

    store: {
      type: 'redis',
      host: 'localhost',
      ttl: 4 * 60 * 60,
      configure: [
        // these values are configured
        // on redis upon initialization
        ['maxmemory', '200mb'],
        ['maxmemory-policy', 'allkeys-lru'],
      ],

    },
    // type: 'memory',

    // // maximum number of pages to store in memory
    // // if limit is reached, least recently used page
    // // is removed.
    // max: 100,

    // // number of seconds to store this page in cache
    // ttl: 60,
    pages: [
      // these are prefixes of pages that need to be cached
      // if you want to cache all pages, just include '/'
      "/"
    ],
  },
  sitemap: {
    // hostname: os.hostname(),
    gzip: true,
    cacheTime: 1000 * 60 * 60 * 24 * 90,
    routes

  },
  markdownit: {
    injected: true,
    html: true,
    xhtmlOut: true,
    breaks: true,
    typographer: true,
    linkify: true
  },
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
    babel: {
      sourceType: 'unambiguous',
      "presets": [
        ["@nuxt/babel-preset-app", {
          "corejs": {
            "version": 2
          }
        }],
      ]
    },
    transpile: [/^aos/, /^vue-awesome-swiper/, /^@nuxtjs\/apollo/, "vue2-google-maps", "vue-particles", "nuxt-i18n", "vuetify"],
    extend(config, ctx) {
      // config.node = {
      //   fs: 'empty',
      //   net: 'empty',
      //   debug: 'empty',
      // }
    }
  }
}
