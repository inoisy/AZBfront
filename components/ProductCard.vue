<template>
  <v-card
    :class="viewMode ? 'grid-view' : ''"
    class="product-card-wrapper pa-1"
    style="border-radius: 4px"
    tag="article"
  >
    <!-- {{ item.img }} -->
    <nuxt-link
      :to="`/product/${item.slug}`"
      :title="item.name"
      class="img-wrapper ma-auto px-2"
    >
      <img
        class="ma-auto d-block"
        v-lazy="imgUrl"
        :alt="item.name"
        :title="item.name"
      />
    </nuxt-link>
    <!-- {{ item }} -->
    <v-flex>
      <nuxt-link
        :to="`/product/${item.slug}`"
        :title="item.name"
        class="mb-1 product-card-header"
      >
        <h2 class="mb-0 d-inline-block">{{ item.name }}</h2>
      </nuxt-link>
      <div style="color: #757575" class="product-card-text mb-1">
        <span>Артикул:&nbsp;</span>
        <span class="font-weight-bold">{{ item.SKU }}</span>
      </div>
      <div class="mb-1 product-card-text" v-if="!viewMode">
        {{ item.description }}
      </div>
      <div class="mb-1 product-card-text" v-if="item.manufacturer">
        Производитель:
        <nuxt-link
          class="font-weight-bold link-hover"
          :to="`/manufacturers/${item.manufacturer.slug}`"
          >{{ item.manufacturer.name }}</nuxt-link
        >
      </div>
      <div v-if="!viewMode && Object.keys(item.filters).length > 0">
        <v-btn
          color="#1F5BFF"
          class="ml-0 mb-1 px-1 my-0"
          style="font-size: 12px !important"
          v-show="!showDesc"
          dark
          small
          text
          @click="showDesc = !showDesc"
          >Технические характеристики</v-btn
        >
        <div v-show="showDesc" class="product-card-text">
          <div
            class="mb-1"
            v-for="(filter, index) in Object.keys(item.filters)"
            :key="index"
          >
            {{ filter }}:
            <span class="font-weight-bold">{{ item.filters[filter] }}</span>
          </div>
        </div>
      </div>

      <!-- <div> :class="viewMode ? 'w-100' : ''"-->
      <v-btn
        small
        class="offer-button ml-0 mt-2"
        dark
        @click="handleOffer"
        color="#1F5BFF"
        >Заказать</v-btn
      >
      <!-- <v-btn
          class="ml-0"
          dark
          outlined
          color="#1F5BFF"
          nuxt
          :to="`/product/${item.slug}`"
      >Подробнее</v-btn>-->
      <!-- </div> -->
    </v-flex>
  </v-card>
</template>

<script>
export default {
  props: {
    item: Object,
    viewMode: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleOffer() {
      this.$store.commit("dialog", {
        name: this.item.name,
        isShow: true,
      });
    },
  },
  computed: {
    imgUrl() {
      if (!this.item.img) {
        return require("~/assets/no-image1.png");
      }
      // const isThumb = this.item.img.formats && this.item.img.formats.thumbnail.url
      if (
        this.item.img.formats &&
        this.item.img.formats.thumbnail &&
        this.item.img.formats.thumbnail.url
      ) {
        return this.imageBaseUrl + this.item.img.formats.thumbnail.url;
      }
      return this.imageBaseUrl + this.item.img.url;
      //  this.item.img && this.item.img.formats && this.item.img.formats.thumbnail.url
      //       ? this.imageBaseUrl + this.item.img.formats.thumbnail.url
      //       : require('~/assets/no-image1.png')
    },
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      showDesc: false,
    };
  },
};
</script>

<style lang="stylus" scoped>
.grid-view {
  flex-direction: column !important;
  height: 100%;

  .offer-button {
    width: 100%;
  }

  .product-card-header {
    height: 38px;
    overflow: hidden;
  }
}

.product-card-wrapper {
  display: flex;
  flex-direction: column;

  .product-card-text {
    font-size: 14px;
    line-height: normal;
  }

  .product-card-header {
    font-size: 16px;
    line-height: normal;
    display: flex;

    >* {
      font-size: 16px;
    }
  }

  .img-wrapper {
    min-height: 120px;
    margin: auto;

    // min-width: 150px;
    img {
      display: block;
      // max-height: 100%;
      margin: auto;
      width: 10rem;
      min-width: 10rem;
      height: 120px;
      // max-height: 180px;
      object-fit: contain;
      padding: 10px;
    }
  }
}

@media (min-width: 960px) {
  .product-card-wrapper {
    flex-direction: row;
  }
}

.img-wrapper {
  img {
  }
}
</style>

