<template>
  <div>
    <section class="grey lighten-2">
      <v-container grid-list-xs>
        <breadcrumbs class="pl-1 mb-4" :items="breadcrumbs"/>
        <h1 class="display-5 mb-5 font-weight-bold">{{title}}</h1>
      </v-container>
    </section>
    <v-container class="py-5">
      <v-layout row wrap>
        <v-flex xs4 class="pr-5">
          <nav-menu :menuItems="menuItems"></nav-menu>
        </v-flex>
        <v-flex xs8>
          <div class="display-1" v-html="page.content"></div>
        </v-flex>
      </v-layout>
    </v-container>
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
  data() {
    return {
      title: "Доставка",
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
    // const { data: pagesData } = await client.query({
    //   variables: {
    //     slug: "delivery"
    //   },
    //   query: gql`
    //     query PagesQuery($slug: String!) {
    //       pages(where: { slug: $slug }) {
    //         id
    //         name
    //         description
    //         content
    //       }
    //     }
    //   `
    // });
    // console.log("TCL: asyncData -> pagesData", pagesData);
    return {
      page: {
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      }
      //pagesData.pages[0]
    };
  }
  //       //   variables: {
  //       //     slug: ctx.route.params.subCategory
  //       //   }
  //     });
  //     const certificates = certificatesData.certificates;
  //     console.log("TCL: asyncData -> certificates", certificates);
  //     return {
  //       certificates: certificates
  //     };
  //     // await ctx.store.dispatch("fetchProducts", {
  //     //   categoryId: subcategoryData.subcategories[0].id,
  //     //   filters: null,
  //     //   size: 10,
  //     //   from: 0
  //     // });

  //     // const { data: manufacturersData } = await client.query({
  //     //   query: gql`
  //     //     query ManufacturerQuery($id: [ID!]!) {
  //     //       manufacturers(where: { id_in: $id }) {
  //     //         id
  //     //         name
  //     //         slug
  //     //       }
  //     //     }
  //     //   `,
  //     //   variables: {
  //     //     id: subcategoryData.subcategories[0].manufacturersfilter
  //     //   }
  //     // });
  //     // console.log("TCL: manufacturersData", manufacturersData);

  //     // return {
  //     //   category: subcategoryData.subcategories[0],
  //     //   manufacturers: manufacturersData.manufacturers
  //     // };
  //   }
};
</script>

<style>
</style>
