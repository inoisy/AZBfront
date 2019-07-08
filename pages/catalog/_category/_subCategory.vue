<template>
  <div>
    <default-header :breadcrumbs="breadcrumbs" :title="category.name"></default-header>
    <v-container class="pt-5 d-flex">
      <v-layout class="d-flex all-wrapper" id="contentWrapper">
        <div class="menu-wrapper" v-show="showFilters || manufacturers && manufacturers.length>1">
          <sticky-menu class="menu-child">
            <slot>
              <!-- <v-expansion-panel >
              <v-expansion-panel-content>-->
              <!-- <template v-slot:header> -->
              <div v-if="manufacturers && manufacturers.length>1" class="mb-3">
                <v-card class="pt-2">
                  <!-- <v-card-title primary-title> -->
                  <v-subheader>ПРОИЗВОДИТЕЛИ</v-subheader>
                  <!-- </v-card-title> -->

                  <v-card-text class="pt-0">
                    <v-checkbox
                      v-model="manufacturerSelected"
                      :label="checkbox.name"
                      v-for="(checkbox) in manufacturers"
                      :key="checkbox.id"
                      :value="checkbox.id"
                    ></v-checkbox>
                  </v-card-text>
                </v-card>
              </div>

              <!-- <div></div> -->
              <!-- </template> -->

              <!-- </v-expansion-panel-content>
              </v-expansion-panel>-->
              <v-expansion-panel v-if="showFilters ">
                <v-expansion-panel-content
                  v-for="(item, i) in Object.keys(category.filters)"
                  :key="i"
                >
                  <template v-slot:header>
                    <div>{{item}}</div>
                  </template>
                  <v-card>
                    <v-card-text class="grey lighten-3">
                      <v-checkbox
                        v-model="dataFilters[item]"
                        :label="checkbox"
                        v-for="(checkbox,index) in category.filters[item]"
                        :key="index"
                        :value="checkbox"
                        @change="checkboxChange"
                      >{{checkbox}}</v-checkbox>
                    </v-card-text>
                  </v-card>
                </v-expansion-panel-content>
              </v-expansion-panel>
              <v-btn
                v-if="showClearFilters"
                class="ml-0 mt-2"
                large
                style="width: 100%"
                color="white"
                @click="flushFilters"
              >Сбросить фильтры</v-btn>
              <v-divider class="hidden-md-and-up mt-3 mb-4"></v-divider>
            </slot>
          </sticky-menu>
        </div>
        <v-flex class="content-wrapper">
          <div v-if="products && products.length > 0">
            <product-card v-for="item in products" :key="item.id" :item="item" />
          </div>
          <div v-else-if="$store.state.loading">
            <v-progress-circular
              v-if="$store.state.loading"
              :size="150"
              color="#1F5BFF"
              indeterminate
              class="mx-auto my-5 d-flex"
            ></v-progress-circular>
          </div>
          <div v-else>
            <v-alert type="error" :value="true">Ничего не найдено</v-alert>
            <v-btn
              v-if="showClearFilters"
              class="ml-0 mt-4"
              large
              style="width: 100%"
              color="white"
              @click="flushFilters"
            >Сбросить фильтры</v-btn>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
    <v-flex xs12 v-if="pagesTotal>1">
      <v-card>
        <v-card-text>
          <v-pagination
            v-model="pageCurr"
            :length="pagesTotal"
            light
            color="#1867c0"
            class="justify-center align-center"
            style="display:flex"
          ></v-pagination>
        </v-card-text>
      </v-card>
    </v-flex>
    <section
      class="grey lighten-2 position-relative"
      v-if="category.content && category.content.length>0"
    >
      <v-container class="py-5">
        <v-layout row wrap>
          <h2 class="mb-4">Купить {{category.name.toLowerCase()}} в Москве с доставкой по всей РФ.</h2>
          <div v-html="$md.render(category.content)"></div>
        </v-layout>
      </v-container>
    </section>
    <catalog-dialog :name="selectedName" />
  </div>
</template>
<style lang="stylus" scoped>
.all-wrapper {
  flex-direction: column;
  min-height: 100vh;

  .menu-wrapper {
    position: relative;
    width: 100%;
    display: flex;
    min-width: 100%;
    // margin-bottom: 48px;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 60vh;
    // margin-top:30px;
  }
}

.product-card-wrapper {
  display: flex;
  flex-direction: column;

  .img-wrapper {
    min-height: 150px;
    margin: auto;
    min-width: 150px;

    img {
      display: block;
      max-height: 100%;
      margin: auto;
    }
  }
}

@media (min-width: 960px) {
  .all-wrapper {
    flex-direction: row;

    .menu-wrapper {
      width: 20rem;
      min-width: 20rem;
      margin-bottom: 0;

      // padding-right: 16px;
      .menu-child {
        padding-right: 16px;
      }
    }

    .content-wrapper {
      width: calc(100% - 20rem);
    }
  }

  .product-card-wrapper {
    flex-direction: row;
  }
}
</style>

<script>
import gql from "graphql-tag";
import Breadcrumbs from "~/components/Breadcrumbs";
import StickyMenu from "~/components/StickyMenu";
import CatalogDialog from "~/components/CatalogDialog";
import DefaultHeader from "~/components/DefaultHeader";
import ProductCard from "~/components/ProductCard";

export default {
  head() {
    return {
      title: this.category.name,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.category.description + " - Азбука электроснабжения"
        }
      ]
    };
  },
  components: {
    Breadcrumbs,
    StickyMenu,
    CatalogDialog,
    DefaultHeader,
    ProductCard
  },
  data() {
    return {
      itemsPerPage: 10,
      pageCurr: this.$route.query.page ? Number(this.$route.query.page) : 1,
      dataFilters: {},
      selectedName: null,
      dialog: false,
      imageBaseUrl: process.env.imageBaseUrl,
      manufacturerFilter: this.$route.params.filter
    };
  },
  computed: {
    headerHeight() {
      return this.$vuetify.breakpoint.mdAndUp ? 140 : 80;
    },
    showFilters() {
      return (
        this.category.filters && Object.keys(this.category.filters).length > 0
      );
    },
    showClearFilters() {
      let newArr = [];
      console.log(
        "TCL: showClearFilters -> this.dataFilters",
        this.dataFilters
      );

      if (this.dataFilters && Object.keys(this.dataFilters).length > 0) {
        for (let item of Object.keys(this.dataFilters)) {
          newArr.push(!!this.dataFilters[item]);
        }
        const returnVal =
          !!this.manufacturerSelected || newArr.some(item => item === true)
            ? true
            : false;
        console.log("TCL: showClearFilters -> returnVal", returnVal);

        return returnVal;
      } else return false;
    },
    products() {
      return this.$store.state.products;
    },
    page() {
      return this.$store.state.page;
    },
    productsTotal() {
      return this.$store.state.productsTotal;
    },
    pagesTotal() {
      return Math.ceil(this.$store.state.productsTotal / this.itemsPerPage);
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
          text: this.category.parent[0].name,
          to: "/catalog/" + this.category.parent[0].slug
        },
        {
          text: this.category.name,
          to: { path: this.$route.path, query: this.$route.query }
        }
      ];
    }
  },
  watch: {
    async manufacturerSelected(val) {
      // await this.$vuetify.goTo("#contentWrapper", {
      //   offset: this.headerHeight
      // });
      const manufacturer = this.manufacturers.find(item => item.id === val);

      await this.$store.dispatch("fetchProducts", {
        categoryId: this.category.id,
        filters: this.dataFilters,
        size: this.itemsPerPage,
        from: (this.pageCurr - 1) * this.itemsPerPage,
        manufacturers: val
      });
      const { filter, ...omitted } = this.$route.params;
      if (val) {
        this.$router.push({
          name: "catalog-category-subCategory-filter",
          params: {
            filter: manufacturer.slug
          }
        });
      } else {
        this.$router.push({
          name: "catalog-category-subCategory",
          params: {}
        });
      }
    },
    async pageCurr(val) {
      await this.$vuetify.goTo("#contentWrapper", {
        offset: this.headerHeight
      });

      // console.log(
      //   "TCL: pageCurr -> this.$vuetify",
      //   this.$vuetify.goTo("#main-wrapper")
      // );
      await this.$store.dispatch("fetchProducts", {
        categoryId: this.category.id,
        manufacturers: this.manufacturerSelected,
        filters: this.dataFilters,
        size: this.itemsPerPage,
        from: (this.pageCurr - 1) * this.itemsPerPage
      });
      if (val && val > 1) {
        this.$router.push({
          path: this.$route.path,
          query: {
            page: val
          }
        });
      } else {
        this.$router.push({
          path: this.$route.path,
          query: {}
        });
      }
    }
  },
  methods: {
    async flushFilters() {
      this.pageCurr = 1;
      if (Object.keys(this.dataFilters).length > 0) {
        this.dataFilters = {};
        await this.$store.commit("filters", []);
        await this.$store.dispatch("fetchProducts", {
          categoryId: this.category.id,
          filters: this.dataFilters,
          size: this.itemsPerPage,
          from: (this.pageCurr - 1) * this.itemsPerPage
        });
      }
      this.manufacturerSelected = null;
    },
    async checkboxChange() {
      // await this.$vuetify.goTo("#contentWrapper", {
      //   offset: this.headerHeight
      // });

      await this.$store.commit("filters", this.dataFilters);
      this.pageCurr = 1;
      await this.$store.dispatch("fetchProducts", {
        categoryId: this.category.id,
        manufacturers: this.manufacturerSelected,
        filters: this.dataFilters,
        size: this.itemsPerPage,
        from: 0
      });
    }
  },

  async asyncData(ctx) {
    const params = ctx.route.params;
    let client = ctx.app.apolloProvider.defaultClient;

    const baseUrl = process.env.baseUrl;
    const { data: categoryData } = await client.query({
      query: gql`
        query SubcategoriesQuery($slug: String!) {
          categories(where: { slug: $slug }) {
            id
            name
            description
            slug
            manufacturers {
              id
              name
              slug
            }
            content
            parent {
              name
              slug
            }
            img {
              url
            }
            filters
          }
        }
      `,
      variables: {
        slug: ctx.route.params.subCategory
      }
    });

    let manufacturer = params.filter
      ? categoryData.categories[0].manufacturers.find(
          item => item.slug === params.filter
        )
      : null;
    const products = await ctx.store.dispatch("fetchProducts", {
      categoryId: categoryData.categories[0].id,
      filters: null,
      size: 10,
      from: 0,
      manufacturers: manufacturer ? manufacturer.id : null
    });
    await ctx.store.dispatch("fetchGeneralInfo");

    return {
      category: categoryData.categories[0],
      manufacturers: categoryData.categories[0].manufacturers,
      manufacturerSelected: manufacturer ? manufacturer.id : null
    };
  }
};
</script>