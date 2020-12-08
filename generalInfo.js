// pages(where: { slug: "about" }) {
//     title
//     slug
//     children {
//         title
//         slug
//     }
// }
module.exports.query = `
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