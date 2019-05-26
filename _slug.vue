<template>
  <div>
    <section class="grey lighten-2">
      <v-container class="text-xs-center text-md-left">
        <breadcrumbs class="pl-1" :items="breadcrumbs"/>
        <h1>{{product.name}}</h1>
      </v-container>
    </section>
    <v-container class="py-5">
      <v-layout row wrap>
        <v-flex xs12 md8 order-xs2 order-md1 class="pr-3">
          <p>
            <span class="font-weight-bold">Артикул:</span>
            {{product.SKU}}
          </p>
          <p v-for="(item,index) in Object.keys(product.filters)" :key="index">
            <span class="font-weight-bold">{{item}}:</span>
            {{product.filters[item]}}
          </p>
        </v-flex>
        <v-flex xs12 md4 order-xs1 order-md2 class="mb-4">
          <v-card
            class="pa-4 mb-4"
            style="border-radius: 10px"
            hover
            ripple
            @click="dialogImg=!dialogImg"
          >
            <img
              class="img-thumbnail d-block mx-auto"
              v-if="product.img"
              :src="imageBaseUrl+product.img.url"
              alt
            >
          </v-card>
          <v-dialog v-model="dialogImg">
            <div class="pa-3" style="background-color: white;
    position: relative;">
              <v-btn
                class="close-btn"
                flat
                icon
                large
                outline
                color="primary"
                @click="dialogImg = false"
                style="position:absolute; top:5px; right: 5px; z-index: 10"
              >
                <v-icon>close</v-icon>
              </v-btn>
              <v-img contain :src="imageBaseUrl+product.img.url" max-height="80vh"/>
            </div>
          </v-dialog>
          <v-btn
            class="ma-0"
            large
            color="#1F5BFF"
            dark
            style="width: 100%"
            @click="dialog = !dialog"
          >Заказать</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <catalog-dialog :name="product.name"/>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Breadcrumbs from "~/components/Breadcrumbs";
import CatalogDialog from "~/components/CatalogDialog";

export default {
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      dialog: false,
      dialogImg: false
    };
  },
  components: {
    Breadcrumbs,
    CatalogDialog
  },
  computed: {
    breadcrumbs() {
      return [
        {
          text: "Главная",
          to: "/"
        },
        {
          text: "Каталог",
          to: "/catalog"
        },
        {
          text: this.product.category.parent[0].name,
          to: `/catalog/${this.product.category.parent[0].slug}`
        },
        {
          text: this.product.category.name,
          to: `/catalog/${this.product.category.parent[0].slug}/${
            this.product.category.slug
          }`
        },
        {
          text: this.product.name,
          to: this.$route.path
        }
        // {
        //   text: this.category.category.name,
        //   to: "/catalog/" + this.category.category.slug
        // },
        // {
        //   text: this.category.name,
        //   to: this.$route.path
        // }
      ];
    }
  },
  async asyncData(ctx) {
    const params = ctx.route.params;
    let client = ctx.app.apolloProvider.defaultClient;
    // const { data: categoriesData } = await client.query({
    //   query: gql`
    //     {
    //       categories {
    //         name
    //         slug
    //       }
    //     }
    //   `
    // });

    // const categories = categoriesData.categories;

    const { data: productData } = await client.query({
      query: gql`
        query ProductsQuery($slug: String!) {
          products(where: { slug: $slug }) {
            id
            name
            description
            img {
              url
            }
            SKU
            filters
            slug
            manufacturer {
              id
              name
            }
            category {
              id
              name
              slug
              parent {
                name
                slug
              }
            }
          }
        }
      `,
      variables: {
        slug: ctx.route.params.slug
      }
    });
    console.log(productData);
    // let category = categoryData.categories[0];
    const product = productData.products[0];
    return {
      product: product
      //   filters: category.filters || {},
      //   categories: categories
      //   category: category
    };
  }
};
</script>

<style lang="stylus">
.dialog-inner {
  position: relative;

  .close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}

.img-thumbnail {
  max-width: 100%;
  max-height: 300px;
}
</style>
