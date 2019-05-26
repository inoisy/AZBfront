<template>
  <div>
    <section class="grey lighten-2">
      <v-container class="pb-4">
        <v-layout row wrap>
          <!-- <v-flex> -->
          <breadcrumbs class="pl-1 mb-4 flex xs12" :items="breadcrumbs"/>
          <h1 class="mb-5">Производители</h1>
          <!-- </v-flex> -->
        </v-layout>
      </v-container>
    </section>
    <!-- {{manufacturers}} -->
    <v-container class="py-5">
      <v-layout row wrap>
        <v-card
          :to="`/manufacturers/${item.slug}`"
          class="flex xs12 mb-4 pa-3 pt-4"
          v-for="(item,index) in manufacturers"
          :key="index"
          hover
          ripple
        >
          <v-layout row wrap>
            <v-flex class="xs12 sm4 justify-center align-center layout">
              <img
                class="display-block"
                style="max-width:100%"
                v-if="item.img"
                :src="imageBaseUrl+item.img.url"
                :alt="item.name"
              >
            </v-flex>
            <v-flex class="xs12 sm8">
              <h2 class="mb-4 font-weight-bold">{{item.name}}</h2>
              <div class="display-1" v-html="item.description"></div>
            </v-flex>
          </v-layout>

          <!-- <p></p> -->
        </v-card>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Breadcrumbs from "~/components/Breadcrumbs";

export default {
  components: {
    Breadcrumbs
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
          to: this.$route.path
        }
      ];
    }
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl
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
      `
    });
    // const manufacturers = ;
    console.log("TCL: asyncData -> manufacturersData", manufacturersData);

    return {
      manufacturers: manufacturersData.manufacturers
    };
  }
};
</script>

<style>
</style>
