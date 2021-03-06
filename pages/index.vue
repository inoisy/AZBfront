<template>
  <div>
    <section
      class="main-wrapper"
      :style="`background-image:url(${require('~/assets/bg1.jpg')})`"
    >
      <v-carousel
        hide-delimiters
        height="35rem"
        light
        :cycle="false"
        v-if="page.slider && page.slider.length > 0"
      >
        <v-carousel-item
          v-for="(item, i) in page.slider"
          :key="i"
          class="background-wrapper"
          transition="fade-transition"
          reverse-transition="fade-transition"
        >
          <v-container fill-height class="main-content">
            <v-layout justify-center align-center>
              <v-flex md7 lg8 class="text-xs-left justify-center column">
                <h2
                  class="mb-4 font-weight-bold"
                  style="font-size: 2rem"
                  v-text="item.header"
                />
                <div
                  class="mb-7"
                  style="font-size: 1.2rem"
                  v-html="$md.render(item.content)"
                />
                <v-btn
                  v-if="item.buttontext"
                  color="#1F5BFF"
                  :to="item.href"
                  nuxt
                  dark
                  class="ml-0 subheading font-weight-medium"
                  large
                  >{{ item.buttontext }}</v-btn
                >
              </v-flex>
              <v-flex
                md5
                lg4
                v-if="item.img"
                class="hidden-sm-and-down py-4 pr-4 pl-5"
              >
                <img
                  class="d-block ma-auto"
                  style="width: 100%; max-width: 350px"
                  v-lazy="imageBaseUrl + item.img.url"
                  :alt="item.header"
                />
              </v-flex>
            </v-layout>
          </v-container>
        </v-carousel-item>
      </v-carousel>
      <div v-else>
        <v-container fill-height>
          <v-layout row wrap align-center class="text-center">
            <h1 class="display-3 font-weight-bold w-100">{{ page.title }}</h1>
            <p class="display-1">{{ page.description }}</p>
          </v-layout>
        </v-container>
      </div>
    </section>
    <section>
      <v-container class="py-12" grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12>
            <h2 class="text-uppercase text-center mb-4">КАТЕГОРИИ ТОВАРОВ</h2>
          </v-flex>
          <v-flex
            xs12
            sm6
            md4
            lg3
            xl2
            v-for="category in categories"
            :key="category.id"
          >
            <v-card
              class="catalog-link-wrapper fill-height flex pa-0"
              color="transparent"
              hover
              nuxt
              :to="`/catalog/${category.slug}`"
            >
              <div class="img-wrapper px-3 py-3 grey lighten-3">
                <img
                  class="catalog-link-img d-block ma-auto"
                  style="height: 100px"
                  v-lazy="
                    category.img
                      ? imageBaseUrl + category.img.url
                      : require('~/assets/no-image1.png')
                  "
                  :alt="category.name"
                  :title="category.name"
                />
              </div>

              <div class="catalog-link-text py-2 px-3 font-weight-medium">
                {{ category.name }}
              </div>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
    <section class="grey lighten-3">
      <v-container class="pt-12 pb-10" grid-list-lg>
        <v-layout row wrap justify-center>
          <h2 class="text-uppercase text-center xs12 flex mb-4">
            ПРОИЗВОДИТЕЛИ
          </h2>
          <v-flex
            xs6
            sm4
            md4
            lg3
            xl2
            v-for="item in manufacturers"
            :key="item.slug"
            class="mb-4"
          >
            <v-card
              :to="`/manufacturers/${item.slug}`"
              class="manufacturer-card align-center justify-center fill-height flex"
              style="display: flex"
              nuxt
              flat
              color="transparent"
              hover
            >
              <img
                v-if="item.img && item.img.url"
                class="mx-auto d-block"
                v-lazy="imageBaseUrl + item.img.url"
                :alt="item.name"
                style="object-fit: contain; height: 130px"
              />
              <p v-else>{{ item.name }}</p>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
    <section>
      <v-container class="py-12" grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12>
            <div
              class="mb-8"
              data-aos="fade-up"
              v-html="$md.render(page.content)"
            ></div>
            <v-btn color="#1F5BFF" large dark class="ml-0" to="/about"
              >О компании</v-btn
            >
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
      title: "Интернет магазин электротехники и электрооборудования",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "Электротехника и электрооборудование со склада и на заказ - Азбука электронабжения",
        },
        {
          name: "yandex-verification",
          content: "044a19bb8ebb9bef",
        },
      ],
    };
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      // loading: false,
      // select: null,
    };
  },
  async asyncData(ctx) {
    let client = ctx.app.apolloProvider.defaultClient;
    const { data: pageData } = await client.query({
      query: gql`
        {
          main {
            title
            description
            slug
            content
            slider {
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
          categories(where: { ismain: true }, sort: "name:asc") {
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
          # sliders {
          # id
          # header
          # content
          # href
          # buttontext
          # img {
          #   url
          # }
          # }
        }
      `,
    });
    // console.log(
    //   "🚀 ~ file: index.vue ~ line 205 ~ asyncData ~ pageData",
    //   pageData
    // );

    // await ctx.store.dispatch("fetchGeneralInfo");
    return {
      manufacturers: pageData.manufacturers,
      //   sliders: pageData.sliders,
      page: pageData.main,
      categories: pageData.categories,
    };
  },
  computed: {},
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
  // }
  display: flex;
  flex-direction: column;

  .catalog-link-text {
    flex-grow: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
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
