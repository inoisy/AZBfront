<template>
  <v-dialog v-model="isShow" width="500">
    <v-card class="dialog-inner">
      <div class="headline grey lighten-2 d-flex py-3 px-5 align-center" primary-title>
        <span class="pr-3">Заказать {{name}}</span>
        <v-btn class="ml-auto" text icon outlined large color="primary" @click="close">
          <v-icon>close</v-icon>
        </v-btn>
      </div>

      <v-card-text>
        <p class="mb-4 mt-4">
          Пожалуйста, заполните краткую контактную информацию,
          и наши сотрудники обязательно свяжутся с Вами.
        </p>
        <contact-form />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import ContactForm from "~/components/ContactForm";

export default {
  components: {
    ContactForm
  },
  // data() {
  //   return {
  //     show: false
  //   };
  // },
  // watch: {
  //   async show(val) {
  //     console.log("show -> val", val);
  //     await this.$store.commit("dialog", {
  //       name: "",
  //       isShow: val
  //     });
  //   }
  // },
  methods: {
    async close() {
      await this.$store.commit("dialog", {
        name: "",
        isShow: false
      });
    }
  },
  computed: {
    // dialog() {
    //   return this.$parent.dialog;
    // },
    name() {
      return this.$store.state.dialog.name;
    },
    isShow: {
      get() {
        return this.$store.state.dialog.isShow;
      },
      async set(val) {
        await this.$store.commit("dialog", {
          name: "",
          isShow: val
        });
      }
    }
  }
};
</script>