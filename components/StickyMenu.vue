<template>
  <div
    v-scroll="onScroll"
    id="sidebarContent"
    class="sidebarContent pl-1"
    v-resize="onResize"
    :class="sidebarStyles"
    ref="sidebarContent"
    :style="sidebarStyles['fixed-bottom'] && !sidebarStyles['fixed-top'] ? `padding-bottom: ${sidebar.marginBottom}px;` : ''"
  >
    <slot></slot>
  </div>
</template>

<script>
// import _ from "lodash";
export default {
  mounted() {},
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint
        ? this.$vuetify.breakpoint.smAndDown
        : null;
    },
    sidebarStyles() {
      const currScroll =
        this.sidebar.windowScrollTop + this.sidebar.innerHeight;
      // console.log("TCL: sidebarStyles -> pos1", pos1);
      const bottomSide = this.sidebar.offsetHeight + this.sidebar.elemHeight;
      // console.log("TCL: sidebarStyles -> pos2", pos2);
      const bottom = currScroll > bottomSide;

      const top = this.sidebar.windowScrollTop > this.sidebar.offsetHeight;
      return {
        "fixed-top": !this.breakpoint && !bottom && top,
        "fixed-bottom": top && !this.breakpoint && bottom
      };
    }
  },
  methods: {
    onResize() {
      const elem = this.$refs.sidebarContent
        ? this.$refs.sidebarContent.parentElement
        : null;
      // this.windowSize = { x: window.innerWidth, y: window.innerHeight };
      this.sidebar.offsetHeight = elem.offsetTop;
      this.calculateSidebar();
    },
    calculateSidebar() {
      const elem = this.$refs.sidebarContent
        ? this.$refs.sidebarContent.parentElement
        : null;
      const clientRect = elem ? elem.getBoundingClientRect().y : "";
      this.sidebar.elemHeight = elem.getBoundingClientRect().height;
      this.sidebar.clientRect = clientRect;
      this.sidebar.toolbarHeight = this.$vuetify.breakpoint.mdAndUp ? 92 : 64;
      this.sidebar.innerHeight = window.innerHeight;
      this.sidebar.offsetHeight = elem ? elem.offsetTop : 0;
      this.sidebar.marginBottom =
        this.sidebar.innerHeight -
        (this.sidebar.clientRect + elem.offsetHeight) +
        this.sidebar.toolbarHeight +
        20;
    },
    onScroll() {
      this.sidebar.windowScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      this.calculateSidebar();
    }
  },
  mounted() {
    this.calculateSidebar();
  },
  created() {},
  data() {
    return {
      offsetTop: 0,
      // windowSize: {
      //   x: 0,
      //   y: 0
      // },
      sidebar: {
        height: 0,
        windowHeight: 0,
        clientRect: 500,
        windowScrollTop: 0,
        innerHeight: 0,
        offsetHeight: 0
      }
    };
  }
};
</script>

<style lang="stylus">
.sidebarContent {
  width: 100%;

  &::-webkit-scrollbar {
    width: 0 !important;
  }

  overflow: -moz-scrollbars-none;
  -ms-overflow-style: none;
}

.fixed-bottom {
  position: fixed;
  width: inherit;
  top: 80px;
  height: 100%;
  overflow-y: auto;
}

.fixed-top {
  position: fixed;
  width: inherit;
  top: 80px;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 90px;
}

@media only screen and (min-width: 960px) {
  .fixed-top, .fixed-bottom {
    top: 100px;
    padding-bottom: 160px;
  }
}
</style>
