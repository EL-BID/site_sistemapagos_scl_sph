<template>
  <div>
    <b-navbar class="is-primary" :mobile-burger="false">
      <template #brand>
        <Menu></Menu>
        <b-navbar-item tag="router-link" :to="localePath('/')">
          <Logo></Logo>
        </b-navbar-item>
      </template>

      <template #end>
        <b-navbar-item tag="div">
          <Header></Header>
        </b-navbar-item>
      </template>
    </b-navbar>
    <section class="main-content mt-5 mx-0 mb-0">
      <div class="container is-10">
        <Nuxt />
      </div>
    </section>
    <footer class="footer is-size-6">
      <div class="content has-text-centered">
        <p>
          {{$t("footer.text")}}
        </p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Header from "~/components/Header.vue";
import Logo from "~/components/Logo.vue";
import Menu from "~/components/Menu.vue";
export default Vue.extend({
  name: "Default",
  components: {
    Header,
    Logo,
    Menu
  }
});
</script>
