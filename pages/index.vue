<template>
  <div>
    <section class="main-wrapper" :style="`background-image:url(${require('~/assets/bg1.jpg')})`">
      <v-carousel
        hide-delimiters
        :hide-controls="sliders.length < 2"
        height="35rem"
        light
        :cycle="false"
        v-if="sliders && sliders.length > 0"
      >
        <v-carousel-item
          v-for="(item,i) in sliders"
          :key="i"
          class="background-wrapper"
          transition="fade-transition"
          reverse-transition="fade-transition"
        >
          <v-container fill-height class="main-content">
            <v-layout justify-center align-center>
              <v-flex md7 lg8 class="text-xs-left justify-center column">
                <h2 class="display-4 mb-4 font-weight-bold" v-text="item.header"/>
                <p class="headline mb-4 font-weight-light" v-html="item.content"/>
                <v-btn
                  v-if="item.buttontext"
                  color="#1F5BFF"
                  :to="item.href"
                  nuxt
                  dark
                  class="ml-0 subheading font-weight-medium"
                  large
                >{{item.buttontext}}</v-btn>
              </v-flex>
              <v-flex md5 lg4 v-if="item.img" class="hidden-sm-and-down py-4 pr-4 pl-5">
                <img
                  class="d-block"
                  style="width:100%"
                  :src="imageBaseUrl+item.img.url"
                  :alt="item.header"
                >
              </v-flex>
            </v-layout>
          </v-container>
        </v-carousel-item>
      </v-carousel>
      <div v-else>
        <v-container fill-height>
          <v-layout row wrap align-center class="text-xs-center">
            <h1 class="display-3 font-weight-bold w-100">{{page.title}}</h1>
            <p class="display-1">{{page.description}}</p>
          </v-layout>
        </v-container>
      </div>
    </section>
    <section>
      <v-container class="py-5" grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12>
            <h2 class="text-uppercase text-xs-center mb-4">КАТЕГОРИИ ТОВАРОВ</h2>
          </v-flex>
          <v-flex xs12 sm6 md4 lg3 v-for="item in categories" :key="item.id">
            <v-card
              class="catalog-link-wrapper fill-height flex pa-0"
              color="transparent"
              hover
              ripple
            >
              <nuxt-link :to="`/catalog/${item.slug}`" class="catalog-link" style>
                <div class="img-wrapper px-3 py-4 grey lighten-3">
                  <img
                    class="catalog-link-img d-block ma-auto"
                    :src="item.img ? imageBaseUrl+item.img.url : require('~/assets/no-image1.png')"
                  >
                </div>

                <div class="pa-3 catalog-link-text font-weight-medium" style>{{item.name}}</div>
              </nuxt-link>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
    <section class="grey lighten-3">
      <v-container class="py-5" grid-list-lg>
        <v-layout row wrap justify-center>
          <h2 class="text-uppercase text-xs-center xs12 flex mb-4">ПРОИЗВОДИТЕЛИ</h2>
          <v-flex xs6 sm4 md4 lg3 v-for="item in manufacturers" :key="item.slug" class="mb-4">
            <v-card
              :to="`/manufacturers/${item.slug}`"
              class="manufacturer-card align-center justify-center fill-height flex"
              style="display: flex;"
              nuxt
              flat
              color="transparent"
              hover
              ripple
            >
              <img
                v-if="item.img && item.img.url"
                class="mx-auto d-block"
                :src="imageBaseUrl + item.img.url"
                :alt="item.name"
                style="max-width:100%; "
              >
              <p v-else>{{item.name}}</p>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
    <section>
      <v-container class="py-5">
        <v-layout row wrap>
          <v-flex xs12>
            <div class="display-1 mb-4" v-html="$md.render(page.content)"></div>
            <v-btn color="#1F5BFF" large dark class="ml-0">О компании</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  head() {
    return {
      // titleTemplate: "",
      title: "Интернет магазин электротехники и электрооборудования",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "Электротехника и электрооборудование со склада и на заказ - Азбука электронабжения"
        }
      ]
    };
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl
      // loading: false,
      // select: null,
    };
  },
  async asyncData(ctx) {
    let client = ctx.app.apolloProvider.defaultClient;
    const { data: pageData } = await client.query({
      query: gql`
        {
          pages(where: { slug: "index" }) {
            title
            description
            slug
            description
            content
          }
          categories(where: { ismain: true }) {
            id
            name
            slug
            img {
              url
            }
          }
          manufacturers {
            id
            name
            slug
            img {
              url
            }
          }
          sliders {
            id
            header
            content
            href
            buttontext
            img {
              url
            }
          }
        }
      `
    });
    //  manufacturers {
    //       id
    //       name
    //       slug
    //       description
    //       img {
    //         url
    //       }
    //     }
    // console.log("TCL: categories", categoriesData);
    // const categories = [
    //   {
    //     name: "Автоматические выключатели"
    //   }
    // ];
    await ctx.store.dispatch("fetchGeneralInfo");
    // await ctx.store.dispatch("fetchMainCategories");

    // console.log("TCL: data", data);
    return {
      // categories: categoriesData.categories, //categoriesData.categories
      manufacturers: pageData.manufacturers,
      sliders: pageData.sliders,
      page: pageData.pages[0],
      categories: pageData.categories
    };
  },
  computed: {
    // categories() {
    //   return this.$store.state.mainCategories;
    // }
    // manufacturers() {
    //   return this.$store.state.manufacturers;
    // }
  }
  // watch: {
  //   search(val) {
  //     val && val !== this.select && val.length > 3 && this.querySelections(val);
  //   }
  // },
  // methods: {
  //   async querySelections(v) {
  //     this.loading = true;
  //     const query = {
  //       size: 10,
  //       from: 0,
  //       query: {
  //         multi_match: {
  //           query: v,
  //           fields: ["name", "description", "SKU"]
  //         }
  //       }
  //     };
  //     this.loading = false;
  //   }
  // }
};
</script>
<style lang="stylus" >
.manufacturer-card {
  img {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  }
}

.manufacturer-card {
  &:hover {
    img {
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
      transform: scale(1.1);
    }
  }
}

.v-window__container, .v-window-item, .v-carousel__item {
  height: 100% !important;
}

.fade {
  &-enter-active, &-leave-active, &-leave-to {
    transition: 0.3s ease-out;
    position: absolute;
    top: 0;
    left: 0;
  }

  &-enter, &-leave, &-leave-to {
    opacity: 0;
  }
}

// }
.background-wrapper {
  background-size: cover;
  background-position: center;
}

.v-carousel {
  box-shadow: none !important;
  // height: 100%;
}

.catalog-link-wrapper {
  .catalog-link {
    text-decoration: none;

    // display: flex;
    // align-items: center;
    .img-wrapper {
      // background-color: #1F5BFF;
      // border-radius: 9px;
      .catalog-link-img {
        max-height: 200px;
        // width: 40px;
        // max-height: 40px;
      }
    }

    .catalog-link-text {
      font-size: 1.3rem;
      position: relative;
    }
  }

  &:hover {
    .catalog-link-text {
      color: #1F5BFF;
    }
  }
}

.main-wrapper {
  min-height: 35rem;
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  position: relative;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  .main-content {
    position: relative;
  }
}

.main-content {
  padding-left: 45px;
  padding-right: 45px;
}

// @media (min-width: 600px) {
// .main-wrapper {
// height: 30rem;
// }
// }
@media (min-width: 960px) {
}
</style>
