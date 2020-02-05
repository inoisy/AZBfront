<template>
  <v-breadcrumbs :items="items">
    <template slot="item" slot-scope="props">
      <nuxt-link class="text-decoration-none" :to="props.item.to" exact>{{ props.item.text }}</nuxt-link>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  props: ["items"]
};
</script>
<style lang="stylus" scoped>
.v-breadcrumbs {
  display: inline-flex;
  // justify-content: center;
  padding: 15px;

  a {
    // color: #ffffff;
    color: #1d1d1d;
    text-decoration: none;
    font-weight: 500;
    font-size: 1.1rem;

    &:hover {
      color: #1976d2;
    }
  }

  a.nuxt-link-active {
    // color: #19bcdb !important;
    font-weight: 700;
  }
}
</style>