<template>
  <div class="container">
    <h1 class="subtitle is-flex is-align-items-center is-justify-content-start">
      <b-icon
        class="is-flex is-align-items-center is-justify-content-center"
        type="is-primary"
        icon="credit-card"
      />
      {{ $t("generatePayments.title") }}
    </h1>
    <div class="block">
      <b-field grouped>
        <b-field
          :type="validatePage && !amount ? 'is-danger' : ''"
          :label="$t('generatePayments.amount')"
          :message="
            validatePage && !amount ? $t('generatePayments.amountRequired') : ''
          "
        >
          <b-input
            class="is-focused is-primary"
            type="number"
            v-model="amount"
          ></b-input>
        </b-field>

        <b-field
          :type="validatePage && !period ? 'is-danger' : ''"
          :label="$t('generatePayments.period')"
          :message="
            validatePage && !period ? $t('generatePayments.periodRequired') : ''
          "
        >
          <b-datepicker
            v-model="period"
            type="month"
            locale="es-ES"
            :placeholder="$t('generatePayments.periodLabel')"
            icon="calendar-today"
            trap-focus
          >
          </b-datepicker>
        </b-field>
      </b-field>
      <b-field expanded>
        <b-button
          type="is-primary"
          :class="isLoadingGeneratePayments ? 'is-loading' : ''"
          v-on:click="generatePaymentsConfirm()"
          >{{ $t("generatePayments.generatePayments") }}</b-button
        >
      </b-field>
    </div>
    <Alert
      :message="messageAlert"
      :title="titleAlert"
      :type="typeAlert"
      :active="isOpenAlert"
      :icon="iconAlert"
      :closeButton="true"
      :confirmButton="isConfirmButton"
    ></Alert>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getPaymentsCount, generatePayments } from "../services/payment";
import Alert from "~/components/Alert.vue";
export default Vue.extend({
  name: "generatePayments",
  components: {
    Alert
  },
  data() {
    return {
      isLoadingGeneratePayments: false,
      isOpenAlert: false,
      isConfirmButton: false,
      messageAlert: "" as any,
      titleAlert: "" as any,
      iconAlert: "",
      typeAlert: "",
      batchId: "",
      validatePage: false,
      amount: 0,
      period: new Date(),
      countLoop: 0
    };
  },
  methods: {
    pollData() {
      var refreshId = setInterval(async () => {
        this.getPaymentsByBatchId(refreshId);
      }, 10000);
    },
    getPaymentsByBatchId: async function(refreshId: any) {
      try {
        var data = {
          batch_id: this.batchId
        };
        const response = await getPaymentsCount(data);
        console.log(response);
        console.log(this.countLoop);
        if (response.count) {
          clearInterval(refreshId);
          this.openAlert("success");
        } else {
          if (this.countLoop === 0) {
            this.pollData();
          }

          if (this.countLoop === 100) {
            this.openAlert("danger");
            clearInterval(refreshId);
          }
          this.countLoop++;
        }
      } catch (error) {
        console.log(error);
      }
    },

    generatePaymentsConfirm: async function() {
      if (!this.amount || !this.period) {
        this.validatePage = true;
        return;
      }
      this.isLoadingGeneratePayments = true;
      this.openAlert("info");
    },
    onConfirm: async function() {
      try {
        this.isOpenAlert = false;
        var periodMonth = new Date(this.period).toLocaleDateString("es-ES", {
          month: "2-digit"
        });

        var formData = {
          amount: this.amount,
          period: periodMonth + "-" + this.period.getFullYear()
        };

        const response = await generatePayments(formData);
        
        if (response) {
          this.batchId = response.batch_id;
          if (this.batchId === "period_exist") {
            this.openAlert("warning");
          } else {
            this.getPaymentsByBatchId(0);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    openAlert: function(type: string) {
      this.typeAlert = `is-${type}`;
      this.messageAlert = this.$i18n.t(`generatePayments.${type}MessageAlert`);
      this.titleAlert = this.$i18n.t(`generatePayments.${type}TitleAlert`);

      switch (type) {
        case "warning":
          this.iconAlert = "alert-outline";
          this.isConfirmButton = false;
          break;
        case "danger":
          this.iconAlert = "alert-circle-outline";
          this.isConfirmButton = false;
          break;
        case "success":
          this.iconAlert = "check-circle-outline";
          this.isConfirmButton = false;
          break;
        case "info":
          this.iconAlert = "information";
          this.isConfirmButton = true;
          break;
        default:
          break;
      }
      this.isOpenAlert = true;
    },
    closeModal() {
      this.isOpenAlert = false;
      this.clear();
    },
    clear() {
      this.validatePage = false;
      this.isOpenAlert = false;
      this.isLoadingGeneratePayments = false;
      this.isConfirmButton = false;
      this.messageAlert = "" as any;
      this.titleAlert = "" as any;
      this.typeAlert = "";
      this.period = new Date();
      this.amount = 0;
      this.countLoop = 0;
    }
  }
});
</script>
