<template>
  <v-card
    class="product-card-wrapper mb-3 pa-3"
    style="border-radius: 4px; width: 100%"
    tag="article"
  >
    <v-flex xs12 md3 class="img-wrapper ma-auto">
      <img
        class="ma-auto d-block"
        v-lazy="item.productimage && item.productimage.thumbnail.url ? imageBaseUrl+item.productimage.thumbnail.url : require('~/assets/no-image1.png')"
        :alt="item.name"
      />
    </v-flex>
    <v-divider class="hidden-md-and-up mt-3 mb-2 w-100"></v-divider>
    <v-divider vertical class="hidden-sm-and-down mx-3"></v-divider>
    <v-flex xs12 md9>
      <v-subheader class="pa-0">
        <span>Артикул:&nbsp;</span>
        <span class="font-weight-bold">{{item.SKU}}</span>
      </v-subheader>
      <h2>{{item.name}}</h2>
      <div class="mb-3">{{item.description}}</div>
      <div class="mb-1" v-if="item.manufacturer">
        Производитель:
        <nuxt-link
          class="font-weight-bold link-hover"
          :to="`/manufacturers/${item.manufacturer.slug}`"
        >{{item.manufacturer.name}}</nuxt-link>
      </div>
      <!-- <v-btn
        color="#1F5BFF"
        class="ml-0 mb-2 px-1"
        v-show="!showDesc"
        dark
        flat
        @click="showDesc=!showDesc"
      >Технические характеристики</v-btn> v-show="showDesc"-->
      <div>
        <div class="mb-1" v-for="(filter,index) in Object.keys(item.filters)" :key="index">
          {{filter}}:
          <span class="font-weight-bold">{{item.filters[filter]}}</span>
        </div>
      </div>
      <div>
        <v-btn
          class="ml-0 mt-3"
          dark
          @click="selectedName=item.name;dialog=!dialog;"
          color="#1F5BFF"
        >Заказать</v-btn>
        <v-btn
          class="ml-0 mt-3"
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
    max-height: 250px;
  }
}
</style>

