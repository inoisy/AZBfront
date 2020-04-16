<template>
  <div>
    <default-header :breadcrumbs="breadcrumbs" :title="category.name"></default-header>

    <v-container class="pt-8" grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12 md4 lg3 class="menu-wrapper mb-4 hidden-sm-and-down">
          <nav-menu :menuItems="categories" type="catalog"></nav-menu>
        </v-flex>
        <v-flex xs12 md8 lg9>
          <v-card
            hover
            ripple
            :to="`/catalog/${category.slug}/${item.slug}`"
            class="mb-4 pa-3"
            v-for="item in category.child"
            :key="item.id"
          >
            <h2
              class="font-weight-bold mb-0"
              style="font-size: 1.3rem; line-height: normal;"
            >{{item.name}}</h2>
            <div class="mt-3" v-show="item.description">{{item.description}}</div>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <section class="grey lighten-2" v-if="category.content && category.content.length>0">
      <v-container class="py-10" grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12>
            <h2 class="mb-4">Купить {{category.name.toLowerCase()}} в Москве с доставкой по всей РФ.</h2>
            <div v-html="$md.render(category.content)"></div>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Breadcrumbs from "~/components/Breadcrumbs";
import NavMenu from "~/components/NavMenu";
import DefaultHeader from "~/components/DefaultHeader";
import CategoryCard from "~/components/CategoryCard";

export default {
  head() {
    const name = this.category.name;
    const description = this.category.description
      ? this.category.description + " - Азбука электроснабжения"
      : `Купить ${name} по выгодным ценам. Отгрузка со склада в Москве, доставка по всей РФ. Азбука Электроснабжения.`;
    return {
      title: name,
      meta: [
        {
          hid: "description",
          name: "description",
          content: description
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
    Breadcrumbs,
    NavMenu,
    DefaultHeader,
    CategoryCard
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

            child(sort: "name:asc") {
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
    // console.log("TCL: categoryData", categoryData);
    await ctx.store.dispatch("fetchGeneralInfo");

    return {
      filters: category.filters || {},
      categories: ctx.store.state.generalInfo.categories, //categoryData.categoriesMain, //await ctx.store.dispatch("fetchMainCategories"),
      category: category
    };
  }
};
</script>
<style lang="stylus" scoped>
.menu-wrapper {
}

@media (min-width: 960px) {
  .menu-wrapper {
    padding-right: 30px;
    // flex-basis: 22rem;
    // max-width: 22rem;
  }
}
</style>
