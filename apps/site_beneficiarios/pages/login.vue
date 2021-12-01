<template>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Login extends Vue {


    private created(): void {
    this.$auth.loginWith("keycloak");
  }
}
</script>

<style lang="scss">
</style>

