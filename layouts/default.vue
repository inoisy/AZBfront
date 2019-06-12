<template>
  <v-app>
    <v-toolbar class="pa-0" fixed>
      <div class="toolbar-top hidden-sm-and-down fill-height" style>
        <div class="toolbar-top-inner fill-height">
          <v-btn
            :href="`tel:${contacts.phone}`"
            class="toolbar-top-btn white--text ma-0 fill-height"
            style="text-decoration:none"
            flat
          >
            <v-icon class="mr-1" style="color:currentcolor">phone</v-icon>
            <span>{{contacts.phone}}</span>
          </v-btn>
          <v-btn
            :href="`mailto:${contacts.email}`"
            class="toolbar-top-btn white--text ma-0 fill-height"
            style="text-decoration:none"
            flat
          >
            <v-icon class="mr-1" style="color:currentcolor">mail</v-icon>
            <span>{{contacts.email}}</span>
          </v-btn>
          <v-btn
            to="/contacts#map"
            class="toolbar-top-btn white--text ma-0 fill-height"
            style="text-decoration:none"
            flat
          >
            <v-icon class="mr-1" style="color:currentcolor">location_on</v-icon>
            <span class="hidden-md-and-down">{{contacts.content.address.title}}</span>
          </v-btn>
        </div>
      </div>
      <div class="toolbar-bottom">
        <v-btn
          v-show="!searchActive"
          to="/"
          class="fill-height logo-link ma-0 py-2 ml-2"
          color="transparent"
          flat
        >
          <img class="logo-img d-block" :src="require('~/assets/azblogo.png')">
        </v-btn>
        <v-spacer v-show="!searchActive"></v-spacer>
        <v-btn v-show="!searchActive" @click="searchActive=true" class icon>
          <v-icon>search</v-icon>
        </v-btn>
        <autocomplete-search v-if="searchActive" @searchChange="searchActive=$event"/>
        <v-btn v-show="searchActive" icon @click="searchActive = false">
          <v-icon>close</v-icon>
        </v-btn>
        <div
          v-show="!searchActive"
          class="hidden-sm-and-down fill-height ml-3"
          style="display:flex"
        >
          <template v-for="(item,index) in menuItems">
            <v-menu
              :key="index"
              v-if="item.items && item.items.length>0"
              class="fill-height"
              style="display:flex"
              open-on-hover
              offset-y
              left
              transition="slide-y-transition"
            >
              <v-btn class="fill-height ma-0 header-link" slot="activator" flat nuxt :to="item.to">
                {{item.name}}
                <v-icon>arrow_drop_down</v-icon>
              </v-btn>

              <v-list :class="item.items.length > 8 ? 'two-columns' : ''">
                <v-list-tile
                  class="list-item"
                  active-class="text--accent"
                  v-for="(child, index) in item.items"
                  :key="index"
                  nuxt
                  :to="`${item.to}/${child.slug}`"
                >
                  <!-- :to="item.forms && item.forms.length > 0 ? localePath({ name: 'catalog-slug', params: { slug: item.forms[0].slug } }) :  localePath({ name: 'about-slug', params: { slug: item.slug } })" -->
                  {{ child.name }}
                </v-list-tile>
              </v-list>
            </v-menu>
            <v-btn
              v-else
              flat
              nuxt
              exact
              :key="index"
              class="ma-0 fill-height header-link"
              :to="item.to"
            >{{item.name}}</v-btn>
          </template>
        </div>
        <v-btn
          v-show="!searchActive"
          class="toolbar-top-btn ml-1 hidden-md-and-up"
          icon
          :href="`tel:${contacts.tel}`"
        >
          <v-icon class style="color:currentcolor">phone</v-icon>
        </v-btn>
        <v-btn
          v-show="!searchActive"
          class="toolbar-top-btn ml-1 hidden-md-and-up"
          icon
          to="/contacts#map"
        >
          <v-icon class style="color:currentcolor">location_on</v-icon>
        </v-btn>
        <v-btn
          v-show="!searchActive"
          icon
          class="ml-1 hidden-md-and-up mr-3"
          @click="drawer=!drawer"
        >
          <v-icon>menu</v-icon>
        </v-btn>
      </div>
    </v-toolbar>
    <v-content>
      <nuxt/>
    </v-content>

    <v-navigation-drawer v-model="drawer" temporary fixed right>
      <v-list>
        <v-list-tile
          active-class="text--accent"
          v-for="item in menuItems"
          :key="item.name"
          :to="item.to"
          nuxt
          ripple
        >
          <v-list-tile-title>{{item.name}}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-footer
      height="auto"
      style="position: relative; background-size: cover; background-position: center;"
      :style="`background-image: url(${require('~/assets/footer-bg.png')})`"
    >
      <v-container class="pt-5">
        <v-layout row wrap align-center d-flex class="mb-5">
          <v-btn
            dark
            v-for="item in menuItems"
            :key="item.name"
            :to="item.to"
            nuxt
            ripple
            flat
            round
          >{{item.name}}</v-btn>
        </v-layout>
        <v-layout row wrap class="mb-4">
          <v-flex xs12 md4 class="px-3 display-flex contact-wrapper">
            <a
              :href="`tel:${contacts.phone}`"
              class="contact-link display-flex white--text align-center text-decoration-none link-hover text-xs-left text-md-center"
            >
              <div class="icon-wrapper d-inline-flex">
                <v-icon class="ma-auto" size="2rem" dark>phone</v-icon>
              </div>
              {{contacts.phone}}
            </a>
          </v-flex>
          <v-flex xs12 md4 class="px-3 display-flex contact-wrapper">
            <a
              :href="`mailto:${contacts.email}`"
              class="contact-link display-flex white--text align-center text-decoration-none link-hover text-xs-left text-md-center"
            >
              <div class="icon-wrapper">
                <v-icon class="ma-auto" size="2rem" dark>mail</v-icon>
              </div>
              {{contacts.email}}
            </a>
          </v-flex>
          <v-flex xs12 md4 class="px-3 display-flex contact-wrapper">
            <nuxt-link
              to="/contacts#map"
              class="contact-link display-flex white--text align-center text-decoration-none link-hover text-xs-left text-md-center"
            >
              <div class="icon-wrapper">
                <v-icon class="ma-auto" size="2rem" dark>location_on</v-icon>
              </div>
              {{contacts.content.address.title}}
            </nuxt-link>
          </v-flex>
        </v-layout>
        <p class="text-xs-center white--text mb-0">©Азбука Электроснабжения. Все права защищены.</p>
      </v-container>
    </v-footer>
  </v-app>
</template>
<style lang="stylus" >
.two-columns {
  column-count: 2;
  max-width: 600px;

  .list-item {
    float: left;
    page-break-inside: avoid;
    break-inside: avoid;
    width: 100%;
    // max-width: 300px;
  }
}

.contact-wrapper {
  .contact-link {
    flex-direction: row;
    margin-bottom: 24px;
    color: white;

    &:hover {
      .icon-wrapper {
        background: #1f5bff;
      }
    }
  }
}

.v-input__append-outer {
  margin: 0 !important;
}

.v-toolbar__content {
  height: auto !important;
}

.v-content {
  padding-top: 64px !important;
}

// .toolbar-bottom {
// height: 64px;
// }
.icon-wrapper {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 3.5rem;
  min-width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
}

// .icon-wrapper img {
// width: 2.8rem;
// display: block;
// margin: 0 auto;
// }
.v-toolbar__content {
  // padding: 0 !important;
  padding-left: 0 !important;
  padding-right: 0 !important;
  // height: auto !important;
  // display: block;
  flex-direction: column;
}

.toolbar-top-btn {
}

.toolbar-top {
  display: flex;
  height: 38px;
  width: 100%;
  background-color: #2E2E35;
}

.toolbar-bottom {
  width: 100%;
  height: 64px;
  min-height: 64px;
  justify-content: center;
  align-items: flex-start;
  flex-direction: row;
  display: flex;
  align-items: center;
  // max-width: 1785px;
}

.toolbar-top-inner {
  justify-content: flex-end;
  display: flex;
}

.toolbar-bottom, .toolbar-top-inner {
  flex: 1 1 100%;
  margin: auto;
  // padding: 24px;
  width: 100%;
}

.v-toolbar__content > *:last-child, .v-toolbar__extension > *:last-child {
  margin-right: auto;
}

@media (max-width: 600px) {
  .logo-img {
    max-width: 120px;
  }
}

@media (min-width: 960px) {
  .contact-wrapper {
    align-items: flex-start;
    justify-content: center;

    .contact-link {
      flex-direction: column;

      .icon-wrapper {
        margin-bottom: 1.5rem;
        margin-right: 0;
      }
    }
  }

  // .toolbar-bottom, .toolbar-top-inner {
  // max-width: 900px;
  // }
  .toolbar-bottom {
    height: 90px;
    min-height: 90px;
  }

  .v-content {
    padding-top: 128px !important;
  }
}

// @media only screen and (min-width: 1264px) {
// .toolbar-bottom, .toolbar-top-inner {
// max-width: 1185px;
// }
// }

// @media only screen and (min-width: 1904px) {
// .toolbar-bottom, .toolbar-top-inner {
// max-width: 1785px;
// }
// }

// @media (max-width: 960px) {
// .v-toolbar__content {
// display: flex;
// }
// }
.search {
  // margin-left: 10rem !important;
  // width: 36rem;
  .v-input__slot {
    margin-bottom: 0 !important;
  }
}

.logo-link.nuxt-link-exact-active:hover {
  .logo-img {
    transform: none;
  }
}

.logo-img {
  max-height: 55px;
  transition: ease 0.3s;
  image-rendering: crisp-edges;
}

.logo-link:hover {
  .logo-img {
    transform: scale(1.05);
    transition: ease 0.3s;
  }
}
</style>


<script>
import AutocompleteSearch from "~/components/AutocompleteSearch";
export default {
  components: { AutocompleteSearch },

  computed: {
    contacts() {
      // console.log(
      //   "TCL: contacts -> this.$store.state.generalInfo.contacts[0]",
      //   this.$store.state.generalInfo.contacts
      // );

      return this.$store.state.generalInfo.contacts &&
        this.$store.state.generalInfo.contacts.length > 0
        ? this.$store.state.generalInfo.contacts[0]
        : {};
    },
    menuItems() {
      return [
        {
          name: "Главная",
          to: "/"
        },
        {
          name: "Каталог",
          to: "/catalog",
          items: this.$store.state.generalInfo.categories
        },
        {
          name: "Производители",
          to: "/manufacturers",
          items: this.$store.state.generalInfo.manufacturers
        },
        {
          name: "О компании",
          to: "/about",
          items: this.$store.state.generalInfo.aboutPages.map(item => {
            return { name: item.title, ...item };
          })
        },
        {
          name: "Контакты",
          to: "/contacts"
        }
      ];
    },
    isSearchValid() {
      return this.search && this.search.length > 3;
    },
    toolbarHeight() {
      // console.log(this.$vuetify.breakpoint.mdAndUp ? "124px" : "64px");
      return this.$vuetify.breakpoint.mdAndUp ? "124px" : "64px";
    },
    isLoading() {
      return this.$store.state.loading;
    },
    autocompleteItems() {
      const items =
        this.$store.state.autocompleteSearchItems &&
        this.$store.state.autocompleteSearchItems.length > 0
          ? this.$store.state.autocompleteSearchItems
          : [];
      return items;
    }
    // fields() {
    //   if (!this.model) return [];

    //   return Object.keys(this.model).map(key => {
    //     return {
    //       key,
    //       value: this.model[key] || "n/a"
    //     };
    //   });
    // }
  },
  methods: {
    async handleMap() {
      await this.$router.push("/contacts");
      // await this.$vuetify.goTo("#yandex-map");
    }
  },
  data() {
    return {
      drawer: false,

      searchActive: false
    };
  }
};
// value: null,
// suggestionAttribute: "name",
// suggestions: [],
// selectedEvent: "",
// entries: [],
// searchItems: [],
// search: null,
// model: null,
// computed: {
//   autocompleteItems() {
//     return this.$store.state.autocompleteSearchItems.map(item => item.name);
//   }
// },
// watch: {
// async model() {
//   console.log("watch model", this.model);
//   const query = {
//     size: 10,
//     from: 0,
//     query: {
//       multi_match: {
//         query: this.model,
//         fields: ["SKU", "description", "name"]
//       }
//     }
//   };
//   const { data } = await this.$axios.post(
//     "http://localhost:1337/products/search",
//     query
//   );
//   this.entries = data.hits;
//   // this.$store.commit("autocompleteSearchItems", data.hits);
// },
//   selectedEvent() {
//     console.log(this.selectedEvent);
//   },
//   search() {
//     console.log("watch model", this.search);
//   }
// },
// methods: {
// clickInput: function() {
//   this.selectedEvent = "click input";
// },
// clickButton: function() {
//   this.selectedEvent = "click button";
// },
// selected: function() {
//   this.selectedEvent = "selection changed";
// },
// enter: function() {
//   this.selectedEvent = "enter";
// },
// keyUp: function() {
//   this.selectedEvent = "keyup pressed";
// },
// keyDown: function() {
//   this.selectedEvent = "keyDown pressed";
// },
// keyRight: function() {
//   this.selectedEvent = "keyRight pressed";
// },
// clear: function() {
//   this.selectedEvent = "clear input";
// },
// escape: function() {
//   this.selectedEvent = "escape";
// },
// changed: async function() {
//   var that = this;
//   this.suggestions = [];
//   if (this.value && this.value.length > 3) {
//     const items = await this.$store.dispatch(
//       "autocompleteSearch",
//       this.value
//     );
//     console.log(items);
//     items.forEach(item => that.suggestions.push(item));
//     // console.log(that.suggestions);
//     // this.$axios
//     //   .get(
//     //     "https://api.themoviedb.org/3/search/movie?api_key=342d3061b70d2747a1e159ae9a7e9a36&query=" +
//     //       this.value
//     //   )
//     //   .then(function(response) {
//     //     response.data.results.forEach(function(a) {
//     //       that.suggestions.push(a);
//     //     });
//     //   });
//   }
// }
// async throttledMethod(val) {
//   await this.$store.dispatch("autocompleteSearch", val);
// console.log("throttledMethod", this.model, this.search, val);

// this.$store.commit("autocompleteSearchItems", data.hits);
// this.searchItems = data.hits;
// console.log(this.searchItems);
// }
// async search() {
//   console.log("search");
// }
// },
</script>
