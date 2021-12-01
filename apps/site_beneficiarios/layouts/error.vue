<template>
  <section class="section">
    <h2 class="title is-3 has-text-grey">
      "{{ $t("error.message") }}
      <b-icon icon="rocket" size="is-large" />"
    </h2>
    <h3 v-if="this.$auth.user" class="subtitle is-6 has-text-grey">
      {{ this.$auth.user.name }}
    </h3>
  </section>
</template>

<script>
export default {
  props: ["error"],
  layout: "error" // you can set a custom layout for the error page
};
</script>
