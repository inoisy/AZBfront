// import axios from './axios'
const apolloFetch = require('apollo-fetch');
// let data // simple data cache
// console.log("data", data)
import Vue from 'vue'
const backendUrl = process.env.BACKEND_URL || `https://api.azb-es.ru`
// console.log("backendUrl", backendUrl)


const MyPlugin = {
  install(Vue, options) {
    Vue.prototype.$myAddedProperty
    Vue.prototype.$getCachedData = async function () {
      //   console.log("getCachedData -> getCachedData", Vue.prototype.$myAddedProperty)
      // return async function () {
      if (Vue.prototype.$myAddedProperty) { // get data from cache if exists
        // console.log("data Cached")
        return Vue.prototype.$myAddedProperty
      } else { // else get data from API
        console.log("else get data from API")

        const query = `
          {
            pages(where: { slug: "about" }) {
              title
              slug
              children {
                title
                slug
              }
            }
            categories(where: { ismain: true }, sort: "name:asc") {
              id
              name
              slug
              child {
                id
                name
                slug
              }
            }
            contacts {
              name
              content
              email
              phone
            }
            manufacturers {
              id
              name
              slug
              img {
                url
              }
            }
          }
        `
        const fetchApollo = apolloFetch.createApolloFetch({
          uri: backendUrl + '/graphql'
        });

        const {
          data: dataFetched
        } = await fetchApollo({
          query
        })
        if (dataFetched) {
          Vue.prototype.$myAddedProperty = dataFetched
          return dataFetched
          //   resolve(data)
        } else {
          //   reject()
        }
      }
    }

  }
};

Vue.use(MyPlugin)
