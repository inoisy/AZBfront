<template>
  <div>about</div>
</template>

<script>
export default {
  async asyncData(ctx) {
    console.log(ctx.route.params);
    // return {
    //   route: ctx.route.params.product
    // };
  }
};
</script>

<style>
</style>
