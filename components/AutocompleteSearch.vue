<template>
  <v-autocomplete
    class="search d-flex"
    style="align-items: center !important;"
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
    no-data-text="Ничего не найдено"
    solo
    flat
    hide-no-data
    hide-selected
    hide-details
    append-icon="none"
    @change="handleChange"
    @input="handleInput"
    v-on:keyup.enter="handleEnter"
    v-on:keyup.esc="$emit('searchChange', false)"
  >
    <template v-slot:item="data">
      <!-- <div> -->
      <div
        v-if="data.item.productimage && data.item.productimage.thumbnail"
        class="align-center justify-center"
        style="max-width:60px; min-width: 60px; width:60px;    display: inline-flex;"
      >
        <img
          style="max-width:50px; max-height: 50px; width:50px"
          :src="data.item.productimage.thumbnail ? imageBaseUrl+data.item.productimage.thumbnail.url : require('~/assets/no-image1.png')"
        />
      </div>
      <!-- <v-divider vertical class="ma-1 py-1"></v-divider> -->
      <div style="max-width: calc(100% - 60px);">
        <p class="mb-1 text-truncate" style="font-size: 1rem">
          <span
            v-html="data.item.highlight.name && data.item.highlight.name.length > 0 ? data.item.highlight.name[0] : data.item.name"
          ></span>

          <span class="gray--text">
            (Арт.:
            <span
              v-html="data.item.highlight.SKU && data.item.highlight.SKU.length > 0 ? data.item.highlight.SKU[0] : data.item.SKU"
            ></span>)
          </span>
        </p>
        <p
          class="mb-0 text-truncate"
          style="font-size:1rem"
          v-html="data.item.highlight.description && data.item.highlight.description.length > 0 ? data.item.highlight.description[0] : data.item.description"
        ></p>
      </div>
      <!-- {{data.item.productimage.thumbnail.url}} -->
      <!-- </div> -->
      <!-- @click="$router.push(`/product/${data.item.slug}`); clear()" -->

      <!-- </div> -->
    </template>
    <template v-slot:prepend>
      <v-btn class="my-0 mx-2" @click="handleSearch" icon :disabled="!isSearchValid">
        <v-icon>search</v-icon>
      </v-btn>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      model: {},
      search: null,
      showMobileSearch: false
    };
  },
  computed: {
    // showSearch() {
    //   return this.$route.name !== "search";
    // },
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
    }
    // fields() {
    //   if (!this.model) return [];

    //   return Object.keys(this.model).map(key => {
    //     return {
    //       key,
    //       value: this.model[key] || "n/a"
    //     };
    //   });
    // }
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
      } else if (val && val.length > 3) {
        await this.$store.dispatch("autocompleteSearch", val);
      }
    },
    async model(val) {
      // if (Object.keys(val).length > 0 && val.slug) {
      //   this.$router.push(`/product/${val.slug}`);
      //   this.clear();
      // }
      console.log("TCL: model -> val", val);
    }
  },
  methods: {
    async handleEnter(val) {
      console.log("handleEnter", val);
      this.handleSearch();
      // if (Object.keys(val).length > 0 && val.slug) {
      //   this.$router.push(`/product/${val.slug}`);
      //   this.clear();
      // }
    },
    async handleInput(val) {
      console.log("handleInput", val);
      // if (Object.keys(val).length > 0 && val.slug) {
      //   this.$router.push(`/product/${val.slug}`);
      //   this.clear();
      // }
    },
    async handleChange(val) {
      console.log("change", val);
      if (Object.keys(val).length > 0 && val.slug) {
        this.$router.push(`/product/${val.slug}`);
        this.clear();
      }
    },
    async handleSearch() {
      console.log(this.search);
      if (this.search && this.search.length > 3) {
        await this.$router.push({ path: "/search", query: { q: this.search } });
        this.clear();
        // this.model = "";
        // this.search = "";
        // await this.$store.commit("autocompleteSearchItems", []);
      }
    },
    async clear(val) {
      // console.log(val);
      this.search = null;
      this.model = {};
      // this.$parent.searchActive = false;
      this.$emit("searchChange", false);
      // console.log("TCL: clear -> this.$parent", this.$parent.searchActive);
      await this.$store.commit("autocompleteSearchItems", []);
    }
  }
};
</script>

<style lang="stylus">
.v-text-field.v-text-field--solo .v-input__prepend-outer {
  margin: 0 !important;
}

.highlight {
  color: #1F5BFF;
  font-weight: bold;
}
</style>
