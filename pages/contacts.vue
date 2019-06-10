<template>
  <div>
    <default-header :breadcrumbs="breadcrumbs" :title="title"></default-header>

    <!-- <section class="grey lighten-2">
      <v-container grid-list-xs>
        <breadcrumbs class="pl-1" :items="breadcrumbs"/>
        <h1>{{title}}</h1>
      </v-container>
    </section>-->
    <section>
      <v-container class="py-5">
        <v-layout row wrap>
          <v-flex xs12 class="mb-4">
            <a :href="`tel:${contacts.phone}`" class="link font-weight-medium display-1">
              <v-icon class="mr-3">phone</v-icon>
              {{contacts.phone}}
            </a>
          </v-flex>
          <v-flex xs12 class="mb-4">
            <a :href="`mailto:${contacts.email}`" class="link font-weight-medium display-1">
              <v-icon class="mr-3">mail</v-icon>
              {{contacts.email}}
            </a>
          </v-flex>
          <v-flex xs12 class="mb-4">
            <a @click="$vuetify.goTo('#map')" class="link font-weight-medium display-1">
              <v-icon class="mr-3">location_on</v-icon>
              {{contacts.content.address.title}}
            </a>
          </v-flex>
          <v-flex xs12 class="mb-4">
            <p class="link font-weight-medium display-1">
              <v-icon class="mr-3">access_time</v-icon>
              {{contacts.content.accessTime}}
            </p>
          </v-flex>
          <no-ssr>
            <yandex-map
              id="map"
              :coords="contacts.content.address.coords"
              zoom="16"
              style="width: 100%; height: 35rem;"
            >
              <ymap-marker
                marker-id="1"
                marker-type="placemark"
                :coords="contacts.content.address.coords"
              ></ymap-marker>
              <!--Markers-->
            </yandex-map>
          </no-ssr>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
import Breadcrumbs from "~/components/Breadcrumbs";
import DefaultHeader from "~/components/DefaultHeader";

// import { yandexMap, ymapMarker } from "vue-yandex-maps";

export default {
  head() {
    return {
      title: "Контакты",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Контакты - Азбука электронабжения"
        }
      ]
    };
  },
  components: {
    Breadcrumbs,
    DefaultHeader
    // yandexMap,
    // ymapMarker
  },
  computed: {
    contacts() {
      return this.$store.state.generalInfo.contacts &&
        this.$store.state.generalInfo.contacts.length > 0
        ? this.$store.state.generalInfo.contacts[0]
        : {};
    },
    breadcrumbs() {
      return [
        {
          text: "Главная",
          to: "/"
        },
        {
          text: this.title,
          to: this.$route.path
        }
      ];
    }
  },
  async asyncData(ctx) {
    await ctx.store.dispatch("fetchGeneralInfo");
  },
  data() {
    return {
      title: "Контакты"
    };
  }
};
</script>
<style lang="stylus" scoped>
.link {
  text-decoration: none;

  .v-icon {
    color: currentColor;
  }
}

.link:hover {
  color: #1F5BFF;
}
</style>