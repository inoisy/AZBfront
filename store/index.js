import gql from "graphql-tag";
const baseUrl = process.env.baseUrl
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
    // console.log("TCL: fetchManufacturers -> ManufacturerData", ManufacturerData)
    await ctx.commit('manufacturers', manufacturers)
    return manufacturers
  },
  async fetchProducts(ctx, input) {
    // console.log("TCL: fetchProducts -> input", input)
    await ctx.commit('loading', true)
    await ctx.commit('products', [])
    await ctx.commit('productsTotal', 0)
    // let client = this.app.apolloProvider.defaultClient;
    const filters = input.filters
    const category = input.categoryId
    const size = input.size || 10
    const from = input.from || 0
    const manufacturer = input.manufacturers || null
    // console.log("TCL: fetchProducts -> manufacturer", manufacturer)
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
    // if (category){
    // let newObj = {}
    // newObj[`category.id`] = category
    // query.query.bool.must.push(newObj)
    // condition.push({
    //   match
    // })
    // }
    // let returnData = {}
    if (filters) {
      // query
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
          // {
          ...condition

        )
      }

    }

    if (manufacturer) {
      // console.log("TCL: fetchProducts -> manufacturer", manufacturer)
      query.query.bool.must.push({
        match: {
          ['manufacturer.id']: manufacturer
        }
      })
    }
    console.log("TCL: fetchProducts -> query", query.query.bool.must)

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
    // console.log("TCL: autocompleteSearch -> input", input)
    await ctx.commit('loading', true)
    await ctx.commit("autocompleteSearchItems", []);
    const query = {
      size: 10,
      from: 0,
      query: {
        multi_match: {
          query: input,
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
    console.log("TCL: autocompleteSearch -> data", data)

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
  async search(ctx, input) {
    const nameQuery = {
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
      },
      size: 20,
      from: 0,
      query: {
        multi_match: {
          query: input,
          fields: ["SKU", "description", "name"],
          "fuzziness": "AUTO",

        }
      }
    };

    let items;
    const {
      data: nameData
    } = await this.$axios.post(
      "products/search",
      nameQuery
    );
    if (nameData.hits.length === 0) {
      console.log("nothing at name");
    } else {
      console.log("total", nameData.total);

      items = nameData.hits;
      // .filter(item => {
      //   if (item._score > data.max_score * 0.75) return item;
      // });
    }
    // console.log(items);
    ctx.commit("searchItems", items);
    return input
    // ctx.commit('searchItems', items);
  }
}
// nested: {
//   path: "filters",
//   query: {
//     bool: {
//       must: condition
//     }
//   }
// }
// }
// const {
//   data
// } = await this.$axios.post(
//    "products/search",
//   query
// );
// returnData = data
//  else {
// query = {
//   size: size,
//   from: from,
//   query: {
//     bool: {
//       must: [{
//         match: {
//           subcategory: category
//         }
//       }]
//     }
//   }
// };
// console.log("TCL: fetchProducts -> category", category)

// console.log("TCL: fetchProducts -> query", query)


// console.log("TCL: fetchProducts -> data", data)

// returnData = data
// }
// const descriptionQuery = {
//   size: 20,
//   from: 0,
//   query: {
//     match: {
//       description: {
//         query: input,
//         fuzziness: "AUTO"
//       }
//     }
//   }
// };
// const skuQuery = {
//   size: 20,
//   from: 0,
//   query: {
//     match: {
//       SKU: {
//         query: input
//         // fuzziness: "AUTO"
//       }
//     }
//   }
// };
// async filter(ctx, input, category) {
//   const condition = []
//   for (let i of Object.keys(input)) {
//     console.log(i, input[i])
//     let match = {}
//     match[`filters.${i}`] = input[i]
//     condition.push({
//       match
//     })
//   }
//   // console.log(condition)
//   const query = {
//     query: {
//       bool: {
//         must: [{
//             match: {
//               category: category
//             }
//           }, {
//             nested: {
//               path: "filters",
//               query: {
//                 bool: {
//                   must: condition
//                 }
//               }
//             }
//           }

//         ]
//       }

//     }
//   }
//   const {
//     data
//   } = await this.$axios.post(
//     "http://localhost:1337/products/search",
//     query
//   );
//   ctx.commit('products', data.hits.map(item => item._source))
//   console.log('data.total',
//     data.total)
// },

// console.log('fetchProductsdata',
//   data)
// let manufacturerSet = new Set()
// let manufacturers = []
// for (let i of data.hits) {
//   manufacturerSet.add(i._source.manufacturer)
// }
// manufacturerSet.forEach(async item => {
//   const {
//     data: manufacturer
//   } = await client.query({
//     query: gql `
//       query ManufacturerQuery($id: ID!) {
//         manufacturers(where: {
//           id: $id
//         }) {
//           id
//           name
//           slug
//         }
//       }
//     `,
//     variables: {
//       id: item
//     }
//   });
//   manufacturers.push(manufacturer.manufacturers)
//   // console.log(manufacturer)
// })
// ctx.commit('manufacturers', manufacturers)
// console.log(manufacturers)
// const manufacturers = data.hits.map(item => {
//   console.log(item._source.manufacturer);
//   manufacturerSet.add(item._source.manufacturer)
// })
// console.log('manufacturers', manufacturerSet)
// ctx.commit('products', data.hits.map(item => item._source))
