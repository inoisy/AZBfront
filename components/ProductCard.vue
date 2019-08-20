<template>
  <v-card
    class="product-card-wrapper mb-3 pa-2"
    style="border-radius: 4px; width: 100%"
    tag="article"
  >
    <div class="img-wrapper ma-auto px-2">
      <img
        class="ma-auto d-block"
        v-lazy="item.productimage && item.productimage.thumbnail.url ? imageBaseUrl+item.productimage.thumbnail.url : require('~/assets/no-image1.png')"
        :alt="item.name"
      />
    </div>
    <v-divider class="hidden-md-and-up mt-3 mb-2 w-100"></v-divider>
    <v-divider vertical class="hidden-sm-and-down mx-3"></v-divider>
    <v-flex>
      <h2 class="mb-1" style="font-size: 1.7rem;">{{item.name}}</h2>
      <div style="color: #757575; font-size: 14px;" class="my-2">
        <span>Артикул:&nbsp;</span>
        <span class="font-weight-bold">{{item.SKU}}</span>
      </div>
      <div class="mb-1">{{item.description}}</div>
      <div class="mb-1" v-if="item.manufacturer">
        Производитель:
        <nuxt-link
          class="font-weight-bold link-hover"
          :to="`/manufacturers/${item.manufacturer.slug}`"
        >{{item.manufacturer.name}}</nuxt-link>
      </div>
      <div v-if="Object.keys(item.filters).length>0">
        <v-btn
          color="#1F5BFF"
          class="ml-0 mb-1 px-1 my-0"
          style="font-size: 12px !important;"
          v-show="!showDesc"
          dark
          flat
          @click="showDesc=!showDesc"
        >Технические характеристики</v-btn>
        <div v-show="showDesc">
          <div class="mb-1" v-for="(filter,index) in Object.keys(item.filters)" :key="index">
            {{filter}}:
            <span class="font-weight-bold">{{item.filters[filter]}}</span>
          </div>
        </div>
      </div>

      <div>
        <v-btn class="ml-0" dark @click="handleOffer" color="#1F5BFF">Заказать</v-btn>
        <v-btn
          class="ml-0"
          dark
          outline
          color="#1F5BFF"
          nuxt
          :to="`/product/${item.slug}`"
        >Подробнее</v-btn>
      </div>
    </v-flex>
  </v-card>
</template>

<script>
export default {
  props: ["item"],
  methods: {
    handleOffer() {
      this.$store.commit("dialog", {
        name: this.item.name,
        isShow: true
      });
    }
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      showDesc: false
    };
  }
};
</script>

<style lang="stylus" scoped>
.img-wrapper {
  img {
    width: 10rem;
    max-height: 250px;
  }
}
</style>

