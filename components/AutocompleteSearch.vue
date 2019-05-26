<template>
  <div v-if="showSearch">
    <v-autocomplete
      class="search hidden-sm-and-down"
      :menu-props="{transition:'slide-x-reverse-transition'}"
      v-model="model"
      :items="autocompleteItems"
      :loading="isLoading"
      :search-input.sync="search"
      :filter="v => v"
      item-text="name"
      item-value="SKU"
      placeholder="Поиск по каталогу"
      return-object
      v-debounce:700ms="throttledMethod"
      no-data-text="Ничего не найдено"
      solo
      flat
      hide-no-data
      hide-selected
      append-icon="none"
      v-on:keyup.enter="handleSearch"
    >
      <template v-slot:item="data">
        <div @click="$router.push(`/product/${data.item.slug}`); clear()">
          <p class="mb-0" style="font-size:14px">
            {{data.item.name}}
            <span class="gray--text">(Арт.:{{data.item.SKU}})</span>
          </p>
          <p class="mb-0 text-truncate" style="font-size:12px">{{data.item.description}}</p>
        </div>
      </template>
      <template v-slot:append-outer>
        <v-btn
          class="my-0"
          @click="handleSearch"
          style="height:48px; min-width: auto !important;"
          :disabled="!isSearchValid"
        >
          <v-icon>search</v-icon>
        </v-btn>

        <!-- <nuxt-link> -->

        <!-- {{search}} -->
        <!-- </nuxt-link> -->
      </template>
    </v-autocomplete>
    <v-btn
      v-if="!showMobileSearch"
      to="/search"
      class="toolbar-top-btn ml-2 hidden-md-and-up ml-auto display-block"
      icon
    >
      <v-icon class style="color:currentcolor">search</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      model: null,
      search: null,
      showMobileSearch: false
    };
  },
  computed: {
    showSearch() {
      return this.$route.name !== "search";
    },
    isSearchValid() {
      return this.search && this.search.length > 3;
    },

    isLoading() {
      return this.$store.state.loading;
    },
    autocompleteItems() {
      const items =
        this.$store.state.autocompleteSearchItems &&
        this.$store.state.autocompleteSearchItems.length > 0
          ? this.$store.state.autocompleteSearchItems
          : [];
      return items;
    },
    fields() {
      if (!this.model) return [];

      return Object.keys(this.model).map(key => {
        return {
          key,
          value: this.model[key] || "n/a"
        };
      });
    }
    // items() {
    //   return this.entries.map(entry => {
    //     const Description =
    //       entry.Description.length > this.descriptionLimit
    //         ? entry.Description.slice(0, this.descriptionLimit) + "..."
    //         : entry.Description;

    //     return Object.assign({}, entry, { Description });
    //   });
    // }
  },
  watch: {
    async search(val) {
      if (val && val.length <= 3) {
        await this.$store.commit("autocompleteSearchItems", []);
      }
    }
  },
  methods: {
    async handleSearch() {
      console.log(this.search);
      if (this.search && this.search.length > 3) {
        await this.$router.push({ path: "/search", query: { q: this.search } });
        this.model = "";
        this.search = "";
        await this.$store.commit("autocompleteSearchItems", []);
      }
    },
    async clear(val) {
      console.log(val);
      this.search = "";
      // this.model = "";
      await this.$store.commit("autocompleteSearchItems", []);
    },
    async throttledMethod(val) {
      if (val && val.length > 3) {
        await this.$store.dispatch("autocompleteSearch", val);
      }
      // else {
      // this.search = "";
      // this.model = "";
      // }
    }
  }
};
</script>

<style>
</style>
