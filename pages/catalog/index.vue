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
        <v-layout row wrap>
          <v-flex xs12>
            <v-card
              v-for="item in categories"
              :key="item.name"
              hover
              ripple
              :to="`/catalog/${item.slug}`"
              class="category-card-wrapper link mb-4 text-decoration-none align-start pa-3 xs12 layout wrap row"
            >
              <v-flex xs12 md3 lg2 class="px-3">
                <v-img
                  contain
                  max-height="170px"
                  :src="item.img ? imageBaseUrl+item.img.url : require('~/assets/no-image1.png')"
                ></v-img>
              </v-flex>
              <v-divider class="flex xs12 hidden-md-and-up mt-3 mb-2"></v-divider>
              <v-flex xs12 md9 lg10>
                <h2 class="display-2 font-weight-bold">{{item.name}}</h2>
                <div class="display-1">{{item.description}}</div>
              </v-flex>
              <!-- </v-card> -->
              <!-- <h2 class="display-3 font-weight-bold" style="padding-right:56px;">{{item.name}}</h2>
              <p>{{item.description}}</p>

              <div class="img-wrapper pa-2">
                <img
                  :src="item.img ? imageBaseUrl+item.img.url : require('~/assets/no-image1.png')"
                  class="d-block ma-auto"
                >
              </div>-->
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
  head() {
    return {
      title: "Каталог",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Каталог - Азбука электроснабжения"
        }
      ]
    };
  },
  components: {
    Breadcrumbs
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl
    };
  },
  async asyncData(ctx) {
    let client = ctx.app.apolloProvider.defaultClient;
    const { data: categoryData } = await client.query({
      query: gql`
        {
          categories(where: { ismain: true }, sort: "name:asc") {
            id
            name
            slug
            description
            img {
              url
            }
          }
        }
      `
    });
    // # const data = await ctx.store.dispatch("fetchMainCategories");
    await ctx.store.dispatch("fetchGeneralInfo");

    return {
      categories: categoryData.categories
    };
  },
  computed: {
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
}
</style>
