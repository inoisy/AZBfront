import gql from "graphql-tag";
// const baseUrl = process.env.baseUrl
// curl -X PUT "localhost:9200/product/doc/_mappings?include_type_name=true" -H 'Content-Type: application/json' -d'
// {
//   "properties": {
//     "name": {
//       "type":     "text",
//       "fielddata": true
//     }
//   }
// }
// '
// curl -X PUT "localhost:9200/product/_settings" -H 'Content-Type: application/json' -d'
// {
//     "analysis": {
//       "analyzer": {
//         "my_analyzer": {
//           "type": "custom",
//             "filter": [
//               "lowercase"
//             ],
//               "tokenizer": "whitespace"
//         }
//       }
//     }
// }
// '

export const state = () => ({
  autocompleteSearchItems: [],
  search: {
    query: null,
    active: false,
  },
  searchItems: [],
  products: [],
  productsTotal: null,
  page: null,
  manufacturers: [],
  loading: false,
  filters: [],
  categories: [],
  mainCategories: [],
  category: "",
  generalInfo: {
    contacts: {
      content: {
        address: {}
      }
    },
    categories: [],
    aboutPages: [],
    manufacturers: []
  },
  dialog: {
    isShow: false,
    name: ''
  }
})

export const mutations = {
  dialog(state, item) {
    state.dialog = item
  },
  generalInfo(state, item) {
    state.generalInfo = item
  },
  search(state, item) {
    state.search = item
  },
  search(state, item) {
    state.search = item
  },
  mainCategories(state, item) {
    state.mainCategories = item
  },
  autocompleteSearchItems(state, item) {
    state.autocompleteSearchItems = item
  },
  filters(state, item) {
    state.filters = item
  },
  manufacturers(state, item) {
    state.manufacturers = item
  },

  searchItems(state, item) {
    state.searchItems = item
  },
  products(state, item) {
    state.products = item
  },
  productsTotal(state, item) {
    state.productsTotal = item
  },
  page(state, item) {
    state.page = item
  },
  loading(state, item) {
    state.loading = item
  },
  category(state, item) {
    state.category = item
  },
}
export const strict = false
export const actions = {
  async fetchGeneralInfo(ctx) {
    let client = this.app.apolloProvider.defaultClient;
    const generalData = await this._vm.$getCachedData()
    // console.log("fetchGeneralInfo -> generalData", generalData)

    // const {
    //   data: generalData
    // } = await client.query({
    //   query: gql `
    //     {
    //        pages(where: {
    //          slug: "about"
    //        }) {
    //          title
    //          slug

    //          children {
    //            title
    //            slug
    //          }
    //        }
    //        categories(where:{
    //          ismain: true
    //        }, sort: "name:asc"){
    //           id
    //           name
    //           slug
    //           child{
    //             id
    //             name
    //             slug
    //           }
    //        }
    //        contacts {
    //          name
    //          content
    //          email
    //          phone
    //        }
    //       manufacturers {
    //         id
    //         name
    //         slug
    //         img{
    //           url
    //         }
    //       }
    //     }
    //     `
    // });
    const returnData = {
      manufacturers: generalData.manufacturers,
      aboutPages: generalData.pages[0].children,
      categories: generalData.categories,
      contacts: generalData.contacts[0]
    }

    await ctx.commit('generalInfo', returnData)
  },
  async fetchManufacturers(ctx) {
    let client = this.app.apolloProvider.defaultClient;
    const {
      data: manufacturerData
    } = await client.query({
      query: gql `
        {
          manufacturers {
            id
            name
            slug
            img{
              url
            }
          }
        }
        `
    });
    const manufacturers = manufacturerData.manufacturers
    await ctx.commit('manufacturers', manufacturers)
    return manufacturers
  },
  async fetchProducts(ctx, input) {

    // let client = this.app.apolloProvider.defaultClient;
    const filters = input.filters
    // console.log("fetchProducts -> filters", filters)
    const category = input.categoryId
    const size = input.size || 10
    const from = input.from || 0
    const manufacturer = input.manufacturers || null

    await ctx.commit('loading', true)
    await ctx.commit('products', [])
    // console.log("fetchProducts -> ctx.state.category", ctx.state.category)

    if (ctx.state.category !== category) {
      await ctx.commit('productsTotal', 0)
    }
    let query = {
      size: size,
      from: from,
      sort: [{
        "name.keyword": {
          order: "asc"
        }
      }],
      query: {
        bool: {
          must: [{
            match: {
              ['category.id']: category
            }
          }]
        }
      }
    }
    const condition = []
    for (let filter in filters) {
      let filterLength = filters[filter].length
      if (filterLength) {
        let valueString = filters[filter].reduce((acc, val, index) => {
          let innerVal = val
          console.log("fetchProducts -> innerVal", innerVal)
          if (filterLength === index) {
            acc = `${acc} ${innerVal}`
          } else if (index === 0) {
            acc = innerVal
          } else {
            acc = `${acc} OR ${innerVal}`
          }
          return acc
        }, '')

        condition.push({

          match: {
            [`filters.${filter}`]: {
              "query": valueString,
            },
          }
        })

      }
    }
    if (condition.length > 0) {
      query.query.bool.filter = [...condition]
    }

    if (manufacturer && manufacturer.length) {
      // let length = manufacturer.length
      let valueString = manufacturer.reduce((acc, val, index, arr) => {
        if (arr.length === index) {
          acc = `${acc} ${val}`
        } else if (index === 0) {
          acc = val
        } else {
          acc = `${acc} OR ${val}`
        }
        return acc
      }, '')
      query.query.bool.must.push({
        match: {
          'manufacturer.id': valueString
        }
      })
    }
    const {
      data: returnData
    } = await this.$axios.post(
      "products/search",
      query
    );

    const products = returnData.hits.map(item => item._source)
    // console.log("fetchProducts -> products", products[0])
    await ctx.commit('category', category)
    await ctx.commit('products', products)
    await ctx.commit('productsTotal', returnData.total.value)
    await ctx.commit('loading', false)
    return products
  },
  async autocompleteSearch(ctx, input) {
    console.log("autocompleteSearch -> input", input)
    await ctx.commit('loading', true)
    await ctx.commit("autocompleteSearchItems", []);
    const query = {
      size: 10,
      from: 0,
      query: {
        multi_match: {
          query: input,
          // "type": "most_fields",
          fields: ["SKU", "description", "name"],
          "fuzziness": "AUTO"
        }
      },
      highlight: {
        pre_tags: ["<span class='highlight'>"],
        post_tags: ["</span>"],
        fields: [{
            "SKU": {}
          },
          {
            "name": {}
          },
          {
            "description": {}
          }
        ]
      }
    };
    const {
      data
    } = await this.$axios.post(
      "products/search",
      query
    );

    const items = data.hits.map(item => {
      const highlight = item.highlight
      return {
        ...item._source,
        highlight
      }
    })
    await ctx.commit("autocompleteSearchItems", items);
    await ctx.commit('loading', false)
    return items
  },

}
