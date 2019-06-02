<template>
  <div>
    <section class="grey lighten-2">
      <v-container>
        <breadcrumbs class="pl-1 mb-4" :items="breadcrumbs"/>
        <h1 class="display-4 mb-5 font-weight-bold">{{category.name}}</h1>
      </v-container>
    </section>
    <v-container class="py-5">
      <v-layout row wrap v-if="category.child && category.child.length > 0">
        <v-card
          hover
          ripple
          :to="`/catalog/${category.slug}/${item.slug}`"
          class="mb-4 flex xs12 pa-3 text-decoration-none display-flex row wrap layout"
          v-for="item in category.child"
          :key="item.id"
        >
          <v-flex xs12 md4>
            <v-img contain max-height="300px" v-if="item.img" :src="imageBaseUrl+ item.img.url"></v-img>
          </v-flex>
          <v-flex xs12 md8 class="pt-4">
            <h2 class="display-3 font-weight-bold">{{item.name}}</h2>
            <div class="display-1">{{item.description}}</div>
          </v-flex>
        </v-card>
      </v-layout>
    </v-container>
    <section class="grey lighten-2" v-if="category.content && category.content.length>0">
      <v-container class="py-5">
        <v-layout row wrap>
          <h2 class="mb-4">Купить {{category.name.toLowerCase()}} в Москве с доставкой по всей РФ.</h2>
          <div v-html="category.content"></div>
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
      title: this.category.name,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.category.description + " - Азбука электроснабжения"
        }
      ]
    };
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl
    };
  },
  components: {
    Breadcrumbs
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
          text: this.category ? this.category.name : null,
          to: this.$route.path
        }
      ];
    }
  },

  async asyncData(ctx) {
    const params = ctx.route.params;
    let client = ctx.app.apolloProvider.defaultClient;
    const { data: categoryData } = await client.query({
      query: gql`
        query CateforiesQuery($slug: String!) {
          categories(where: { slug: $slug }) {
            id
            name
            description
            content
            slug
            manufacturers {
              id
              name
              slug
            }
            child(sort: "name:ASC") {
              id
              name
              description
              slug
              img {
                url
              }
            }
          }
        }
      `,
      variables: {
        slug: ctx.route.params.category
      }
    });
    const category = categoryData.categories[0];
    console.log("TCL: categoryData", categoryData);
    await ctx.store.dispatch("fetchGeneralInfo");

    return {
      filters: category.filters || {},
      categories: await ctx.store.dispatch("fetchMainCategories"),
      category: category
    };
  }
};
</script>