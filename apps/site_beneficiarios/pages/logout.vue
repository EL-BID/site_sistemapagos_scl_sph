<template> </template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Logout extends Vue {
  private created(): void {
    this.$auth.logout();
  }
}
</script>

<style lang="scss"></style>
