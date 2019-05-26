<template>
  <div>
    <section class="grey lighten-2">
      <v-container>
        <breadcrumbs class="pl-1" :items="breadcrumbs"/>
        <h1 class="mb-4">{{title}}</h1>
      </v-container>
    </section>
    <section>
      <v-container class="py-5">
        <v-layout row wrap>
          <v-flex xs4 class="pr-5">
            <nav-menu :menuItems="menuItems"></nav-menu>
          </v-flex>
          <v-flex xs8 v-html="content"></v-flex>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
import Breadcrumbs from "~/components/Breadcrumbs";
import NavMenu from "~/components/NavMenu";

export default {
  components: {
    Breadcrumbs,
    NavMenu
  },
  data() {
    return {
      title: "О компании",
      menuItems: [
        // {
        //   text: "О компании",
        //   to: "/about"
        // },
        {
          text: "Сертификаты",
          to: "/about/certificate"
        },
        {
          text: "Доставка",
          to: "/about/delivery"
        }
      ],
      content: `
        <p>Молодая, быстро развивающаяся, амбициозная компания! Мы занимаемся поставками электрооборудования для вас, наших клиентов. Благодаря прямым контрактам мы можем предложить выгодные условия и быстрые сроки поставки. Так же, мы предлагаем прямые поставки оборудования из Европы. Специалисты нашей компании помогут вам создать и смонтировать проект любой сложности, будь то по электрике или кабельному обогреву. Все для вашей экономии и удобства. </p>
        <h3>AZB field of activity</h3>
        <p>Personal information provided on the website and online credit card transactions are transmitted through a secure server. We are committed to handling your personal information with high standards of information security. We take appropriate physical, electronic, and administrative steps to maintain the security and accuracy of personally identifiable information we collect, including limiting the number of people who have physical access to our database servers, as well as employing electronic security systems and password protections that guard against unauthorized access. </p>
        <h3>AZB Guaranties</h3>
        <p>Personal information provided on the website and online credit card transactions are transmitted through a secure server. We are committed to handling your personal information with high standards of information security. We take appropriate physical, electronic, and administrative steps to maintain the security and accuracy of personally identifiable information we collect, including limiting the number of people who have physical access to our database servers, as well as employing electronic security systems and password protections that guard against unauthorized access. </p>

     `
    };
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
  }
};
</script>

<style>
</style>
