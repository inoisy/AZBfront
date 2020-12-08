<template>
  <div>
    <section class="grey lighten-2">
      <v-container class="pb-5">
        <breadcrumbs class="pl-1 mb-4 flex xs12" :items="breadcrumbs" />
        <h1 class="mb-12">Производители</h1>
      </v-container>
    </section>
    <!-- {{manufacturers}} -->
    <v-container class="py-12">
      <v-layout row wrap>
        <v-card
          :to="`/manufacturers/${item.slug}`"
          class="flex xs12 mb-4 pa-3 pt-3"
          v-for="(item, index) in manufacturers"
          :key="index"
          hover
          ripple
        >
          <v-layout row wrap>
            <v-flex class="xs12 sm4 justify-center align-center layout">
              <img
                class="display-block"
                style="max-width: 70%"
                v-if="item.img"
                :src="imageBaseUrl + item.img.url"
                :alt="item.name"
              />
            </v-flex>
            <v-flex class="xs12 sm8 pb-2">
              <h2 class="mb-2 font-weight-bold">{{ item.name }}</h2>
              <div v-html="item.description"></div>
            </v-flex>
          </v-layout>
        </v-card>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Breadcrumbs from "~/components/Breadcrumbs";

export default {
  head() {
    return {
      title: "Производители",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Производители - Азбука электронабжения",
        },
      ],
    };
  },
  components: {
    Breadcrumbs,
  },
  computed: {
    breadcrumbs() {
      // console.log(this.$route);
      return [
        {
          text: "Главная",
          to: "/",
        },
        {
          text: "Производители",
          to: this.$route.path,
        },
      ];
    },
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
    };
  },
  async asyncData(ctx) {
    let client = ctx.app.apolloProvider.defaultClient;
    const { data: manufacturersData } = await client.query({
      query: gql`
        {
          manufacturers {
            id
            name
            slug
            description
            img {
              url
            }
          }
        }
      `,
    });
    // await ctx.store.dispatch("fetchGeneralInfo");

    return {
      manufacturers: manufacturersData.manufacturers,
    };
  },
};
</script>

<style>
</style>
