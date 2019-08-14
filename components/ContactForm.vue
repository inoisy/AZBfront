<template>
  <v-form v-model="valid" class="layout wrap">
    <v-text-field
      class="xs12 py-0 flex"
      solo
      v-model="name"
      :error-messages="nameErrors"
      :counter="35"
      :label="'Ваше имя'"
      required
      @blur="$v.name.$touch()"
    ></v-text-field>
    <v-text-field
      class="xs12 py-0 flex"
      solo
      v-model="email"
      :error-messages="emailErrors"
      label="E-mail"
      required
      @blur="$v.email.$touch()"
    ></v-text-field>
    <v-text-field
      class="xs12 py-0 flex"
      solo
      v-model="phone"
      :error-messages="phoneErrors"
      mask="(###) ### - ####"
      :label="'Телефон'"
      required
      @blur="$v.phone.$touch()"
    ></v-text-field>

    <v-flex>
      <v-btn class="ml-0" color="#1F5BFF" dark @click="submit">Отправить</v-btn>
      <!-- <v-btn flat @click="clear">Очистить</v-btn> -->
    </v-flex>

    <v-slide-y-transition>
      <v-flex xs12 v-if="this.formSuccess || this.formError">
        <v-alert
          :value="this.formSuccess"
          class="flex xs12 mt-3"
          type="success"
        >Cообщение отправлено!</v-alert>
        <v-alert :value="this.formError" class="flex xs12 mt-3" type="error">Ошибка при отправке!</v-alert>
      </v-flex>
    </v-slide-y-transition>
  </v-form>
</template>


<script>
// import axios from "axios";
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  email,
  alpha
} from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  validations: {
    name: { required, maxLength: maxLength(35), minLength: minLength(3) },
    email: { required, email },
    phone: { required, minLength: minLength(10), maxLength: maxLength(15) }
  },
  data: () => ({
    formSuccess: false,
    formError: false,
    name: "",
    email: "",
    phone: "",
    valid: ""
  }),
  methods: {
    clear() {
      this.$v.$reset();
      this.phone = "";
      this.name = "";
      this.email = "";
    },
    async submit() {
      //   console.log(this.valid);
      this.$v.$touch();
      const msg = {
        name: this.name,
        email: this.email,
        phone: this.phone,
        productName: this.$store.state.dialog.name
      };
      console.log("TCL: submit -> msg", msg);
      //   console.log(this.$v);
      if (!this.$v.$anyError) {
        const req = await this.$axios
          .post(process.env.baseUrl + "/email", {
            to: "noreply@azb-es.ru",
            from: "noreply@azb-es.ru",
            subject: `Обращение с сайта`,
            text: `Обращение с сайта от ${msg.name} 
             Email: ${msg.email}. Телефон: ${msg.phone}. Товар: ${msg.productName}. `,
            html: `Обращение с сайта от ${msg.name} .<br/> Email: ${msg.email}. Телефон: ${msg.phone}.<br/>  Товар: ${msg.productName}.`
          })
          .then(response => {
            this.formSuccess = true;
            this.clear();
          })
          .catch(error => {
            this.formError = true;
            this.clear();
          });
      }
    }
  },
  computed: {
    // currLocale() {
    //   return this.$i18n.locale;
    // },
    //  productName() {
    //     return this.$store.state.dialog.name;
    //   },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength && errors.push("Слишком длинное имя");
      !this.$v.name.minLength &&
        errors.push(
          this.currLocale === "ru"
            ? "Слишком короткое имя"
            : "Name is too short"
        );
      !this.$v.name.required && errors.push("Введите имя");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Введите корректный email");
      !this.$v.email.required && errors.push("Введите email");
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.phone.$dirty) return errors;
      !this.$v.phone.maxLength &&
        errors.push("Phone must be at most 15 characters long");
      !this.$v.phone.minLength && errors.push("Слишком короткий телефон");
      !this.$v.phone.required && errors.push("Введите телефон");
      return errors;
    }
  }
};
</script>