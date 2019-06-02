<template>
  <div>
    <section class="main-wrapper" :style="`background-image:url(${require('~/assets/bg1.jpg')})`">
      <!--:style="item.img && item.img.url ? `background-image:url(${imageBaseUrl+item.img.url})` : ''" -->
      <v-carousel
        hide-delimiters
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
              <v-flex class="flex text-xs-left justify-center column">
                <h2 class="display-4 mb-4 font-weight-bold" v-text="item.header"/>
                <p class="headline mb-4 font-weight-light" v-html="item.content"/>
                <v-btn
                  color="#1F5BFF"
                  :to="item.href"
                  nuxt
                  dark
                  class="ml-0 subheading font-weight-medium"
                  large
                >Подробнее</v-btn>
              </v-flex>
              <v-flex class="hidden-sm-and-down md6 lg4 pl-4">
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
            <h1 class="display-3 font-weight-bold w-100">{{title}}</h1>
            <p class="display-1">{{description}}</p>
          </v-layout>
        </v-container>
      </div>
    </section>
    <section>
      <v-container class="py-5" grid-list-lg>
        <v-layout row wrap justify-center>
          <v-flex xs12>
            <h2 class="text-uppercase text-xs-center mb-4">Наша продукция</h2>
          </v-flex>
          <!-- {{categories}} -->
          <v-flex xs12 sm6 md4 lg3 v-for="item in categories" :key="item.id">
            <v-card
              class="catalog-link-wrapper fill-height flex align-items"
              color="transparent"
              flat
              hover
              ripple
            >
              <nuxt-link :to="`/catalog/${item.slug}`" class="catalog-link" style>
                <div class="img-wrapper pa-2" v-if="item.img">
                  <img class="catalog-link-img d-block ma-auto" :src="imageBaseUrl+item.img.url">
                </div>

                <div class="pl-3 catalog-link-text font-weight-medium" style>{{item.name}}</div>
              </nuxt-link>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
    <section class="grey lighten-3">
      <v-container class="py-5" grid-list-lg>
        <v-layout row wrap justify-center>
          <!-- {{manufacturers}} -->
          <!-- <v-flex xs12> -->
          <h2 class="text-uppercase text-xs-center xs12 flex mb-4">ПРОИЗВОДИТЕЛИ</h2>
          <v-flex xs6 sm4 md4 lg3 v-for="item in manufacturers" :key="item.slug" class="mb-4">
            <v-card
              :to="`/manufacturers/${item.slug}`"
              class="align-center justify-center fill-height flex"
              style="display: flex;"
              nuxt
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
    <section v-if="sliders.length>0">
      <v-container class="py-5">
        <v-layout row wrap>
          <v-flex xs12>
            <h1 class="display-3 font-weight-bold">{{title}}</h1>
            <p class="display-1">{{description}}</p>
            <v-btn color="#1F5BFF" outline class="ml-0">О компании</v-btn>
          </v-flex>
          <!-- <v-flex xs2 class="px-2 pt-2">
            <img
              class="d-block mx-auto"
              style="max-width: 100%"
              :src="require('~/assets/info.svg')"
            >
          </v-flex>-->
        </v-layout>
      </v-container>
    </section>
    <!-- <v-layout column justify-center align-center> -->
    <!-- {{categories}} -->

    <!-- <template>
        <nuxt-link
          :to="'/catalog/'+item.slug"
          v-for="item in categories"
          :key="item.id"
        >{{item.name}}</nuxt-link>
    </template>-->
    <!-- <div style="height: 1000px; background-color: gray;
    width: 100%;"></div>-->
    <!-- </v-layout> 
    // .main-wrapper {

    // }-->
  </div>
</template>
<style lang="stylus" >
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
    display: flex;
    align-items: center;

    .img-wrapper {
      background-color: #1F5BFF;
      border-radius: 9px;

      .catalog-link-img {
        width: 40px;
        max-height: 40px;
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

<script>
import gql from "graphql-tag";

export default {
  head() {
    return {
      titleTemplate: "",
      title: "Азбука электронабжения",
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
      imageBaseUrl: process.env.imageBaseUrl,
      loading: false,
      search: null,
      select: null,
      title: "Электротехника и электрооборудование со склада и на заказ!",
      description:
        "Компания Азбука Электроснабжения — авторизованный дистрибьютор . Мы занимаемся продажей оборудования EATON, ETI, ..... и поддержкой своих клиентов через квалифицированные консультации по возможностям оборудования и его применению. Мы занимаемся продажей блоков питания,"
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
    await ctx.store.dispatch("fetchMainCategories");

    // console.log("TCL: data", data);
    return {
      // categories: categoriesData.categories, //categoriesData.categories
      manufacturers: pageData.manufacturers,
      sliders: pageData.sliders
    };
  },
  computed: {
    categories() {
      return this.$store.state.mainCategories;
    }
    // manufacturers() {
    //   return this.$store.state.manufacturers;
    // }
  },
  watch: {
    search(val) {
      val && val !== this.select && val.length > 3 && this.querySelections(val);
    }
  },
  methods: {
    async querySelections(v) {
      this.loading = true;
      const query = {
        size: 10,
        from: 0,
        query: {
          multi_match: {
            query: v,
            fields: ["name", "description", "SKU"]
          }
        }
      };
      this.loading = false;
    }
  }
};
</script>