<template>
  <v-dialog v-model="isShow" width="500" persistent>
    <v-card class="dialog-inner">
      <v-card-title class="headline grey lighten-2 pr-5" primary-title>Заказать {{name}}</v-card-title>
      <v-btn class="close-btn" flat icon large color="primary" @click="close">
        <v-icon>close</v-icon>
      </v-btn>
      <v-card-text>
        <p class="mb-4 display-1">
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
    isShow() {
      return this.$store.state.dialog.isShow;
    }
  }
};
</script>

<style>
</style>
