<template>
  <div>
    <section class="grey lighten-2">
      <v-container class="text-xs-center text-md-left">
        <breadcrumbs class="pl-1" :items="breadcrumbs"/>
        <h1>{{product.name}}</h1>
      </v-container>
    </section>
    <v-container class="py-5">
      <v-layout row wrap>
        <v-flex xs12 md8 order-xs2 order-md1 class="pr-3 display-1">
          <p v-if="product.manufacturer">
            <span class="font-weight-bold">Производитель:</span>
            <nuxt-link
              :to="`/manufacturers/${product.manufacturer.slug}`"
            >{{product.manufacturer.name}}</nuxt-link>
          </p>
          <p>
            <span class="font-weight-bold">Артикул:</span>
            {{product.SKU}}
          </p>
          <p v-for="(item,index) in Object.keys(product.filters)" :key="index">
            <span class="font-weight-bold">{{item}}:</span>
            {{product.filters[item]}}
          </p>
          <a
            target="_blank"
            v-if="product.document"
            class="display-1 mb-3 link-hover display-flex align-center text-decoration-none"
            :href="imageBaseUrl+product.document.url"
          >
            <v-icon class="mr-2 text-decoration-none" style="color:currentColor">picture_as_pdf</v-icon>
            <u>Техническая документация</u>
          </a>

          <!-- {{}} -->
        </v-flex>
        <v-flex xs12 md4 order-xs1 order-md2 class="mb-4">
          <v-card
            class="pa-4 mb-4"
            style="border-radius: 10px"
            hover
            ripple
            @click="dialogImg=!dialogImg"
          >
            <img
              class="img-thumbnail d-block mx-auto"
              v-if="product.productimage && product.productimage.thumbnail"
              :src="imageBaseUrl+product.productimage.thumbnail.url"
              alt
            >
          </v-card>
          <v-dialog v-model="dialogImg">
            <div class="pa-3" style="background-color: white;
    position: relative;">
              <v-btn
                class="close-btn"
                flat
                icon
                large
                outline
                color="primary"
                @click="dialogImg = false"
                style="position:absolute; top:5px; right: 5px; z-index: 10"
              >
                <v-icon>close</v-icon>
              </v-btn>
              <v-img
                v-if="product.productimage.img"
                contain
                :src="imageBaseUrl+product.productimage.img.url"
                max-height="80vh"
              />
            </div>
          </v-dialog>
          <v-btn
            class="ma-0"
            large
            color="#1F5BFF"
            dark
            style="width: 100%"
            @click="dialog = !dialog"
          >купить</v-btn>
        </v-flex>
      </v-layout>
      <v-layout row wrap class="mt-4">
        <v-flex>
          <v-tabs v-model="tab" grow>
            <v-tabs-slider color="#1F5BFF"></v-tabs-slider>

            <v-tab>Техническое описание</v-tab>
            <v-tab>Доставка</v-tab>
            <v-tab>Оплата</v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item>
              <v-card flat>
                <v-card-text v-html="product.content">
                  <!-- <p v-for="(item,index) in Object.keys(product.technicaldescription)" :key="index">
                    <span class="font-weight-bold">{{item}}:</span>
                    {{product.technicaldescription[item]}}
                  </p>-->
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  <div class="tabsText" style="display: block;">
                    <p>
                      <b>Самовывоз с нашего склада:</b>
                      <br>
                      По адресу: {{$store.state.contacts.address}}
                    </p>

                    <p>
                      <b>Доставка до двери</b>
                      <br>Осуществляется курьерской службой или транспортной компанией (на Ваш выбор). Мы работаем с ведущими транспортными компаниями и доставляем заказы во все регионы России и Казахстана.
                    </p>
                    <p>
                      <b>Доставка до терминала</b>
                      <br>Транспортной компании в Москва – БЕСПЛАТНО.
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat>
                <v-card-text>
                  Банковский перевод: счет на оплату формируется после оформления заказа или отправки заявки в произвольной форме на электронную почту
                  <a
                    :href="`mailto:${contacts.mail}`"
                  >{{contacts.mail}}</a>
                  <br>Специалист свяжется с вами для уточнения деталей.
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-flex>
      </v-layout>
    </v-container>

    <catalog-dialog :name="product.name"/>
  </div>
</template>

<script>
import gql from "graphql-tag";
import Breadcrumbs from "~/components/Breadcrumbs";
import CatalogDialog from "~/components/CatalogDialog";

export default {
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
      items: ["Техническое описание", "Доставка", "Оплата"],
      tabsItems: [
        { title: "Техническое описание", content: "sds" },
        { title: "Доставка", content: "sds" },
        { title: "Оплата", content: "sds" }
      ]
    };
  },
  components: {
    Breadcrumbs,
    CatalogDialog
  },
  computed: {
    contacts() {
      return this.$store.state.contacts;
    },
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
          text: this.product.category.parent[0].name,
          to: `/catalog/${this.product.category.parent[0].slug}`
        },
        {
          text: this.product.category.name,
          to: `/catalog/${this.product.category.parent[0].slug}/${
            this.product.category.slug
          }`
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
    console.log("TCL: Data -> params", params);
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
    console.log("TCL: productData", productData);
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

<style lang="stylus">
.dialog-inner {
  position: relative;

  .close-btn {
    position: absolute;
    top: 8px;
    right: 8px;
  }
}

.img-thumbnail {
  max-width: 100%;
  max-height: 300px;
}
</style>
