<template>
  <div>
    <section class="grey lighten-2">
      <v-container class="pb-4" grid-list-lg>
        <v-layout row wrap>
          <v-flex>
            <breadcrumbs class="pl-1 mb-4 flex xs12" :items="breadcrumbs" />
            <h1 class="mb-5">Поиск по каталогу</h1>
            <v-text-field
              solo
              autofocus
              ref="search"
              label="Поиск по каталогу"
              v-model="search"
              v-debounce:1s="searchFunc"
              type="text"
            ></v-text-field>
            <!-- :rules="[rules.required, rules.counterMax,rules.counterMin]" -->
          </v-flex>
        </v-layout>
      </v-container>
    </section>
    <v-container class="py-7" grid-list-lg>
      <template v-if="searchItems && searchItems.length > 0">
        <h2 class="mb-7">Результаты поиска</h2>
        <v-layout wrap>
          <v-flex xs12 v-for="item in searchItems" :key="item.id">
            <product-card :item="item" :viewMode="false" />
          </v-flex>
        </v-layout>
      </template>
      <div v-else-if="$store.state.loading">
        <v-progress-circular
          v-if="$store.state.loading"
          :size="150"
          color="primary"
          indeterminate
          class="mx-auto mt-5 d-flex"
        ></v-progress-circular>
      </div>
      <v-flex v-else>
        <v-alert type="error" :value="true">Ничего не найдено</v-alert>
      </v-flex>
    </v-container>
  </div>
</template>

<script>
import Breadcrumbs from "~/components/Breadcrumbs";
import ProductCard from "~/components/ProductCard";

export default {
  head() {
    return {
      title: "Поиск",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Поиск - Азбука электронабжения",
        },
      ],
    };
  },
  components: {
    Breadcrumbs,
    ProductCard,
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      // from: 0,
      total: null,
      // items: [],
      loading: false,
      delay: 1000,
      // rules: {
      //   required: value => !!value || "Required.",
      //   counterMax: value =>
      //     (value && value.length <= 60) || "Max 60 characters",
      //   counterMin: value => (value && value.length >= 3) || "Min 3 characters"
      // }
    };
  },
  watch: {
    async search(val) {
      if (!val || val.length < 4) {
        await this.$store.commit("autocompleteSearchItems", []);
      }
    },
  },
  async asyncData(ctx) {
    if (ctx.route.query.q) {
      await ctx.store.dispatch("autocompleteSearch", ctx.route.query.q);
    }
    // await ctx.store.dispatch("fetchGeneralInfo");
    // await ctx.store.dispatch("autocompleteSearch", ctx.route.query.q);
    return {
      search: ctx.route.query.q,
    };
  },

  computed: {
    // valid() {
    //   return this.$refs.search ? this.$refs.search.valid : null;
    // },
    breadcrumbs() {
      return [
        {
          text: "Главная",
          to: "/",
        },
        {
          text: "Поиск",
          to: { path: this.$route.path, query: this.$route.query },
        },
      ];
    },
    searchItems() {
      return this.$store.state.autocompleteSearchItems;
    },
  },
  methods: {
    async searchFunc() {
      const val = this.search;
      console.log("search -> val", val);
      // console.log("search -> this.$refs.search.valid", this.$refs.search.valid);
      // console.log("TCL: breadcrumbs -> this.$route", this.$route);
      if (!val || val.length < 4) {
        await this.$store.commit("autocompleteSearchItems", []);
      }
      if (val.length > 3) {
        this.$router.push({ path: this.$route.path, query: { q: val.trim() } });
        await this.$store.dispatch("autocompleteSearch", val);
      } else {
        this.$router.push({ path: this.$route.path, query: {} });
        // this.items = [];
      }
    },
    // async throttledMethod(input) {
    //   console.log("throttledMethod -> input", input);
    //   await this.$store.dispatch("autocompleteSearch", input);
    // }
  },
};
</script>
