const axios = require('axios')
const backendUrl = process.env.BACKEND_URL || "https://api.azb-es.ru"
async function routes() {
  // console.log("sitemap-generation")

  // console.log("TCL: routes -> data", data)
  // console.log("TCL: routes -> categories", categories)
  let routes = []

  const {
    data: manufacturers
  } = await axios.get(backendUrl + '/manufacturers?_limit=99999')
  //   console.log("TCL: routes -> manufacturers", manufacturers)
  for (let item of manufacturers) {
    routes.push(`/manufacturers/${item.slug}`)
  }


  const {
    data: pages
  } = await axios.get(backendUrl + '/pages?parent.slug=about')
  //   console.log("TCL: routes -> pages", pages)
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
    data: productsCount
  } = await axios.get(backendUrl + '/products/count')
  console.log("routes -> productsCount", productsCount)
  for (let i = 0; i < Math.ceil(productsCount / 1000); i++) {
    console.log("start", i * 1000)
    const {
      data: products
    } = await axios.get(`${backendUrl}/products?_limit=1000&_start=${i*1000}`)
    for (let product of products) {
      routes.push(`/product/${product.slug}`)
    }
  }
  console.log('routesLength', routes.length)
  //   const {
  //     data: products
  //   } = await axios.get(backendUrl + '/products?_limit=1000')
  //   // console.log("TCL: routes ->  products.length", products.length)
  //   for (let product of products) {
  //     routes.push(`/product/${product.slug}`)
  //   }

  return routes
}
// routes()
module.exports = routes
