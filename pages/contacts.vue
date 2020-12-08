<template>
  <div>
    <default-header :breadcrumbs="breadcrumbs" :title="title"></default-header>
    <section>
      <v-container class="py-12">
        <v-layout row wrap>
          <v-flex xs12 class="mb-3">
            <a :href="`tel:${contacts.phone}`" class="link font-weight-medium">
              <v-icon class="mr-3">phone</v-icon>
              {{ contacts.phone }}
            </a>
          </v-flex>
          <v-flex xs12 class="mb-3">
            <a
              :href="`mailto:${contacts.email}`"
              class="link font-weight-medium"
            >
              <v-icon class="mr-3">mail</v-icon>
              {{ contacts.email }}
            </a>
          </v-flex>
          <v-flex xs12 class="mb-3">
            <a @click="$vuetify.goTo('#map')" class="link font-weight-medium">
              <v-icon class="mr-3">location_on</v-icon>
              {{ contacts.content.address.title }}
            </a>
          </v-flex>
          <v-flex xs12 class="mb-3">
            <div class="link font-weight-medium no-select">
              <v-icon class="mr-3">access_time</v-icon>
              {{ contacts.content.accessTime }}
            </div>
          </v-flex>
          <client-only>
            <yandex-map
              class="mt-9"
              id="map"
              :coords="contacts.content.address.coords"
              zoom="16"
              style="width: 100%; height: 35rem"
            >
              <ymap-marker
                marker-id="1"
                marker-type="placemark"
                :coords="contacts.content.address.coords"
              ></ymap-marker>
            </yandex-map>
          </client-only>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
import Breadcrumbs from "~/components/Breadcrumbs";
import DefaultHeader from "~/components/DefaultHeader";

export default {
  head() {
    return {
      title: "Контакты",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Контакты - Азбука электронабжения",
        },
      ],
    };
  },
  components: {
    Breadcrumbs,
    DefaultHeader,
  },
  computed: {
    contacts() {
      return this.$store.state.generalInfo.contacts;
    },
    breadcrumbs() {
      return [
        {
          text: "Главная",
          to: "/",
        },
        {
          text: this.title,
          to: this.$route.path,
        },
      ];
    },
  },
  async asyncData(ctx) {
    // await ctx.store.dispatch("fetchGeneralInfo");
  },
  data() {
    return {
      title: "Контакты",
    };
  },
};
</script>
<style lang="stylus" scoped>
.link {
  text-decoration: none;

  .v-icon {
    color: currentColor;
  }
}

.link {
  color: #1d1d1d;
  font-size: 1.1rem;
  display: inline-flex;
}

.link:hover:not(.no-select) {
  color: #1F5BFF;
}
</style>