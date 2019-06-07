<template>
  <div>
    <v-card
      :hover="href"
      :ripple="href"
      :to="href"
      class="mb-4 flex xs12 pa-3 text-decoration-none display-flex row wrap layout"
    >
      <v-flex xs12 md4 class="py-4 px-3">
        <v-img contain max-height="300px" v-if="item.img" :src="imageBaseUrl+ item.img.url"></v-img>
      </v-flex>
      <v-flex xs12 md8>
        <h2 class="display-3 font-weight-bold mb-4">
          {{item.name}}
          <slot name="addToHeader"></slot>
        </h2>
        <slot name="subheader"></slot>
        <div class="display-1">{{item.description}}</div>
      </v-flex>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["item", "href"],
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl
    };
  }
};
</script>

<style>
</style>
