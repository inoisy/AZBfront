<template>
  <!-- <v-list class="elevation-2">
    <v-list-tile v-for="item in menuItems" :key="item.text" :to="item.to">{{item.text}}</v-list-tile>
  </v-list>-->
  <v-list class="elevation-2 flex w-100">
    <v-list-tile
      active-class="text--accent"
      v-for="item in menuItems"
      :key="item.title"
      :to="`/about/${item.slug}`"
    >{{item.title}}</v-list-tile>
  </v-list>
</template>

<script>
export default {
  props: ["menuItems"]
};
</script>

<style>
</style>
