<template>
  <div
    class="is-flex is-align-items-center is-justify-content-center"
    v-if="this.$auth.loggedIn"
  >
    <b-icon icon="account-circle-outline" />
    <span class="userName mr-4 my-0 ml-2 is-relative">{{
      this.$auth.user.name
    }}</span>
    <nuxt-link :to="localePath('logout')" class="has-text-white">
      {{ $t("header.logout") }}</nuxt-link
    >
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Header",
  mounted() {
      this.$nextTick(function () {
    setTimeout(async () => {
    if (!this.$auth.loggedIn) {
      this.$auth.loginWith("keycloak");
    }
      }, 200);
  })
  }
});
</script>

<style scoped>
.userName::after {
  content: "|";
  position: absolute;
  top: 0;
  right: -12px;
  font-size: 19px;
  line-height: 23px;
}
</style>
