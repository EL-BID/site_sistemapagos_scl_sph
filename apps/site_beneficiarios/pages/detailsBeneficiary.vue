<template>
  <div class="container">
    <h1 class="subtitle is-flex is-align-items-center is-justify-content-start">
      <b-icon
        class="is-flex is-align-items-center is-justify-content-center"
        type="is-primary"
        icon="account-details-outline"
      />
      {{ $t("detailsBeneficiary.title") }}
    </h1>
    <div class="block beneficiary">
      <div v-if="listAlert">
        <div v-for="(error, index) in this.listAlert" :key="index">
          <div
            class="is-flex is-align-items-center is-justify-content-flex-start"
            v-if="error.type === 'danger'"
          >
            <b-icon
              class="file-icon"
              icon="alert-circle-outline"
              type="is-danger"
            />
            <span class="has-text-danger">{{ error.description }}</span>
          </div>
          <div
            class="is-flex is-align-items-center is-justify-content-flex-start"
            v-if="error.type === 'warning'"
          >
            <b-icon class="file-icon" icon="alert-outline" type="is-warning" />
            <span>{{ error.description }}</span>
          </div>
        </div>
      </div>
      <div class="block" v-if="this.beneficiary">
        <div
          class="is-flex is-align-items-center is-justify-content-space-between"
        >
          <h2
            class="is-size-5 mx-0 my-4 has-text-primary-dark has-text-weight-bold"
          >
            {{ $t("detailsBeneficiary.beneficiaryTitle") }}
          </h2>
          <b-button
            type="is-primary"
            v-if="userRoles.some(role => rolesStatus.indexOf(role) >= 0)"
            v-on:click="changeStatusBeneficiaryConfirm()"
            >{{
              beneficiary.status == 1
                ? $t("detailsBeneficiary.inactivate")
                : $t("detailsBeneficiary.activate")
            }}
          </b-button>
        </div>
        <div class="panel">
          <p class="panel-heading">
            <b-icon icon="account-box-outline" /> {{ concatName }}
          </p>
          <div class="panel-block p-5">
            <div class="columns is-multiline is-mobile">
              <div class="column is-half">
                <b-field expanded class="is-half">
                  <label class="mr-2"
                    ><strong>{{ $t("detailsBeneficiary.createdLabel") }}</strong></label
                  >
                  <span>{{
                    beneficiary.created
                      ? dateFormatter(beneficiary.created)
                      : ""
                  }}</span>
                </b-field>
              </div>
              <div class="column is-half">
                <b-field expanded class="is-half">
                  <label class="mr-2"
                    ><strong>{{ $t("detailsBeneficiary.ageLabel") }}</strong></label
                  >
                  <span>{{ calculateAge }}</span>
                </b-field>
              </div>
              <div class="column is-half">
                <b-field expanded>
                  <label class="mr-2"
                    ><strong>{{ $t("detailsBeneficiary.updatedLabel") }}</strong></label
                  >
                  <span>{{
                    beneficiary.updated
                      ? dateFormatter(beneficiary.updated)
                      : ""
                  }}</span>
                </b-field>
              </div>
              <div class="column is-half">
                <b-field expanded>
                  <label class="mr-2"
                    ><strong>{{ $t("detailsBeneficiary.bankCodeLabel") }}</strong></label
                  >
                  <span>{{ beneficiary.bank_code }}</span>
                </b-field>
              </div>
              <div class="column is-half">
                <b-field expanded>
                  <label class="mr-2"
                    ><strong>{{
                      $t("detailsBeneficiary.nationalIdNumberLabel")
                    }}</strong></label
                  >
                  <span>{{ beneficiary.national_id_number }}</span>
                </b-field>
              </div>
              <div class="column is-half">
                <b-field expanded>
                  <label class="mr-2"
                    ><strong>{{
                      $t("detailsBeneficiary.accountNumberLabel")
                    }}</strong></label
                  >
                  <span>{{ beneficiary.account_number }}</span>
                </b-field>
              </div>
              <div class="column is-half">
                <b-field expanded>
                  <label class="mr-2"
                    ><strong>{{
                      $t("detailsBeneficiary.nationalIdTypeLabel")
                    }}</strong></label
                  >
                  <span>{{ beneficiary.national_id_type }}</span>
                </b-field>
              </div>
              <div class="column is-half">
                <b-field expanded>
                  <label class="mr-2"
                    ><strong>{{
                      $t("detailsBeneficiary.instrumentLabel")
                    }}</strong></label
                  >
                  <span>{{ beneficiary.instrument }}</span>
                </b-field>
              </div>
              <div class="column is-half">
                <b-field expanded>
                  <label class="mr-2"
                    ><strong>{{ $t("detailsBeneficiary.birthdayLabel") }}</strong></label
                  >
                  <span>{{
                    beneficiary.birthday
                      ? dateFormatter(beneficiary.birthday)
                      : ""
                  }}</span>
                </b-field>
              </div>
              <div class="column is-half">
                <b-field expanded>
                  <label class="mr-2"
                    ><strong>{{ $t("detailsBeneficiary.statusLabel") }}</strong></label
                  >
                  <span>{{
                    beneficiary.status === 1
                      ? $t("detailsBeneficiary.active")
                      : $t("detailsBeneficiary.inactive")
                  }}</span>
                </b-field>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="block" v-if="this.familyGroupMember.length">
        <h2
          class="is-size-5 mx-0 my-4 has-text-primary-dark has-text-weight-bold"
        >
          {{ $t("detailsBeneficiary.familyGroupMemberTitle") }}
        </h2>
        <Accordion
          :collapses="familyGroupMember"
          icon="account-details-outline"
        ></Accordion>
      </div>

      <div class="field is-grouped is-grouped-centered">
        <p class="control" expanded>
          <NuxtLink
            :to="localePath('searchBeneficiary')"
            class="button is-primary"
            type="is-primary"
          >
            <strong>{{ $t("detailsBeneficiary.backBeneficiaries") }}</strong></NuxtLink
          >
        </p>
      </div>
    </div>
    <Alert
      :message="messageAlert"
      :title="titleAlert"
      type="is-danger"
      :active="isOpenAlert"
      icon="alert-circle-outline"
      :confirmButton="true"
      :closeButton="true"
    ></Alert>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import {
  getBeneficiariesById,
  updateBeneficiariesById
} from "../services/beneficiary";
import { Beneficiary, FamilyGroupMembersEntity} from "~/types/beneficiary";
import Accordion from "~/components/Accordion.vue";
export default Vue.extend({
  name: "DetailsBeneficiary",
  components: {
    Accordion
  },
  data() {
    return {
      id: null as any,
      beneficiary: {} as (Beneficiary | undefined),
      listAlert: [] as any,
      familyGroupMember: [] as (FamilyGroupMembersEntity[] | null),
      messageAlert: "" as any,
      titleAlert: "" as any,
      isOpenAlert: false,
      status: 0,
      rolesStatus: ["administrador", "contribuidor"],
      userRoles: []
    };
  },
  mounted: async function() {
    this.getBeneficiary();
  },
  created() {
    this.userRoles = this.$auth?.user.realm_access.roles;
  },
  computed: {
    calculateAge() {
      var today = new Date();
      var birthday = new Date((this as any).beneficiary.birthday);
      var age = today.getFullYear() - birthday.getFullYear();
      var m = today.getMonth() - birthday.getMonth();

      if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
      }
      return age;
    },
    concatName() {
      const beneficiary = (this as any).beneficiary;
      let name = beneficiary.first_name;
      if (beneficiary.middle_name != "") {
        name += " " + beneficiary.middle_name;
      }
      if (beneficiary.last_name_1 != "") {
        name += " " + beneficiary.last_name_1;
      }
      if (beneficiary.last_name_2 != "") {
        name += " " + beneficiary.last_name_2;
      }
      return name;
    }
  },
  methods: {
    changeStatusBeneficiaryConfirm() {
      if (this.beneficiary?.status === 1) {
        this.messageAlert = this.$i18n.t("detailsBeneficiary.messageAlert", {
          status: this.$i18n.t("detailsBeneficiary.inactivate")
        });
        this.titleAlert = this.$i18n.t("detailsBeneficiary.titleAlert", {
          status: this.$i18n.t("detailsBeneficiary.inactivate")
        });
        this.status = 0;
      } else {
        this.messageAlert = this.$i18n.t("detailsBeneficiary.messageAlert", {
          status: this.$i18n.t("detailsBeneficiary.activate")
        });
        this.titleAlert = this.$i18n.t("detailsBeneficiary.titleAlert", {
          status: this.$i18n.t("detailsBeneficiary.activate")
        });
        this.status = 1;
      }
      this.isOpenAlert = true;
    },
    getBeneficiary: async function() {
      try {
        const filter = {
          include: [
            {
              relation: "familyGroupMembers",
              fields: {
                ID: true,
                last_name_1: true,
                last_name_2: true,
                first_name: true,
                middle_name: true,
                gender: true,
                national_id_type: true,
                national_id_number: true,
                marital_status: true,
                relationship: true,
                add_income: true,
                education_level: true,
                health_insurance: true,
                special_needs: true,
                handicap: true,
                beneficiary: true
              }
            }
          ]
        };
        this.id = this.$route.query.id;
        this.beneficiary = await getBeneficiariesById(this.id, filter);
        if (this.beneficiary) {
          if (this.beneficiary.alert) {
            this.listAlert = JSON.parse(this.beneficiary.alert);
          }
          if (this.beneficiary.familyGroupMembers) {
            this.familyGroupMember = this.beneficiary.familyGroupMembers;
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    onConfirm: async function() {
      try {
        const data = {
          status: this.status
        };
        await updateBeneficiariesById(this.id, data);
        this.getBeneficiary();
        this.isOpenAlert = false;
      } catch (error) {
        console.log(error);
      }
    },
    dateFormatter(date: any) {
      return new Date(date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    },
    closeModal() {
      this.isOpenAlert = false;
    }
  }
});
</script>
