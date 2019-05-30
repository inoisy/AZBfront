<template>
  <div>
    <section class="grey lighten-2">
      <v-container class="pb-4">
        <v-layout row wrap>
          <v-flex>
            <breadcrumbs class="pl-1 mb-4 flex xs12" :items="breadcrumbs"/>
            <h1 class="mb-5">{{manufacturer.name}}</h1>
          </v-flex>
          <v-flex class="align-center layout hidden-sm-and-down">
            <img
              class="display-block ml-auto"
              v-if="manufacturer.img"
              :src="imageBaseUrl+manufacturer.img.url"
              :alt="manufacturer.name"
            >
          </v-flex>
        </v-layout>
      </v-container>
    </section>
    <v-container class="py-5">
      <v-layout row wrap>
        <v-flex xs12 class="display-1" v-html="manufacturer.content"></v-flex>
      </v-layout>
    </v-container>
    <section class="grey lighten-3">
      <v-container class="py-5">
        <v-layout row wrap>
          <v-flex xs12>
            <h2>Каталог {{manufacturer.name}}</h2>
            <div v-for="item in categories" :key="item.id">
              <!-- {{item}} -->
              <v-subheader class="pl-0 text-uppercase mb-2">{{item.element.name}}</v-subheader>
              <div v-for="child in item.items" :key="child.id">
                <nuxt-link
                  class="display-2 text-decoration-none link-hover mb-1 d-inline-block"
                  :to="`/catalog/${item.element.slug}/${child.slug}/${manufacturer.slug}`"
                >{{child.name}}</nuxt-link>
              </div>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
    <section class="certificate-wrap" v-if="manufacturer.certificate">
      <v-container class="pt-5 pb-0">
        <v-layout row wrap>
          <v-flex xs12 md4 class="align-center display-flex mb-5" style="max-height: 25rem">
            <v-img
              contain
              max-height="100%"
              v-if="manufacturer.certificate.img"
              :src="imageBaseUrl+manufacturer.certificate.img.url"
              :alt="manufacturer.certificate.name"
            />
          </v-flex>
          <v-flex xs12 md8 class="mb-5 certificate-text-wrap">
            <h2>{{manufacturer.certificate.name}} {{manufacturer.name}}</h2>
            <!-- <div> -->
            <p>{{manufacturer.certificate.description}}</p>
            <p
              class="mb-0"
            >Срок действия: {{new Date(manufacturer.certificate.expirationDate).toLocaleDateString("ru-RU", { year: 'numeric', month: 'numeric', day: 'numeric' })}}</p>
            <!-- </div> -->
          </v-flex>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Breadcrumbs from "~/components/Breadcrumbs";
import NavMenu from "~/components/NavMenu";

export default {
  components: {
    Breadcrumbs,
    NavMenu
  },
  computed: {
    breadcrumbs() {
      // console.log(this.$route);
      return [
        {
          text: "Главная",
          to: "/"
        },
        {
          text: "Производители",
          to: "/manufacturers"
        },
        {
          text: this.manufacturer.name,
          to: this.$route.path
        }
      ];
    }
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      //   title: "Доставка",
      menuItems: [
        // {
        //   text: "О компании",
        //   to: "/about"
        // },
        {
          text: "Сертификаты",
          to: "/about/certificate"
        },
        {
          text: "Доставка",
          to: "/about/delivery"
        }
      ]
    };
  },
  async asyncData(ctx) {
    // console.log("TCL: asyncData -> ctx", ctx.params.slug);

    let client = ctx.app.apolloProvider.defaultClient;
    console.log("TCL: ctx.params.slug", ctx.params.slug);

    const { data: manufacturersData } = await client.query({
      query: gql`
        query ManufacturersQuery($slug: String!) {
          manufacturers(where: { slug: $slug }) {
            id
            name
            slug
            description
            categories {
              id
              name
              slug
              parent {
                id
                name
                slug
              }
              child {
                id
                name
                slug
              }
            }
            content
            img {
              url
            }
            certificate {
              id
              name
              description
              expirationDate
              img {
                url
              }
            }
          }
        }
      `,
      variables: {
        slug: ctx.params.slug
      }
    });
    // console.log("TCL: Data -> manufacturersData", manufacturersData);

    const manufacturer = manufacturersData.manufacturers[0];
    console.log("TCL: manufacturer", manufacturer);
    // console.log(manufacturer.categories);
    // const { data: categoriesData } = await client.query({
    //   query: gql`
    //     query CategoriesQuery($ids: [ID!]) {
    //       categories(where: { _id_in: $ids }) {
    // id
    // name
    // slug
    // parent {
    //   id
    //   name
    //   slug
    // }
    // child {
    //   id
    //   name
    //   slug
    // }
    //       }
    //     }
    //   `,
    //   variables: {
    //     ids: manufacturer.categories
    //   }
    // });
    // console.log("TCL: categoriesData", categoriesData);
    // const newMap = new Map();
    let newObj = {};
    for (let item of manufacturer.categories) {
      console.log("TCL: item", item);
      if (item.parent && item.parent.length > 0) {
        // newMap.set(item.parent[0].id, { item: item.parent[0] });

        if (!newObj[item.parent[0].id]) {
          newObj[item.parent[0].id] = {
            items: [],
            element: item.parent[0]
          };
        }
        newObj[item.parent[0].id].items.push(item);
        // newObj[item.parent[0].id].element.push(item);
      }
    }
    // console.log("TCL: newObj", newObj);

    // console.log("TCL: newMap", newMap);
    // const objFromMap = { ...newMap };

    // console.log("TCL: objFromMap", objFromMap);
    // console.log("TCL: newCategories", newCategories);
    // const manufacturers = ;
    // console.log("TCL: asyncData -> manufacturersData", manufacturersData);

    return {
      manufacturer: manufacturer,
      categories: newObj
    };
  }
};
</script>
<style lang="stylus" scoped>
.certificate-text-wrap {
  padding-left: 0;
}

// }
@media (min-width: 960px) {
  .certificate-text-wrap {
    padding-left: 40px;
  }
}
</style>

