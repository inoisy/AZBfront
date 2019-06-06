<template>
  <!-- <v-list class="elevation-2">
    <v-list-tile v-for="item in menuItems" :key="item.text" :to="item.to">{{item.text}}</v-list-tile>
  </v-list>-->
  <v-list class="nav-menu-wrapper elevation-2 flex w-100">
    <v-list-tile
      active-class="text--accent"
      v-for="item in menuItems"
      :key="item.title"
      :to="`/${type}/${item.slug}`"
    >{{type === "about" ? item.title : item.name }}</v-list-tile>
  </v-list>
</template>

<script>
export default {
  props: ["menuItems", "type"]
};
</script>
<style lang="stylus" scoped></style>

