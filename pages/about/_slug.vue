<template>
  <div>
    <default-header :breadcrumbs="breadcrumbs" :title="page.title"></default-header>
    <v-container class="py-5">
      <v-layout row wrap>
        <v-flex xs12 md4 class="menu-wrapper mb-4">
          <nav-menu :menuItems="aboutPages" type="about"></nav-menu>
        </v-flex>
        <v-flex xs12 md8>
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
import DefaultHeader from "~/components/DefaultHeader";

export default {
  head() {
    return {
      title: this.page.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.page.title + " - Азбука электроснабжения"
        }
      ]
    };
  },
  components: {
    Breadcrumbs,
    NavMenu,
    DefaultHeader
  },
  data() {
    return {
      title: "Доставка"
    };
  },
  computed: {
    aboutPages() {
      return this.$store.state.generalInfo.aboutPages;
    },
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
    const { data: pagesData } = await client.query({
      variables: {
        slug: params.slug
      },
      query: gql`
        query PagesQuery($slug: String!) {
          pages(where: { slug: $slug }) {
            title
            slug
            description
            content
          }
        }
      `
    });
    await ctx.store.dispatch("fetchGeneralInfo");
    return {
      page: pagesData.pages[0]
    };
  }
};
</script>

<style lang="stylus" scoped>
@media (min-width: 960px) {
  .menu-wrapper {
    padding-right: 30px;
  }
}
</style>
