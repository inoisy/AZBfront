<template>
  <section class="grey lighten-2">
    <v-container id="main-wrapper">
      <breadcrumbs class="pl-1 mb-4" :items="breadcrumbs" />
      <h1 class="mb-12 font-weight-bold">{{title }}</h1>
      <div class="slot-wrapper" ref="slot">
        <slot></slot>
      </div>
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
