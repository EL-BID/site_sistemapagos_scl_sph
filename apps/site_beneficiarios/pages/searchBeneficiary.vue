<template>
  <div class="container beneficiarios">
    <h1 class="subtitle is-flex is-align-items-center is-justify-content-start">
      <b-icon
        class="is-flex is-align-items-center is-justify-content-center"
        type="is-primary"
        icon="account-search"
      />
      {{ $t("searchBeneficiary.title") }}
    </h1>
    <FilterSearch
      :isLoadingClear="isLoadingClear"
      :isLoadingSearch="isLoadingSearch"
      @clearSearch="clearSearch"
    ></FilterSearch>

    <div class="block" v-if="showGrid && resultSearch.length">
      <h2>
        <strong>{{ $t("searchBeneficiary.resultTitle") }}</strong>
      </h2>

      <Grid
        :columns="columns"
        :elements="resultSearch"
        :paginated="false"
        :backendPagination="true"
        :total="totalRecords"
        :loading="isLoadingGrid"
        @onPageChange="onPageChange"
      ></Grid>
    </div>
    <div class="block" v-if="showGrid && resultSearch.length === 0">
      <h2>
        <strong>{{ $t("searchBeneficiary.noRecords") }}</strong>
      </h2>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FilterSearch from "~/components/FilterSearch.vue";
import Grid from "~/components/Grid.vue";
import {
  getBeneficiariesCount,
  getBeneficiaries
} from "../services/beneficiary";
export default Vue.extend({
  name: "SearchBeneficiary",
  components: {
    Grid,
    FilterSearch
  },
  data() {
    return {
      resultSearch: [],
      isLoadingClear: false,
      isLoadingSearch: false,
      isLoadingGrid: false,
      filter: {} as any,
      showGrid: false,
      totalRecords: 0,
      columns: [
        { field: "alert", label: " ", type: "alert" },
        {
          field: "national_id_type",
          label: this.$i18n.t("searchBeneficiary.nationalIdType")
        },
        {
          field: "national_id_number",
          label: this.$i18n.t("searchBeneficiary.nationalIdNumber"),
          type: "link",
          param: "id",
          to: "detailsBeneficiary"
        },
        {
          field: "first_name",
          label: this.$i18n.t("searchBeneficiary.firstName")
        },
        {
          field: "middle_name",
          label: this.$i18n.t("searchBeneficiary.middleName")
        },
        {
          field: "last_name_1",
          label: this.$i18n.t("searchBeneficiary.lastName1")
        },
        {
          field: "last_name_2",
          label: this.$i18n.t("searchBeneficiary.lastName2")
        },
        {
          field: "birthday",
          label: this.$i18n.t("searchBeneficiary.birthday"),
          type: "date"
        },
        {
          field: "bank_code",
          label: this.$i18n.t("searchBeneficiary.bankCode")
        },
        {
          field: "account_number",
          label: this.$i18n.t("searchBeneficiary.accountNumber")
        },
        {
          field: "instrument",
          label: this.$i18n.t("searchBeneficiary.instrument")
        },
        { field: "status", label: this.$i18n.t("searchBeneficiary.status") },
        {
          field: "created",
          label: this.$i18n.t("searchBeneficiary.created"),
          type: "date"
        }
      ],
      formData: {
        first_name: "",
        middle_name: "",
        last_name_1: "",
        last_name_2: "",
        national_id_number: "",
        account_number: ""
      }
    };
  },
  methods: {
    submitSearch: async function(formData: any) {
      try {
        this.totalRecords = 0;
        this.formData = formData;
        this.isLoadingSearch = true;
        this.resultSearch = [];
        this.showGrid = false;

        this.createFilter(false, 0);
        let result = await getBeneficiaries(this.filter);
        if (result) {
          this.showGrid = true;
          this.resultSearch = JSON.parse(JSON.stringify(result));
          this.isLoadingSearch = false;
        }

        this.createFilter(false, 0);
        let totalBeneficiaries = await getBeneficiariesCount(this.filter);
        if (totalBeneficiaries) {
          this.totalRecords = Number(totalBeneficiaries.count);
        }
      } catch (error) {
        console.log(error);
        this.isLoadingSearch = false;
      }
    },
    clearSearch() {
      this.isLoadingClear = true;
      this.formData = {
        first_name: "",
        middle_name: "",
        last_name_1: "",
        last_name_2: "",
        national_id_number: "",
        account_number: ""
      };
      this.resultSearch = [];
      this.showGrid = false;
      this.isLoadingClear = false;
    },
    onPageChange: async function(currentPage: any) {
      try {
        this.isLoadingGrid = true;
        this.createFilter(false, currentPage);
        let result = await getBeneficiaries(this.filter);
        if (result) {
          this.resultSearch = JSON.parse(JSON.stringify(result));
        }
        this.isLoadingGrid = false;
      } catch (error) {
        console.log(error);
      }
    },
    createFilter(totalRecords: boolean, pageNumber: any) {
      if (totalRecords) {
        let item = {} as any;
        for (const [key, value] of Object.entries(this.formData)) {
          if (value !== "") {
            item[key] = { ilike: "%" + value + "%" };
          }
        }
        this.filter = JSON.stringify(item);
      } else {
        var perPage = 100;
        let offset = 0;
        if (pageNumber > 1) {
          offset = (pageNumber - 1) * perPage;
        }
        var data = {
          limit: perPage,
          offset: offset,
          firstName: this.formData.first_name,
          middleName: this.formData.middle_name,
          lastName1: this.formData.last_name_1,
          lastName2: this.formData.last_name_2,
          nationalIdNumber: this.formData.national_id_number,
          accountNumber: this.formData.account_number
        };
        this.filter = data;
      }
    }
  }
});
</script>
