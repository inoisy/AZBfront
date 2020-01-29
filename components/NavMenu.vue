<template>
  <v-list class="nav-menu-wrapper elevation-2 flex w-100">
    <v-list-tile
      class="nav-menu-item"
      active-class="text--accent"
      v-for="item in menuItems"
      :key="item.title"
      :to="`/${type}/${item.slug}`"
    >{{type === "about" ? item.title : item.name }}</v-list-tile>
  </v-list>
</template>
<style lang="stylus" scoped>
.nav-menu-item {
  line-height: 1;
}
</style>
<script>
export default {
  props: ["menuItems", "type"]
};
</script>
