<template>
  <div>
    <default-header :breadcrumbs="breadcrumbs" :title="product.name"></default-header>
    <!-- <section class="grey lighten-2">
      <v-container class="text-center text-md-left">
        <breadcrumbs class="pl-1" :items="breadcrumbs"/>
        <h1>{{product.name}}</h1>
      </v-container>
    </section>-->
    <v-container class="py-12" grid-list-lg>
      <v-layout row wrap>
        <v-flex xs12 md8 lg9 order-xs2 order-md1 class="pr-3">
          <p v-if="product.description">
            <span class="font-weight-bold">Описание:&nbsp;</span>
            {{product.description}}
          </p>
          <p v-if="product.manufacturer">
            <span class="font-weight-bold">Производитель:&nbsp;</span>
            <nuxt-link
              :to="`/manufacturers/${product.manufacturer.slug}`"
            >{{product.manufacturer.name}}</nuxt-link>
          </p>
          <p>
            <span class="font-weight-bold">Артикул:&nbsp;</span>
            {{product.SKU}}
          </p>
          <p v-for="(item,index) in Object.keys(product.filters)" :key="index">
            <span class="font-weight-bold">{{item}}:&nbsp;</span>
            {{product.filters[item]}}
          </p>
          <a
            target="_blank"
            v-if="product.document"
            class="mb-3 link-hover display-flex align-center text-decoration-none"
            :href="imageBaseUrl+product.document.url"
          >
            <v-icon class="mr-2 text-decoration-none" style="color:currentColor">picture_as_pdf</v-icon>
            <u>Техническая документация</u>
          </a>
        </v-flex>
        <!-- {{product.productimage}} -->
        <v-flex xs12 md4 lg3 order-xs1 order-md2 class="mb-4" v-if="product.productimage">
          <v-card
            class="pa-5 mb-4"
            style="border-radius: 10px"
            hover
            ripple
            @click="dialogImg=!dialogImg"
          >
            <img
              class="img-thumbnail d-block mx-auto"
              v-if="product.productimage.thumbnail"
              :src="imageBaseUrl+product.productimage.thumbnail.url"
              :alt="product.name"
              :title="product.name"
            />
          </v-card>
          <v-dialog v-model="dialogImg" v-if="product.productimage.img">
            <div
              class="pa-3 fullscreen-img"
              v-lazy:background-image="imageBaseUrl+product.productimage.img.url"
            >
              <v-btn
                class="close-btn"
                text
                icon
                large
                outlined
                color="primary"
                @click="dialogImg = false"
                style="position:absolute; top:16px; right: 16px; z-index: 10"
              >
                <v-icon>close</v-icon>
              </v-btn>
            </div>
          </v-dialog>
          <v-btn
            class="ma-0"
            large
            color="#1F5BFF"
            dark
            style="width: 100%"
            @click="handleOffer"
          >заказать</v-btn>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="mt-4">
        <v-flex>
          <v-tabs v-model="tab" grow>
            <v-tabs-slider color="#1F5BFF"></v-tabs-slider>
            <v-tab v-if="product.content">Техническое описание</v-tab>
            <v-tab>Доставка</v-tab>
            <v-tab>Оплата</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item v-if="product.content">
              <v-card flat class="content-wrapper pa-3" color="#f9f9f9" v-html="product.content"></v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat color="#f9f9f9" class="pa-3">
                <div class="tabsText" style="display: block;">
                  <p>
                    <b>Самовывоз с нашего склада:</b>
                    <br />По адресу: г. Москва Загородное шоссе дом 1 корпус 2 офис 212
                  </p>
                  <p>
                    <b>Доставка до двери</b>
                    <br />Осуществляется курьерской службой или транспортной компанией (на Ваш выбор). Мы работаем с ведущими транспортными компаниями и доставляем заказы во все регионы России и Казахстана.
                  </p>
                  <p>
                    <b>Доставка до терминала</b>
                    <br />Транспортной компании в Москва – БЕСПЛАТНО.
                  </p>
                </div>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat color="#f9f9f9" class="pa-3">
                Банковский перевод: счет на оплату формируется после оформления заказа или отправки заявки в произвольной форме на электронную почту
                <a
                  :href="`mailto:mail@azb-es.ru`"
                >mail@azb-es.ru</a>
                <br />Специалист свяжется с вами для уточнения деталей.
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<style lang="stylus" >
.content-wrapper {
  h2 {
    font-size: 1.5rem;
    font-weight: 500;
  }

  table {
    // background-color: #FFFFFF;
    color: rgba(0, 0, 0, 0.87);
    border-spacing: 0;
    margin-bottom: 1.5rem;
    width: 100%;

    td {
      >* {
        min-height: 36px;
        display: inline-flex;
        align-items: center;
      }
    }

    .val {
      min-width: 70px;
    }
  }

  table td {
    height: 36px;
    padding: 5px;
    // display: inline-flex;
    // box-sizing: border-box;
  }

  table thead tr:last-child th {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
  }

  table thead tr th {
    color: rgba(0, 0, 0, 0.6);
  }

  table tr:not(:last-child) td, table tr:not(:last-child) th {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
  }

  table tr:not(:last-child) td:last-child, table tr:not(:last-child) th:last-child {
    border-bottom: thin solid rgba(0, 0, 0, 0.12);
  }

  table tr.active {
    background: #f5f5f5;
  }

  table tr:hover {
    background: #eeeeee;
  }
}

.img-thumbnail {
  max-width: 100%;
  max-height: 200px;
}

.fullscreen-img {
  background-color: white;
  position: relative;
  height: 90vh;
  background-repeat: no-repeat;
  width: 100%;
  background-position: center;
  background-size: contain;
  padding: 20px 0;
  background-origin: content-box;
  /* margin: 15px; */
}
</style>

<script>
import gql from "graphql-tag";
import Breadcrumbs from "~/components/Breadcrumbs";
import DefaultHeader from "~/components/DefaultHeader";

export default {
  methods: {
    handleOffer() {
      this.$store.commit("dialog", {
        name: this.product.name,
        isShow: true
      });
    }
  },
  head() {
    return {
      title: this.product.name,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.product.description || this.product.name
        }
      ]
    };
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      dialog: false,
      dialogImg: false,
      tab: null,
      items: ["Техническое описание", "Доставка", "Оплата"]
    };
  },
  components: {
    Breadcrumbs,
    DefaultHeader
  },
  computed: {
    contacts() {
      return this.$store.state.contacts;
    },
    breadcrumbs() {
      if (!this.product) return;
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
          text: this.product.category.parent[0].name,
          to: `/catalog/${this.product.category.parent[0].slug}`
        },
        {
          text: this.product.category.name,
          to: `/catalog/${this.product.category.parent[0].slug}/${this.product.category.slug}`
        },
        {
          text: this.product.name,
          to: this.$route.path
        }
        // {
        //   text: this.category.category.name,
        //   to: "/catalog/" + this.category.category.slug
        // },
        // {
        //   text: this.category.name,
        //   to: this.$route.path
        // }
      ];
    }
  },
  async asyncData(ctx) {
    const params = ctx.route.params;
    // console.log("TCL: Data -> params", params);
    let client = ctx.app.apolloProvider.defaultClient;
    // const { data: categoriesData } = await client.query({
    //   query: gql`
    //     {
    //       categories {
    //         name
    //         slug
    //       }
    //     }
    //   `
    // });

    // const categories = categoriesData.categories;
    const { data: productData } = await client.query({
      query: gql`
        query ProductsQuery($slug: String!) {
          products(where: { slug: $slug }) {
            document {
              url
            }
            id
            name
            description
            content
            productimage {
              filename
              img {
                url
              }
              thumbnail {
                url
              }
            }
            SKU
            filters
            slug
            manufacturer {
              id
              name
              slug
            }
            category {
              id
              name
              slug
              parent {
                name
                slug
              }
            }
          }
        }
      `,
      variables: {
        slug: ctx.route.params.slug
      }
    });
    // console.log("TCL: productData", productData);
    await ctx.store.dispatch("fetchGeneralInfo");

    return {
      product: productData.products[0]
      //   filters: category.filters || {},
      //   categories: categories
      //   category: category
    };
  }
};
</script>
