<template>
  <div>
    <default-header :breadcrumbs="breadcrumbs" :title="category.name"></default-header>
    <v-container grid-list-lg class="pt-9 pb-6 d-flex" id="contentWrapper">
      <v-layout class="d-flex all-wrapper">
        <div class="menu-wrapper" v-show="showManufacturers || showFilters">
          <sticky-menu class="menu-child">
            <slot>
              <div v-if="showManufacturers" class="mb-3">
                <v-card class="pt-0">
                  <v-subheader class="pb-0">ПРОИЗВОДИТЕЛИ</v-subheader>
                  <v-card-text class="pt-0">
                    <v-checkbox
                      hide-details
                      class="mt-1"
                      v-model="manufacturerSelected"
                      :label="checkbox.name"
                      v-for="(checkbox) in manufacturers"
                      :key="checkbox.id"
                      :value="checkbox.id"
                    ></v-checkbox>
                  </v-card-text>
                </v-card>
              </div>
              <v-expansion-panels v-if="showFilters">
                <v-expansion-panel v-for="(item, i) in Object.keys(category.filters)" :key="i">
                  <v-expansion-panel-header>{{item}}</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-checkbox
                      class="mt-1"
                      hide-details
                      v-for="(checkbox,index) in category.filters[item]"
                      v-model="dataFilters[item]"
                      :key="`${item}-${index}`"
                      :value="checkbox"
                      :label="checkbox"
                      @change="checkboxChange"
                    >{{checkbox}}</v-checkbox>
                    <!-- {{dataFilters[item]}} -->
                    <!--  -->
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>

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
        <div
          class="content-wrapper"
          :class="showManufacturers || showFilters ? 'content-wrapper-fit' : ''"
        >
          <div class="pa-2 pt-0">
            <v-card color="white" class="top-nav-wrap py-3">
              <div class="top-nav-inner px-3 d-inline-flex align-center">
                <v-btn-toggle mandatory v-model="viewMode">
                  <v-btn class="pa-0" small height="32" min-width="38">
                    <v-icon>view_list</v-icon>
                  </v-btn>
                  <v-btn class="pa-0" small height="32" min-width="38">
                    <v-icon>view_module</v-icon>
                  </v-btn>
                </v-btn-toggle>
                <!-- Всего товаров: {{productsTotal}} -->
                <v-subheader
                  class="text-no-wrap"
                  style="height: 32px;"
                  v-show="showNum30"
                >Показывать по</v-subheader>

                <v-btn-toggle mandatory v-model="showNum" v-show="showNum30">
                  <v-btn class="pa-0" small height="32" min-width="38">30</v-btn>
                  <v-btn v-if="showNum60" class="pa-0" small height="32" min-width="38">60</v-btn>
                  <v-btn v-if="showNum90" class="pa-0" small height="32" min-width="38">90</v-btn>
                </v-btn-toggle>
              </div>
              <div class="top-pagination-wrap" v-if="pagesTotal>1">
                <v-pagination
                  v-model="pageCurr"
                  :length="pagesTotal"
                  total-visible="7"
                  class="top-pagination-inner"
                  light
                  color="#1867c0"
                ></v-pagination>
              </div>
            </v-card>
          </div>
          <div
            v-if="products && products.length > 0"
            class="d-flex"
            style="flex-wrap: wrap; display: flex;"
          >
            <v-flex
              v-for="item in products"
              :key="item.id"
              :class="viewMode ? 'xs12 sm6 md4' : 'xs12'"
            >
              <product-card :item="item" :viewMode="!!viewMode" />
            </v-flex>
          </div>
          <div v-else-if="$store.state.loading" class="my-12">
            <v-progress-circular
              v-if="$store.state.loading"
              :size="150"
              color="#1F5BFF"
              indeterminate
              class="mx-auto my-5 d-flex"
            ></v-progress-circular>
          </div>
          <v-flex v-else>
            <v-alert type="error" :value="true">Ничего не найдено</v-alert>
            <v-btn
              v-if="showClearFilters"
              class="ml-0"
              large
              style="width: 100%"
              color="white"
              @click="flushFilters"
            >Сбросить фильтры</v-btn>
          </v-flex>
        </div>
      </v-layout>
    </v-container>
    <section v-if="pagesTotal>1" class="position-relative grey lighten-1">
      <v-container grid-list-lg>
        <v-layout row wrap>
          <v-flex xs12 sm4 md3 align-center d-flex>Всего товаров: {{productsTotal}}</v-flex>
          <v-flex xs12 sm8 md9 justify-right d-flex>
            <v-pagination
              v-model="pageCurr"
              :length="pagesTotal"
              total-visible="10"
              style="justify-content: flex-end;"
              light
              color="#1867c0"
            ></v-pagination>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
    <section
      class="grey lighten-2 position-relative"
      v-if="category.content && category.content.length>0"
    >
      <v-container class="py-12">
        <v-layout row wrap>
          <h2 class="mb-4">Купить {{category.name.toLowerCase()}} в Москве с доставкой по всей РФ.</h2>
          <div v-html="$md.render(category.content)"></div>
        </v-layout>
      </v-container>
    </section>
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
    min-height: 70vh;
    // margin-top:30px;
  }
}

.top-nav-wrap {
  flex-wrap: wrap;
  display: flex;
  justify-content: center;

  .top-nav-inner {
    padding-bottom: 8px;
  }

  .top-pagination-wrap {
    flex-basis: 100%;
    max-width: 100%;
    display: inline-flex;
    padding-top: 8px;

    // padding-bottom: 8px;
    .top-pagination-inner {
      justify-content: center;
    }
  }
}

@media (min-width: 960px) {
  .top-nav-wrap {
    flex-wrap: nowrap;
    justify-content: space-between;

    .top-nav-inner {
      padding-bottom: 0px;
    }

    .top-pagination-wrap {
      flex-basis: calc(100% - 340px);
      max-width: calc(100% - 340px);
      padding-top: 0px;

      // padding-bottom: 0px;
      .top-pagination-inner {
        justify-content: flex-end;
      }
    }
  }

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

    .content-wrapper-fit {
      width: calc(100% - 20rem);
    }
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
      itemsPerPage: 30,
      pageCurr: this.$route.query.page ? Number(this.$route.query.page) : 1,
      // dataFilters: {},
      selectedName: null,
      dialog: false,
      imageBaseUrl: process.env.imageBaseUrl,
      manufacturerFilter: this.$route.params.filter,
      viewMode: 0,
      showNum: 0
    };
  },
  computed: {
    showNum30() {
      return this.productsTotal && this.productsTotal > 30;
    },
    showNum60() {
      return this.productsTotal && this.productsTotal > 60;
    },
    showNum90() {
      return this.productsTotal && this.productsTotal > 90;
    },
    showManufacturers() {
      return this.manufacturers && this.manufacturers.length > 1;
    },
    showFilters() {
      return (
        this.category.filters && Object.keys(this.category.filters).length > 0
      );
    },
    showClearFilters() {
      const show = Object.keys(this.dataFilters).some(item => {
        return this.dataFilters[item].length;
      });
      return show;
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
      if (!this.category) return;
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
    async showNum(val) {
      // console.log("showNum -> val", val);

      switch (val) {
        case 0:
          this.itemsPerPage = 30;
          break;
        case 1:
          this.itemsPerPage = 60;
          break;
        case 2:
          this.itemsPerPage = 90;
          break;
        default:
          break;
      }
      this.$router.push({
        // path: this.$route.path,
        query: {
          // page: 0
        }
      });
      this.pageCurr = 1;
      await this.$store.dispatch("fetchProducts", {
        categoryId: this.category.id,
        filters: this.dataFilters,
        size: this.itemsPerPage,
        from: (this.pageCurr - 1) * this.itemsPerPage,
        manufacturers: this.manufacturerSelected
      });
    },
    async manufacturerSelected(val) {
      await this.$vuetify.goTo("#contentWrapper");
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
      await this.$vuetify.goTo("#contentWrapper");
      await this.$store.dispatch("fetchProducts", {
        categoryId: this.category.id,
        manufacturers: this.manufacturerSelected,
        filters: this.dataFilters,
        size: this.itemsPerPage,
        from: (this.pageCurr - 1) * this.itemsPerPage
      });
      if (val && val > 1) {
        this.$router.push({
          // path: this.$route.path,
          query: {
            page: val
          }
        });
      } else {
        this.$router.push({
          // path: this.$route.path,
          query: {}
        });
      }
    }
  },
  methods: {
    async flushFilters() {
      this.pageCurr = 1;
      await this.$vuetify.goTo("#contentWrapper");
      this.dataFilters = Object.keys(this.dataFilters).reduce((acc, val) => {
        acc[val] = [];
        return acc;
      }, {});
      await this.$store.commit("filters", this.dataFilters);
      await this.$store.dispatch("fetchProducts", {
        categoryId: this.category.id,
        filters: this.dataFilters,
        size: this.itemsPerPage,
        from: (this.pageCurr - 1) * this.itemsPerPage
      });
      // }
      this.manufacturerSelected = null;
    },
    async checkboxChange() {
      await this.$vuetify.goTo("#contentWrapper", {
        // offset: this.headerHeight
      });

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
    const category = categoryData.categories[0];
    let manufacturer = params.filter
      ? category.manufacturers.find(item => item.slug === params.filter)
      : null;
    const products = await ctx.store.dispatch("fetchProducts", {
      categoryId: category.id,
      filters: null,
      size: 30,
      from: 0,
      manufacturers: manufacturer ? manufacturer.id : null
    });
    await ctx.store.dispatch("fetchGeneralInfo");

    const filters = Object.keys(category.filters).reduce((acc, val) => {
      // console.log("val", val);
      acc[val] = [];
      return acc;
    }, {});
    // console.log("category", filters);
    return {
      category: category,
      manufacturers: category.manufacturers,
      manufacturerSelected: manufacturer ? manufacturer.id : null,
      dataFilters: filters
    };
  }
};
</script>