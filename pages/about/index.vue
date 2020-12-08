<template>
  <div>
    <default-header
      :breadcrumbs="breadcrumbs"
      :title="page.title"
    ></default-header>
    <section>
      <v-container class="py-12" grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12 md4 class="menu-wrapper mb-4">
            <nav-menu :menuItems="aboutPages" :isAbout="true"></nav-menu>
          </v-flex>
          <v-flex xs12 md8>
            <div v-html="$md.render(page.content)"></div>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
import gql from "graphql-tag";

import NavMenu from "~/components/NavMenu";
import DefaultHeader from "~/components/DefaultHeader";

export default {
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.title + " - Азбука электроснабжения",
        },
      ],
    };
  },
  components: {
    NavMenu,
    DefaultHeader,
  },
  async asyncData(ctx) {
    const params = ctx.route.params;
    let client = ctx.app.apolloProvider.defaultClient;
    const { data: pagesData } = await client.query({
      query: gql`
        {
          about {
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
      page: pagesData.about,
    };
  },
  data() {
    return {
      title: "О компании",
    };
  },

  computed: {
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
          text: this.title,
          to: this.$route.path,
        },
      ];
    },
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
