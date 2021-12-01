<template>
  <section>
    <a
      class="height-100 is-flex is-align-items-center is-justify-content-center ml-4 pr-4"
      @click="open = true"
    >
      <b-icon
        type="is-white"
        size="is-medium"
        icon="dots-vertical-circle-outline"
    /></a>
    <b-sidebar
      type="is-primary-dark"
      :fullheight="fullheight"
      :fullwidth="fullwidth"
      :overlay="overlay"
      :right="right"
      v-model="open"
    >
      <div @click="open = false" class="p-1">
        <b-menu>
          <a
            class="height-100 is-flex is-align-items-center is-justify-content-flex-start ml-2 mt-2 mb-4"
            @click="open = false"
          >
            <b-icon type="is-white" size="is-medium" icon="close-circle-outline"
          /></a>
          <b-menu-list>
            <b-menu-item
              v-for="(item, index) of menuItems"
              :key="'E' + index"
              :label="item.name"
              :icon="item.icon"
              :href="item.to"
              target="_blank"
              :class="
                userRoles.some(role => item.roles.indexOf(role) >= 0) &&
                !item.linkInternal
                  ? ''
                  : 'is-hidden'
              "
            >
            </b-menu-item>
            <b-menu-item
              v-for="(item, index) of menuItems"
              :key="'I' + index"
              :label="item.name"
              :icon="item.icon"
              :to="localePath(item.to)"
              tag="router-link"
              :class="
                userRoles.some(role => item.roles.indexOf(role) >= 0) &&
                item.linkInternal
                  ? ''
                  : 'is-hidden'
              "
            >
            </b-menu-item>
          </b-menu-list>
        </b-menu>
      </div>
    </b-sidebar>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Menu",
  data() {
    return {
      overlay: true,
      fullheight: true,
      fullwidth: false,
      right: false,
      open: false,
      menuItems: [
        {
          name: this.$i18n.t("menu.manageIdentities"),
          icon: "account-network",
          to: "https://site.drakecore.com/auth/",
          roles: ["administrador"],
          linkInternal: false
        },
        {
          name: this.$i18n.t("menu.manageDB"),
          icon: "database-cog",
          to: "https://da.drakecore.com/",
          roles: ["administrador"],
          linkInternal: false
        },
        {
          name: this.$i18n.t("menu.searchTransactionLog"),
          icon: "folder-search",
          to: "https://bi.drakecore.com/superset/welcome/",
          roles: ["administrador"],
          linkInternal: false
        },
        {
          name: this.$i18n.t("menu.generatePayments"),
          icon: "credit-card",
          to: "generatePayments",
          roles: ["administrador"],
          linkInternal: true
        },
        {
          name: this.$i18n.t("menu.searchBeneficiary"),
          icon: "account-search",
          to: "searchBeneficiary",
          roles: ["administrador", "contribuidor", "colaborador"],
          linkInternal: true
        },
        {
          name: this.$i18n.t("menu.importFile"),
          icon: "import",
          to: "importFile",
          roles: ["administrador", "contribuidor"],
          linkInternal: true
        },
        {
          name: this.$i18n.t("menu.reportToBanks"),
          icon: "export",
          to: "reportToBanks",
          roles: ["administrador", "contribuidor", "colaborador"],
          linkInternal: true
        },
        {
          name: this.$i18n.t("menu.viewReports"),
          icon: "lightbulb",
          to: "https://bi.drakecore.com/superset/welcome/",
          roles: ["administrador", "contribuidor", "colaborador"],
          linkInternal: false
        }
      ],
      userRoles: []
    };
  },
  created() {
    this.userRoles = this.$auth?.user.realm_access.roles;
  }
});
</script>
