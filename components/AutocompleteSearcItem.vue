<template>
  <div class="d-flex" v-if="data">
    <div
      class="autocomplete-item-img-wrap align-center justify-center mr-3"
      style
    >
      <img class="autocomplete-item-img" :src="imgUrl" />
    </div>
    <div>
      <div class="text-truncate" style="font-size: 1rem">
        <span
          v-html="
            data.item.highlight &&
            data.item.highlight.name &&
            data.item.highlight.name.length > 0
              ? data.item.highlight.name[0]
              : data.item.name
          "
        ></span>

        <span class="gray--text">
          <span
            v-html="
              data.item.highlight &&
              data.item.highlight.SKU &&
              data.item.highlight.SKU.length > 0
                ? data.item.highlight.SKU[0]
                : data.item.SKU
            "
          ></span>
        </span>
      </div>
      <div
        class="mb-0 text-truncate"
        style="font-size: 0.9rem"
        v-html="
          data.item.highlight &&
          data.item.highlight.description &&
          data.item.highlight.description.length > 0
            ? data.item.highlight.description[0]
            : data.item.description
        "
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["data"],
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
    };
  },
  computed: {
    imgUrl() {
      if (!this.data.item || !this.data.item.img) {
        return require("~/assets/no-image1.png");
      }
      if (this.data.item.img.formats && this.data.item.img.formats.thumbnail) {
        return this.imageBaseUrl + this.data.item.img.formats.thumbnail.url;
      }
      return this.imageBaseUrl + this.data.item.img.url;
      //    data.item.img && data.item.img.formats && data.item.img.formats.thumbnail
      //     ? imageBaseUrl + data.item.productimage.thumbnail.url
      //     : require('~/assets/no-image1.png')
    },
  },
};
</script>
<style lang="stylus">
.autocomplete-item-img-wrap {
  min-width: 50px;
  display: inline-flex;

  .autocomplete-item-img {
    max-width: 50px;
    max-height: 50px;
    width: 50px;
    object-fit: contain;
    padding: 3px;
  }
}

.highlight {
  color: #1F5BFF;
  font-weight: bold;
}

// }
.v-text-field.v-text-field--solo .v-input__prepend-outer {
  margin: 0 !important;
}
</style>