<template>
  <section
    class="block dashboardSection"
    v-if="userRoles.some(role => roles.indexOf(role) >= 0)"
  >
    <h2 class="is-size-6 has-text-black has-text-weight-medium">
      {{ title }}
    </h2>
    <div class="sectionContent">
      <ul
        class="p-0 is-flex is-align-items-flex-start is-justify-content-flex-start"
      >
        <li v-for="(element, index) of elements" :key="index">
          <a
            class="link is-flex is-flex-direction-column is-align-items-center is-justify-content-center my-4 mx-6"
            :href="element.to"
            exact-active-class="is-active"
            v-if="!element.linkInternal"
            target="_blank"
          >
            <b-icon
              custom-class="elementIcon"
              class="has-text-centered
            has-text-grey"
              :icon="element.icon"
            >
            </b-icon>
            <span class="has-text-centered has-text-grey">{{
              element.name
            }}</span>
          </a>
          <div>
            <NuxtLink
              class="link is-flex is-flex-direction-column is-align-items-center is-justify-content-center my-4 mx-6"
              :to="localePath(element.to)"
              exact-active-class="is-active"
              v-if="element.linkInternal && userRoles.some(role => element.roles.indexOf(role) >= 0)"
            >
              <b-icon
                custom-class="elementIcon"
                class="has-text-centered
            has-text-grey"
                :icon="element.icon"
              >
              </b-icon>
              <span class="has-text-centered has-text-grey">{{
                element.name
              }}</span>
            </NuxtLink>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "DashboardSection",
  data() {
    return {
      userRoles: []
    };
  },
  props: {
    title: {
      type: String,
      required: true
    },
    elements: {
      type: Array,
      required: true
    },
    roles: {
      type: Array
    }
  },
  created() {
    this.userRoles = this.$auth?.user.realm_access.roles;
  }
});
</script>
