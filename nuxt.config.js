const pkg = require('./package')
const axios = require("axios")

const siteURL = "https://azb-es.ru"
const backURL = "https://api.azb-es.ru"
const backendUrl = process.env.BACKEND_URL || backURL
const imageBaseUrl = process.env.IMAGE_BASE_URL || backURL

module.exports = {
  version: pkg.version,
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
    // '@/plugins/debounce',
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
    '@nuxtjs/redirect-module',
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

  ],
  redirect: [{
    from: '^/about_us',
    to: '/about'
  }],
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
    // exclude: [
    //   '/secret',
    //   '/admin/**'
    // ],
    async routes() {
      // console.log("sitemap-generation")

      // console.log("TCL: routes -> data", data)
      // console.log("TCL: routes -> categories", categories)
      let routes = []

      const {
        data: manufacturers
      } = await axios.get(backendUrl + '/manufacturers?_limit=99999')
      console.log("TCL: routes -> manufacturers", manufacturers)
      for (let item of manufacturers) {
        routes.push(`/manufacturers/${item.slug}`)
      }


      const {
        data: pages
      } = await axios.get(backendUrl + '/pages?parent.slug=about')
      console.log("TCL: routes -> pages", pages)
      for (let item of pages) {
        routes.push(`/about/${item.slug}`)
      }

      const {
        data: categories
      } = await axios.get(backendUrl + '/categories?ismain=true&_limit=99999')
      for (let category of categories) {
        routes.push(`/catalog/${category.slug}`)

      }
      for (let category of categories) {
        for (let subcategory of category.child) {
          routes.push(`/catalog/${category.slug}/${subcategory.slug}`)
        }
      }
      const {
        data: products
      } = await axios.get(backendUrl + '/products?_limit=99999')
      // console.log("TCL: routes ->  products.length", products.length)
      for (let product of products) {
        routes.push(`/product/${product.slug}`)
      }

      return routes
    }
  },
  markdownit: {
    preset: 'default',
    linkify: true,
    breaks: true,
    injected: true
    // use: [
    //   ['markdown-it-container', containerName],
    //   'markdown-it-attrs'
    // ]
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
    extend(config, ctx) {

    }
  }
}
