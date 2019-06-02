<template>
  <section class="grey lighten-2">
    <v-container id="main-wrapper">
      <breadcrumbs class="pl-1 mb-4" :items="breadcrumbs"/>
      <h1 class="display-5 mb-5 font-weight-bold">{{title }}</h1>
    </v-container>
  </section>
</template>

<script>
import Breadcrumbs from "~/components/Breadcrumbs";

export default {
  components: {
    Breadcrumbs
  },
  props: ["breadcrumbs", "title"]
};
</script>

<style>
</style>
