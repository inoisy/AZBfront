<template>
  <div>
    <section class="grey lighten-2">
      <v-container>
        <breadcrumbs class="pl-1 mb-4" :items="breadcrumbsItems"/>
        <h1 class="display-5 mb-5 font-weight-bold">Каталог</h1>
      </v-container>
    </section>
    <section>
      <v-container v-bind="{ [`grid-list-${$vuetify.breakpoint.name}`]: true }" class="py-5">
        <!-- {{$vuetify.breakpoint.name}} -->
        <v-layout row wrap>
          <v-flex xs12>
            <v-card
              v-for="item in categories"
              :key="item.name"
              hover
              ripple
              :to="`/catalog/${item.slug}`"
              class="category-card-wrapper link mb-4 text-decoration-none align-start pa-3 xs12"
            >
              <!-- <div class="flex"> -->
              <h2 class="display-3 font-weight-bold" style="padding-right:56px;">{{item.name}}</h2>
              <p>{{item.description}}</p>

              <div class="img-wrapper pa-2" v-if="item.img && item.img.url">
                <img :src="imageBaseUrl+item.img.url" class="d-block ma-auto">
              </div>
              <!-- </div> -->
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
import gql from "graphql-tag";

import Breadcrumbs from "~/components/Breadcrumbs";

export default {
  components: {
    Breadcrumbs
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl
    };
  },
  async asyncData(ctx) {
    console.log(ctx.route.params);
    // let client = ctx.app.apolloProvider.defaultClient;
    // const { data: categoriesData } = await client.query({
    //   query: gql`
    //     {
    //       categories {
    //         name
    //         slug
    //         img {
    //           url
    //         }
    //       }
    //     }
    //   `
    // });
    // const categories = categoriesData.categories;
    // console.log("TCL: categories", categories);
    const data = await ctx.store.dispatch("fetchMainCategories");
    return {
      categories: data
    };
    // return {
    //   route: ctx.route.params.product
    // };
  },
  computed: {
    // categories() {
    //   return this.$store.state.categories;
    // },
    breadcrumbsItems() {
      return [
        {
          text: "Главная",
          to: "/"
        },
        {
          text: "Каталог",
          to: "/catalog"
        }
      ];
    }
  }
};
</script>
<style lang="stylus">
.category-card-wrapper {
  display: flex;
  flex-direction: column;

  .img-wrapper {
    background-color: #1F5BFF;
    // border-radius: 9px !important;
    // float: right;
    position: absolute;
    top: 0;
    right: 0;

    img {
      width: 40px;
      min-width: 40px;
    }
  }
}
</style>
