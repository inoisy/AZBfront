<template>
  <div>
    <section class="grey lighten-2">
      <v-container grid-list-xs>
        <breadcrumbs class="pl-1" :items="breadcrumbs"/>
        <h1>{{title}}</h1>
      </v-container>
    </section>
    <section>
      <v-container class="py-5">
        <v-layout row wrap>
          <v-flex xs12 class="mb-4">
            <a href="tel:+77777777" class="link font-weight-medium display-1">
              <v-icon class="mr-3">phone</v-icon>+7 (777) 777 77 77
            </a>
          </v-flex>
          <v-flex xs12 class="mb-4">
            <a href="mailto:mail@azb-es.ru" class="link font-weight-medium display-1">
              <v-icon class="mr-3">mail</v-icon>mail@azb-es.ru
            </a>
          </v-flex>
          <v-flex xs12 class="mb-4">
            <a @click="$vuetify.goTo('#yandex-map')" class="link font-weight-medium display-1">
              <v-icon class="mr-3">location_on</v-icon>г. Москва Загородное шоссе дом 1 корпус 2 офис 212
            </a>
          </v-flex>
          <v-flex xs12 class="mb-4">
            <p href="mailto:mail@azb-es.ru" class="link font-weight-medium display-1">
              <v-icon class="mr-3">access_time</v-icon>Пн-пт, 9:00-18:00
            </p>
          </v-flex>
          <no-ssr>
            <yandex-map
              id="yandex-map"
              :coords="[ 55.698695,37.615255]"
              zoom="16"
              style="width: 100%; height: 35rem;"
            >
              <ymap-marker marker-id="1" marker-type="placemark" :coords="[55.698695,37.615255]"></ymap-marker>
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
// import { yandexMap, ymapMarker } from "vue-yandex-maps";

export default {
  components: {
    Breadcrumbs
    // yandexMap,
    // ymapMarker
  },
  computed: {
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