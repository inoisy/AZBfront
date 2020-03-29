import gql from "graphql-tag";
const baseUrl = process.env.baseUrl
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
}
export const strict = false
export const actions = {
  async fetchGeneralInfo(ctx) {
    let client = this.app.apolloProvider.defaultClient;
    const {
      data: generalData
    } = await client.query({
      query: gql `
        {
           pages(where: {
             slug: "about"
           }) {
             title
             slug
             
             children {
               title
               slug
             }
           }
           categories(where:{
             ismain: true
           }, sort: "name:asc"){
             id
             name
             slug
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
            img{
              url
            }
          }
        }
        `
    });
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
    const category = input.categoryId
    const size = input.size || 10
    const from = input.from || 0
    const manufacturer = input.manufacturers || null

    await ctx.commit('loading', true)
    if (from === 0) {
      await ctx.commit('productsTotal', 0)
    }
    await ctx.commit('products', [])

    const condition = []
    let query = {
      size: size,
      from: from,
      sort: [{
        name: {
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
    if (filters) {
      for (let i of Object.keys(filters)) {
        if (filters[i]) {
          let match = {}
          match[`filters.${i}`] = filters[i]
          condition.push({
            match
          })
        }
      }
      if (condition.length > 0) {
        query.query.bool.must.push(
          ...condition
        )
      }

    }

    if (manufacturer) {
      query.query.bool.must.push({
        match: {
          ['manufacturer.id']: manufacturer
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
    await ctx.commit('products', products)
    await ctx.commit('productsTotal', returnData.total.value)
    await ctx.commit('loading', false)
    return products
  },
  async autocompleteSearch(ctx, input) {
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
