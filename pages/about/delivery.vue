<template>
  <div>
    <default-header
      :breadcrumbs="breadcrumbs"
      :title="page.title"
    ></default-header>
    <v-container class="py-12" grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12 md4 class="menu-wrapper mb-4">
          <nav-menu :menuItems="aboutPages" :isAbout="true"></nav-menu>
        </v-flex>
        <v-flex xs12 md8>
          <div class v-html="$md.render(page.content)"></div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Breadcrumbs from "~/components/Breadcrumbs";
import NavMenu from "~/components/NavMenu";
import DefaultHeader from "~/components/DefaultHeader";

export default {
  head() {
    return {
      title: this.page.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.page.title + " - Азбука электроснабжения",
        },
      ],
    };
  },
  components: {
    Breadcrumbs,
    NavMenu,
    DefaultHeader,
  },
  data() {
    return {
      title: "Доставка",
    };
  },
  computed: {
    // aboutPages() {
    //   return this.$store.state.generalInfo.aboutPages;
    // },
    aboutPages() {
      return [
        {
          name: "Доставка",
          slug: "delivery",
        },
        {
          name: "Сертификаты",
          slug: "certificate",
        },
      ];
    },
    breadcrumbs() {
      return [
        {
          text: "Главная",
          to: "/",
        },
        {
          text: "О компании",
          to: "/about",
        },
        {
          text: this.title,
          to: this.$route.path,
        },
      ];
    },
  },
  async asyncData(ctx) {
    const params = ctx.route.params;
    let client = ctx.app.apolloProvider.defaultClient;

    const baseUrl = process.env.baseUrl;
    const { data: pagesData } = await client.query({
      // variables: {
      //   slug: params.slug
      // },
      query: gql`
        {
          delivery {
            title
            slug
            description
            content
          }
        }
      `,
    });
    // await ctx.store.dispatch("fetchGeneralInfo");
    return {
      page: pagesData.delivery,
    };
  },
};
</script>

<style lang="stylus" scoped>
@media (min-width: 960px) {
  .menu-wrapper {
    padding-right: 30px;
  }
}
</style>
