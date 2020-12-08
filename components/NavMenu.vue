<template>
  <v-sheet color="white" elevation="3" style="position: sticky; top: 110px">
    <v-list
      class="navigation pa-0"
      style="background-color: transparent !important"
      color="transparent"
    >
      <template v-for="(category, index) in menuItems">
        <v-list-group
          v-if="category && category.child && category.child.length > 0"
          :key="category.slug"
          color="accent"
          class="main-cat"
        >
          <v-list-item
            slot="activator"
            :to="`/catalog/${category.slug}`"
            :title="category.name"
          >
            <v-list-item-content
              class="py-1"
              style="line-height: normal; font-size: 14px"
              >{{ category.name }}</v-list-item-content
            >
          </v-list-item>
          <v-divider></v-divider>
          <template v-for="subcategory in category.child">
            <v-list-item
              :to="`/catalog/${category.slug}/${subcategory.slug}`"
              :key="subcategory.id"
              :title="subcategory.name"
            >
              <v-list-item-content
                class="pl-5 py-1"
                style="line-height: normal; font-size: 14px"
                >{{ subcategory.name }}</v-list-item-content
              >
            </v-list-item>
          </template>
          <v-divider></v-divider>
        </v-list-group>
        <v-list-item
          :title="category.name"
          :key="index"
          v-else
          color="accent"
          :to="
            !isAbout ? `/catalog/${category.slug}` : `/about/${category.slug}`
          "
        >
          <span style="line-height: 100% !important; font-size: 14px">{{
            category.name || category.title
          }}</span>
        </v-list-item>
      </template>
    </v-list>
  </v-sheet>
</template>
<style lang="stylus" scoped>
.nav-menu-item {
  line-height: 1;
}
</style>
<script>
export default {
  props: {
    menuItems: {
      type: Array,
    },
    isAbout: {
      type: Boolean,
      default: false,
    },
  }, //["menuItems", "type"]
};
</script>