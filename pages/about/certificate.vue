<template>
  <div>
    <section class="grey lighten-2">
      <v-container>
        <breadcrumbs class="pl-1" :items="breadcrumbs"/>
        <h1 class="mb-4">{{title}}</h1>
      </v-container>
    </section>
    <v-container class="py-5">
      <v-layout row wrap>
        <v-flex xs4 class="pr-5">
          <nav-menu :menuItems="menuItems"></nav-menu>
          <!-- <v-list class="elevation-2">
            <v-list-tile v-for="item in menuItems" :key="item.text" :to="item.to">{{item.text}}</v-list-tile>
          </v-list>-->
        </v-flex>
        <v-flex xs8 v-for="item in certificates" :key="item.id">
          <card :item="item" :href="null">
            <template v-slot:subheader>
              <p class="mb-2 d-inline-block display-1">
                Производитель:
                <nuxt-link
                  class="link-hover"
                  :to="`/manufacturers/${item.manufacturer.slug}`"
                >{{item.manufacturer.name}}</nuxt-link>
              </p>

              <p
                class="mb-2 display-1"
              >Срок действия: {{new Date(item.expirationDate).toLocaleDateString("ru-RU", { year: 'numeric', month: 'numeric', day: 'numeric' })}}</p>
            </template>
            <template v-slot:addToHeader>{{item.manufacturer.name}}</template>
          </card>
          <!-- <v-card class="pa-3 d-flex">
            <div class="flex xs4 pr-3">
              <img class="d-block mx-auto" :src="baseUrl+item.img.url" alt>
            </div>
            <div class="flex xs8">
              <p class="title">{{item.name}}</p>
              <p>{{item.description}}</p>
            </div>
          </v-card>-->
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Breadcrumbs from "~/components/Breadcrumbs";
import NavMenu from "~/components/NavMenu";
import Card from "~/components/Card";
export default {
  components: {
    Breadcrumbs,
    NavMenu,
    Card
  },
  data() {
    return {
      title: "Сертификаты",
      baseUrl: process.env.imageBaseUrl,
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
  computed: {
    breadcrumbs() {
      return [
        {
          text: "Главная",
          to: "/"
        },
        {
          text: "О компании",
          to: "/about"
        },
        {
          text: this.title,
          to: this.$route.path
        }
      ];
    }
  },
  async asyncData(ctx) {
    const params = ctx.route.params;
    let client = ctx.app.apolloProvider.defaultClient;

    const baseUrl = process.env.baseUrl;
    const { data: certificatesData } = await client.query({
      query: gql`
        {
          certificates {
            id
            name
            description
            expirationDate
            img {
              url
            }
            manufacturer {
              name
              slug
            }
          }
        }
      `
      //   variables: {
      //     slug: ctx.route.params.subCategory
      //   }
    });
    // const certificates =
    // console.log("TCL: asyncData -> certificates", certificates);
    return {
      certificates: certificatesData.certificates
    };
    // await ctx.store.dispatch("fetchProducts", {
    //   categoryId: subcategoryData.subcategories[0].id,
    //   filters: null,
    //   size: 10,
    //   from: 0
    // });

    // const { data: manufacturersData } = await client.query({
    //   query: gql`
    //     query ManufacturerQuery($id: [ID!]!) {
    //       manufacturers(where: { id_in: $id }) {
    //         id
    //         name
    //         slug
    //       }
    //     }
    //   `,
    //   variables: {
    //     id: subcategoryData.subcategories[0].manufacturersfilter
    //   }
    // });
    // console.log("TCL: manufacturersData", manufacturersData);

    // return {
    //   category: subcategoryData.subcategories[0],
    //   manufacturers: manufacturersData.manufacturers
    // };
  }
};
</script>

<style>
</style>
