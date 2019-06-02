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
              class="category-card-wrapper link mb-4 text-decoration-none align-start pa-3 xs12"
            >
              <h2 class="display-3 font-weight-bold" style="padding-right:56px;">{{item.name}}</h2>
              <p>{{item.description}}</p>

              <div class="img-wrapper pa-2" v-if="item.img && item.img.url">
                <img :src="imageBaseUrl+item.img.url" class="d-block ma-auto">
              </div>
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
    const data = await ctx.store.dispatch("fetchMainCategories");
    await ctx.store.dispatch("fetchGeneralInfo");

    return {
      categories: data
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

  .img-wrapper {
    background-color: #1F5BFF;
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
