import gql from "graphql-tag";
const baseUrl = process.env.baseUrl
export const state = () => ({
  autocompleteSearchItems: [],
  search: {
    query: null
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
  contacts: {
    tel: "+7 (495) 532-50-66",
    mail: "mail@azb-es.ru",
    address: "г. Москва Загородное шоссе дом 1 корпус 2 офис 212"
  },
  menuItems: [{
      name: "Главная",
      to: "/"
    },
    {
      name: "Каталог",
      to: "/catalog"
    },
    {
      name: "Производители",
      to: "/manufacturers"
    },
    {
      name: "О компании",
      to: "/about"
    },
    {
      name: "Контакты",
      to: "/contacts"
    }
  ]
  // catalog: {
  //   manufacturerSelected: null
  // }
})

export const mutations = {
  // catalog(state, prop, item) {
  //   state[prop] = item
  // },
  search(state, search) {
    state.search = search
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
  async fetchManufacturers(ctx) {
    let client = ctx.app.apolloProvider.defaultClient;
    const {
      data: ManufacturerData
    } = await client.query({
      query: gql `
        {
          manufacturers {
            id
            name
            slug
          }
        }
        `
    });
    // console.log("TCL: fetchManufacturers -> ManufacturerData", ManufacturerData)
    return ManufacturerData
    //    const {
    //      data
    //    } = await this.$axios.get(baseUrl + 'categories/main')
    //    console.log("TCL: fetchMainCategories -> baseUrl + 'categories/main'", baseUrl + 'categories/main')
    //    // console.log('fetchMainCategories', data)
    //    await ctx.commit('mainCategories', data)

    //    return data
  },
  async fetchMainCategories(ctx) {
    const {
      data
    } = await this.$axios.get(baseUrl + 'categories/main')
    // console.log("TCL: fetchMainCategories -> baseUrl + 'categories/main'", baseUrl + 'categories/main')
    // console.log('fetchMainCategories', data)
    await ctx.commit('mainCategories', data)

    return data
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
    const condition = []
    let query = {
      size: size,
      from: from,
      query: {
        bool: {
          must: [{
              match: {
                ['category.id']: category
              }
            }

          ]
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
          condition

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
    // console.log("TCL: fetchProducts -> query", query.query.bool.must)

    const {
      data: returnData
    } = await this.$axios.post(
      baseUrl + "products/search",
      query
    );


    // console.log("TCL: fetchProducts -> query", query)


    // console.log("TCL: fetchProducts -> data", returnData)
    const products = returnData.hits.map(item => item._source)
    await ctx.commit('products', products)
    await ctx.commit('productsTotal', returnData.total.value)
    await ctx.commit('loading', false)
    return products
  },
  async autocompleteSearch(ctx, input) {
    // console.log("TCL: autocompleteSearch -> input", input)
    ctx.commit('loading', true)
    const query = {
      size: 10,
      from: 0,
      query: {
        multi_match: {
          query: input,
          fields: ["SKU", "description", "name"],
          "fuzziness": "4"
        }
      }
    };
    const {
      data
    } = await this.$axios.post(
      baseUrl + "products/search",
      query
    );
    const items = data.hits.map(item => item._source)
    await ctx.commit("autocompleteSearchItems", items);
    await ctx.commit('loading', false)
    return items
  },
  async search(ctx, input) {
    // console.log("TCL: search -> input", input)

    // console.log("hello from actions", ctx)

    const nameQuery = {
      size: 20,
      from: 0,
      query: {
        multi_match: {
          query: input,
          fields: ["SKU", "description", "name"],
          "fuzziness": "AUTO"
        }
      }
    };

    // const allQuery = {
    //   size: 20,
    //   from: 0,
    //   query: {
    //     multi_match: {
    //       query: input,
    //       fields: ["SKU", "description"]
    //     }
    //   }
    // };
    let items;
    const {
      data: nameData
    } = await this.$axios.post(
      baseUrl + "products/search",
      nameQuery
    );
    if (nameData.hits.length === 0) {
      console.log("nothing at name");
      // const {
      //   data: descriptionData
      // } = await this.$axios.post(
      //   "http://localhost:1337/products/search",
      //   allQuery
      // );
      // if (descriptionData.hits.length === 0) {
      //   console.log("nothing at description");
      // const {
      //   data: skuData
      // } = await this.$axios.post(
      //   "http://localhost:1337/products/search",
      //   skuQuery
      // );

      // if (skuData.hits.length > 0) {
      //   console.log("total", skuData.total);

      //   items = skuData.hits;
      // } else {
      //   console.log("nothing at SKU");
      // }
      // } else {
      //   console.log("total", descriptionData.total);
      //   items = descriptionData.hits;
      // }

      // .filter(item => {
      //   if (item._score > data.max_score * 0.75) return item;
      // });
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
//   baseUrl + "products/search",
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
