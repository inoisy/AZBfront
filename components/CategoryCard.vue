<template>
  <v-card
    hover
    ripple
    :to="to"
    style="width:100%"
    class="category-card-wrapper link mb-4 text-decoration-none align-start pa-3"
  >
    <div class="img-wrapper ma-auto">
      <img
        class="ma-auto d-block"
        v-lazy="item.img ? imageBaseUrl+item.img.url : require('~/assets/no-image1.png')"
      />
    </div>
    <v-divider class="hidden-md-and-up mt-3 mb-2 w-100"></v-divider>

    <v-divider vertical class="hidden-sm-and-down mx-3"></v-divider>

    <v-flex>
      <h2 class="category-card-header font-weight-bold mb-3">{{item.name}}</h2>
      <div>{{item.description}}</div>
    </v-flex>
  </v-card>
</template>
<style lang="stylus" scoped>
.category-card-wrapper {
  display: flex;
  flex-direction: column;

  .category-card-header {
    font-size: 1.6rem;
    line-height: normal;
  }

  .img-wrapper {
    min-height: 150px;
    margin: auto;
    min-width: 150px;

    img {
      display: block;
      max-height: 150px;
      margin: auto;
    }
  }
}

@media (min-width: 960px) {
  .category-card-wrapper {
    flex-direction: row;
  }
}
</style>

<script>
export default {
  props: ["item", "to"],
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl
    };
  }
};
</script>
