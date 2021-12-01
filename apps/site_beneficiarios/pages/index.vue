<template>
  <section class="section">
    <DashboardSection
      v-for="(element, index) of elementsDashboard"
      :key="index"
      :elements="element.elements"
      :title="element.title"
      :roles="element.roles"
    >
    </DashboardSection>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import DashboardSection from "~/components/DashboardSection.vue";

export default Vue.extend({
  name: "Index",
  components: {
    DashboardSection
  },
  data() {
    return {
      elementsDashboard: [
        {
          title: "Administrador",
          roles: ["administrador"],
          elements: [
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
            }
          ]
        },
        {
          title: "Aplicaciones",
          roles: ["administrador", "contribuidor", "colaborador"],
          elements: [
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
          ]
        }
      ]
    };
  }
});
</script>
