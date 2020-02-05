<template>
  <div>
    <default-header :breadcrumbs="breadcrumbs" :title="page.title"></default-header>
    <v-container class="py-12">
      <v-layout row wrap>
        <v-flex xs12 md4 class="menu-wrapper mb-4">
          <nav-menu :menuItems="aboutPages" type="about"></nav-menu>
        </v-flex>
        <v-flex xs12 md8>
          <card v-for="item in certificates" :key="item.id" :item="item" :href="null">
            <template v-slot:subheader>
              <p class="mb-2 d-inline-block" v-if="item.manufacturer">
                Производитель:
                <nuxt-link
                  class="link-hover"
                  :to="`/manufacturers/${item.manufacturer.slug}`"
                >{{item.manufacturer.name}}</nuxt-link>
              </p>
              <p
                class="mb-2"
              >Срок действия: {{new Date(item.expirationDate).toLocaleDateString("ru-RU", { year: 'numeric', month: 'numeric', day: 'numeric' })}}</p>
            </template>
            <template v-slot:addToHeader>{{item.manufacturer.name}}</template>
          </card>
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
import DefaultHeader from "~/components/DefaultHeader";

export default {
  head() {
    return {
      title: "Сертификаты",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Сертификаты - Азбука электроснабжения"
        }
      ]
    };
  },
  components: {
    Breadcrumbs,
    NavMenu,
    Card,
    DefaultHeader
  },
  data() {
    return {
      baseUrl: process.env.imageBaseUrl
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
          text: this.page.title,
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
          pages(where: { slug: "certificate" }) {
            title
            slug
            description
            content
            parent {
              title
              children {
                title
                slug
              }
            }
          }
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
    });
    await ctx.store.dispatch("fetchGeneralInfo");
    return {
      certificates: certificatesData.certificates,
      page: certificatesData.pages[0]
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
