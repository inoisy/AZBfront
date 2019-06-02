<template>
  <div>
    <section class="grey lighten-2">
      <v-container class="pb-4">
        <v-layout row wrap>
          <v-flex>
            <breadcrumbs class="pl-1 mb-4 flex xs12" :items="breadcrumbs"/>
            <h1 class="mb-5">Поиск по каталогу</h1>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
    <v-container class="py-5">
      <v-layout wrap>
        <v-flex xs12 class="mb-4">
          <v-text-field
            solo
            autofocus
            ref="search"
            label="Поиск по каталогу"
            v-model="search"
            :rules="[rules.required, rules.counterMax,rules.counterMin]"
            v-debounce:1s="throttledMethod"
          ></v-text-field>
        </v-flex>
        <!-- <v-divider></v-divider> -->
        <!-- {{searchItems}} -->
        <!-- <div v-for="(item, $index) in items" :key="$index" class="infinite-wrapper">
      {{item}}
    </div>
        <infinite-loading @infinite="infiniteHandler" force-use-infinite-wrapper=".infinite-wrapper"></infinite-loading>-->
        <v-flex v-if="searchItems && searchItems.length > 0">
          <h2>Результаты поиска</h2>
          <v-card
            class="mb-3 layout row wrap display-flex pa-3"
            v-for="item in searchItems"
            :key="item.id"
            :to="`/product/${item._source.slug}`"
            nuxt
            hover
            ripple
          >
            <!-- {{item._source.productimage.thumbnail}} -->
            <v-flex v-if="item._source.productimage && item._source.productimage.thumbnail">
              <v-img
                max-width="300px"
                max-height="300px"
                :src="imageBaseUrl+item._source.productimage.thumbnail.url"
              ></v-img>
            </v-flex>
            <v-divider vertical class="mx-3"></v-divider>
            <v-flex class="display-1">
              <h2
                class="display-2 mb-3 mt-1"
                v-html="item.highlight.name && item.highlight.name.length > 0 ? item.highlight.name[0] : item._source.name"
              ></h2>
              <p class="grey--text">
                Артикул:
                <span
                  v-html="item.highlight.SKU && item.highlight.SKU.length > 0 ? item.highlight.SKU[0] : item._source.SKU"
                ></span>
              </p>
              <p
                v-html="item.highlight.description && item.highlight.description.length > 0 ? item.highlight.description[0] : item._source.description"
              ></p>
            </v-flex>
          </v-card>
        </v-flex>
        <div v-else-if="$store.state.loading">
          <v-progress-circular
            v-if="$store.state.loading"
            :size="150"
            color="primary"
            indeterminate
            class="mx-auto mt-5 d-flex"
          ></v-progress-circular>
        </div>
        <v-flex v-else-if="valid">
          <v-alert type="error" :value="true">Ничего не найдено</v-alert>
        </v-flex>
        <!-- {{search}} -->
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Breadcrumbs from "~/components/Breadcrumbs";

export default {
  head() {
    return {
      title: "Поиск",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Поиск - Азбука электронабжения"
        }
      ]
    };
  },
  components: {
    Breadcrumbs
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      from: 0,
      total: null,
      items: [],
      loading: false,
      search: this.$route.query.q,
      rules: {
        required: value => !!value || "Required.",
        counterMax: value =>
          (value && value.length <= 60) || "Max 60 characters",
        counterMin: value => (value && value.length >= 3) || "Min 3 characters"
      }
    };
  },
  watch: {
    //  async search(val) {

    // }
    async search(val) {
      console.log("TCL: breadcrumbs -> this.$route", this.$route);
      if (val && val.length < 4) {
        await this.$store.commit("searchItems", []);
      }
      if (this.$refs.search.valid) {
        this.$router.push({ path: this.$route.path, query: { q: val.trim() } });
      } else {
        this.$router.push({ path: this.$route.path, query: {} });
        this.items = [];
      }
    }
  },
  async asyncData(ctx) {
    if (ctx.route.query.q) {
      await ctx.store.dispatch("search", ctx.route.query.q);
    }
    await ctx.store.dispatch("fetchGeneralInfo");
  },

  computed: {
    valid() {
      return this.$refs.search ? this.$refs.search.valid : null;
    },
    breadcrumbs() {
      return [
        {
          text: "Главная",
          to: "/"
        },
        {
          text: "Поиск",
          to: { path: this.$route.path, query: this.$route.query }
        }
      ];
    },
    searchItems() {
      return this.$store.state.searchItems;
    }
  },
  methods: {
    async throttledMethod(input) {
      await this.$store.dispatch("search", input);
    }
  }
};
</script>
