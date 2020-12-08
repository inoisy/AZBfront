<template>
  <v-dialog
    v-model="isShow"
    width="600"
    style="overflow-x: hidden"
    content-class="dialog-active"
    @click:outside="close"
  >
    <v-card class="dialog-inner">
      <div
        class="headline d-flex py-3 px-5 align-center"
        :class="!formSuccess && 'grey lighten-2 '"
        primary-title
      >
        <template v-if="!formSuccess">
          <span class="pr-3" v-if="!isAttachment"
            >Заказать {{ productName }}</span
          >
          <span class="pr-3" v-else>Расчет заявки</span>
        </template>
        <!-- {{ isAttachment }} -->
        <!-- {{ formSuccess }} -->
        <v-btn
          class="ml-auto"
          text
          icon
          outlined
          large
          color="primary"
          @click="close"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </div>

      <v-card-text v-if="!formSuccess">
        <p
          class="mb-4 mt-4"
          v-text="
            isAttachment
              ? 'Пожалуйста, заполните краткую контактную информацию и прикрепите файл с заявкой.'
              : 'Пожалуйста, заполните краткую контактную информацию, и наши сотрудники обязательно свяжутся с Вами.'
          "
        ></p>
        <v-form class="layout wrap" v-model="form">
          <v-text-field
            class="xs12 py-0 flex"
            v-model="name"
            :error-messages="nameErrors"
            :counter="35"
            :label="'Ваше имя'"
            required
            outlined
            @blur="$v.name.$touch()"
          ></v-text-field>
          <v-text-field
            class="xs12 py-0 flex"
            v-model="email"
            :error-messages="emailErrors"
            label="E-mail"
            required
            outlined
            @blur="$v.email.$touch()"
          ></v-text-field>
          <v-text-field
            class="xs12 py-0 flex"
            v-model="phone"
            :error-messages="phoneErrors"
            v-mask="mask"
            :label="'Телефон'"
            required
            outlined
            @blur="$v.phone.$touch()"
          ></v-text-field>
          <v-textarea
            class="xs12 py-0 flex mb-6"
            outlined
            dense
            height="100px"
            v-model="message"
            hide-details
            label="Комментарий"
          ></v-textarea>
          <v-file-input
            v-if="isAttachment"
            v-model="files"
            :error-messages="filesErrors"
            @blur="$v.files.$touch()"
            class=""
            required
            multiple
            type="file"
            label="Вложения"
            placeholder="Выберите файлы"
            prepend-icon="attachment"
            outlined
          >
            <template v-slot:selection="{ index, text }">
              <v-chip v-if="index < 2" color="#1f5bff" dark label small>
                {{ text }}
              </v-chip>

              <span
                v-else-if="index === 2"
                class="overline grey--text text--darken-3 mx-2"
              >
                +{{ files.length - 2 }} Файл(ов)
              </span>
            </template>
          </v-file-input>
          <v-flex xs12>
            <v-btn
              class="ml-0"
              color="#1F5BFF"
              style="color: white"
              @click="submit"
              :disabled="submitDisabled"
              :loading="loading"
              large
              block
              >Отправить</v-btn
            >
          </v-flex>

          <v-slide-y-transition>
            <v-flex xs12 v-if="this.formSuccess || this.formError">
              <v-alert
                :value="this.formSuccess"
                class="flex xs12 mt-3"
                type="success"
                >Cообщение отправлено!</v-alert
              >
              <v-alert
                :value="this.formError"
                class="flex xs12 mt-3"
                type="error"
                >Ошибка при отправке!</v-alert
              >
            </v-flex>
          </v-slide-y-transition>
        </v-form>
      </v-card-text>
      <v-card-text v-else-if="true" class="pt-0 pb-7">
        <v-icon size="200" class="mx-auto d-flex">check_circle_outline</v-icon>
        <p class="text-h4 text-center">Заявка отправлена!</p>
        <p class="text-center text-title">
          Мы свяжемся с вами в ближайшее время.
        </p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<style lang="stylus">
.dialog-active {
  overflow-x: hidden;
}
</style>
<script>
// import ContactForm from "~/components/ContactForm";
import { validationMixin } from "vuelidate";
import { mask } from "vue-the-mask";

import {
  required,
  maxLength,
  minLength,
  email,
  alpha,
} from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],
  directives: {
    mask,
  },
  validations() {
    return {
      name: { required, maxLength: maxLength(35), minLength: minLength(3) },
      email: { required, email },
      phone: { required, minLength: minLength(17), maxLength: maxLength(19) },
      ...(this.isAttachment && {
        files: { required },
      }),
    };
  },
  data: () => ({
    formSuccess: false,
    formError: false,
    name: "",
    email: "",
    phone: "",
    message: "",
    files: [],
    form: false,
    mask: "+7 (###) ### - ####",
    loading: false,
  }),
  beforeDestroy() {
    this.close();
  },
  methods: {
    async close() {
      this.formSuccess = false;
      this.formError = false;
      await this.$store.commit("dialog", {
        name: "",
        isShow: false,
        isAttachment: false,
      });
    },
    // selectFile(file) {
    //   console.log(
    //     "🚀 ~ file: ContactForm.vue ~ line 93 ~ selectFile ~ file",
    //     file
    //   );
    //   // this.progress = 0;
    //   this.file = file;
    // },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    clear() {
      this.$v.$reset();
      this.phone = "";
      this.name = "";
      this.email = "";
    },
    async submit() {
      // console.log("files", this.files);
      // console.log("files", this.$refs);
      // console.log(
      //   "🚀 ~ file: ContactForm.vue ~ line 136 ~ submit ~ this.$v.$anyError",
      //   this.$v.$anyError
      // );

      console.log("files", this.files);
      this.$v.$touch();
      if (!this.$v.$anyError) {
        try {
          this.loading = true;
          var form = new FormData();
          const data = {
            name: this.name,
            email: this.email,
            phone: this.phone,
            productName: this.$store.state.dialog.name,
            sendEmail: true,
            message: this.message,
            isAttachment: this.isAttachment,
          };
          form.append("data", JSON.stringify(data));
          if (this.files && this.files.length) {
            for (let file of this.files) {
              form.append(`files.files`, file);
            }
          }
          const request = await this.$axios.post(
            process.env.baseUrl + "/orders",
            form
          );
          if (request && request.data && request.data.id) {
            this.formSuccess = true;
            this.$emit("success", true);
          }
          console.log(
            "🚀 ~ file: ContactForm.vue ~ line 141 ~ submit ~ request",
            request
          );
        } catch (error) {
          this.loading = false;
          this.formError = true;
          console.log(
            "🚀 ~ file: ContactForm.vue ~ line 139 ~ submit ~ error",
            error
          );
        }
        this.loading = false;
      }
    },
  },
  computed: {
    submitDisabled() {
      return !this.name || !this.phone || !this.email || this.$v.$anyError;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength && errors.push("Слишком длинное имя");
      !this.$v.name.minLength && errors.push("Слишком короткое имя");
      !this.$v.name.required && errors.push("Введите имя");
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.phone.$dirty) return errors;
      !this.$v.phone.maxLength && errors.push("Слишком длинный телефон");
      !this.$v.phone.minLength && errors.push("Слишком короткий телефон");
      !this.$v.phone.required && errors.push("Введите телефон");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Введите корректный email");
      !this.$v.email.required && errors.push("Введите email");
      return errors;
    },
    filesErrors() {
      const errors = [];
      if (!this.$v.files || !this.$v.files.$dirty) return errors;
      !this.$v.files.required && errors.push("Прикрепите файл");
      return errors;
    },
    isAttachment() {
      return this.$store.state.dialog.isAttachment;
    },
    productName() {
      return this.$store.state.dialog.name;
    },
    isShow: {
      get() {
        return this.$store.state.dialog.isShow;
      },
      async set(val) {
        await this.$store.commit("dialog", {
          name: "",
          isShow: val,
        });
      },
    },
  },
};
</script>