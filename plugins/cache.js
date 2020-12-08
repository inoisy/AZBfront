const apolloFetch = require('apollo-fetch');
import Vue from 'vue'
const backendUrl = process.env.BACKEND_URL || `https://api.azb-es.ru`
// import query from "../generalInfo"
// console.log("🚀 ~ file: cache.js ~ line 5 ~ query", query)

const MyPlugin = {
  install(Vue, options) {
    Vue.prototype.$cached
    Vue.prototype.$getCachedData = async function (fetch) {
      if (!fetch && Vue.prototype.$cached) {
        console.log("cached")
        return Vue.prototype.$cached
      } else {
        console.log("get data from API")
        const query = `
          {
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
            contact {
              name
              content
              email
              phone
              address
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
          Vue.prototype.$cached = dataFetched
          return dataFetched
        } else {

        }
      }
    }

  }
};

Vue.use(MyPlugin)
