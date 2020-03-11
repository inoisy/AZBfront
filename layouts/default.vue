<template>
  <v-app>
    <v-app-bar app class="pa-0" fixed :height="$vuetify.breakpoint.smAndDown ? '64px' : '92px'">
      <div class="toolbar-top hidden-sm-and-down fill-height" style>
        <div class="toolbar-top-inner fill-height">
          <v-btn
            tile
            small
            :href="`tel:${contacts.phone}`"
            class="toolbar-top-btn white--text ma-0 fill-height"
            style="text-decoration:none"
            text
          >
            <v-icon class="mr-1" style="color:currentcolor">phone</v-icon>
            <span>{{contacts.phone}}</span>
          </v-btn>
          <v-btn
            tile
            small
            :href="`mailto:${contacts.email}`"
            class="toolbar-top-btn white--text ma-0 fill-height"
            style="text-decoration:none"
            text
          >
            <v-icon class="mr-1" style="color:currentcolor">mail</v-icon>
            <span>{{contacts.email}}</span>
          </v-btn>
          <v-btn
            tile
            small
            to="/contacts#map"
            class="toolbar-top-btn white--text ma-0 fill-height"
            style="text-decoration:none"
            text
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
          text
        >
          <img class="logo-img d-block" :src="require('~/assets/azblogo.png')" />
        </v-btn>
        <v-spacer v-show="!searchActive"></v-spacer>
        <v-btn v-show="!searchActive" @click="searchActive=true" class icon>
          <v-icon>search</v-icon>
        </v-btn>
        <autocomplete-search v-if="searchActive" @searchChange="searchActive=$event" />
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
              open-on-hover
              offset-y
              left
              transition="slide-y-transition"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  class="ma-0 header-link"
                  slot="activator"
                  height="64px"
                  text
                  nuxt
                  tile
                  :to="item.to"
                >
                  {{item.name}}
                  <v-icon>arrow_drop_down</v-icon>
                </v-btn>
              </template>

              <v-list :class="item.items.length > 8 ? 'two-columns' : ''">
                <v-list-item
                  class="list-item"
                  active-class="text--accent"
                  v-for="(child, index) in item.items"
                  :key="index"
                  nuxt
                  :to="`${item.to}/${child.slug}`"
                >{{ child.name }}</v-list-item>
              </v-list>
            </v-menu>
            <v-btn
              v-else
              :to="item.to"
              :key="index"
              class="ma-0 fill-height header-link"
              height="64px"
              text
              nuxt
              exact
              tile
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
    </v-app-bar>
    <v-content>
      <nuxt />
    </v-content>
    <v-navigation-drawer v-model="drawer" temporary fixed right>
      <v-list class="pt-0">
        <template v-for="(item,i) in menuItems">
          <v-list-group v-if="item.items && item.items.length>0" :key="item.to">
            <v-list-item slot="activator" :to="item.to">
              <v-list-item-content>{{ item.name}}</v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="product in item.items"
              :key="product.name"
              nuxt
              exact
              :to="`${item.to}/${product.slug}`"
            >
              <v-list-item-content class="ml-4">{{ product.name}}</v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            active-class="text--accent"
            :key="item.name"
            :to="item.to"
            nuxt
            ripple
            exact
          >
            <v-list-item-title>{{item.name}}</v-list-item-title>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-footer
      height="auto"
      style="position: relative; background-size: cover; background-position: center;"
      :style="`background-image: url(${require('~/assets/footer-bg.png')})`"
    >
      <v-container class="pt-12">
        <v-layout row wrap justify-center d-flex class="mb-10">
          <v-btn
            class="ma-2"
            dark
            v-for="item in menuItems"
            :key="item.name"
            :to="item.to"
            nuxt
            ripple
            text
            rounded
          >{{item.name}}</v-btn>
        </v-layout>
        <v-layout row wrap class="mb-4">
          <v-flex xs12 md4 class="px-3 display-flex contact-wrapper">
            <a
              :href="`tel:${contacts.phone}`"
              class="contact-link display-flex white--text align-center text-decoration-none link-hover text-xs-left text-md-center"
            >
              <div class="icon-wrapper d-inline-flex">
                <v-icon class="ma-auto" large dark>phone</v-icon>
              </div>
              <span class="text-wrapper">{{contacts.phone}}</span>
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
              <span class="text-wrapper">{{contacts.email}}</span>
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
              <span class="text-wrapper">{{contacts.content.address.title}}</span>
            </nuxt-link>
          </v-flex>
        </v-layout>
        <p class="text-center white--text mb-0">©Азбука Электроснабжения. Все права защищены.</p>
      </v-container>
    </v-footer>
    <catalog-dialog />
  </v-app>
</template>
<style lang="stylus" >
.two-columns {
  column-count: 2;
  max-width: 40rem;

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

      .text-wrapper {
        color: #1f5bff;
      }
    }
  }
}

.v-input__append-outer {
  margin: 0 !important;
}

// .v-toolbar__content {
// height: auto !important;
// }

// .v-content {
// padding-top: 64px !important;
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
  height: 28px;
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

// @media (max-width: 600px) {
// .logo-img {
// max-width: 120px;
// }
// }
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
    height: 64px;
    min-height: 64px;
  }
}

.search {
  // margin-left: 10rem !important;
  // width: 36rem;
  .v-input__slot {
    margin-bottom: 0 !important;
  }
}

.logo-link.v-btn--active:hover {
  .logo-img {
    transform: none;
  }
}

.logo-img {
  max-height: 48px;
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
import CatalogDialog from "~/components/CatalogDialog";

export default {
  components: { AutocompleteSearch, CatalogDialog },

  computed: {
    contacts() {
      return this.$store.state.generalInfo.contacts;
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
  },
  methods: {
    async handleMap() {
      await this.$router.push("/contacts");
    }
  },
  data() {
    return {
      drawer: false,
      searchActive: false
    };
  }
};
</script>
