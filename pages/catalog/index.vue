<template>
  <div>
    <section class="grey lighten-2">
      <v-container grid-list-lg>
        <breadcrumbs class="pl-1 mb-4" :items="breadcrumbsItems" />
        <h1 class="mb-12 font-weight-bold">Каталог</h1>
      </v-container>
    </section>
    <section>
      <v-container
        grid-list-lg
        class="py-12"
      >
        <v-layout row wrap>
          <v-flex xs12>
            <category-card
              v-for="item in categories"
              :key="item.name"
              :item="item"
              :to="`/catalog/${item.slug}`"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
import gql from "graphql-tag";

import Breadcrumbs from "~/components/Breadcrumbs";
import CategoryCard from "~/components/CategoryCard";

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
    Breadcrumbs,
    CategoryCard
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
    // await ctx.store.dispatch("fetchGeneralInfo");

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































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































// .category-card-wrapper {































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































//   display: flex;































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































//   flex-direction: column;































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































// }































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































</style>
