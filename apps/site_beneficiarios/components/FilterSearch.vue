<template>
  <div class="block is-mobile form-beneficiarios">
    <b-field grouped group-multiline>
      <b-field
        :label="$t('filterSearch.firstNameLabel')"
        class="custom mr-6 mb-4"
      >
        <b-input
          class="is-focused is-primary"
          type="text"
          v-model="formData.first_name"
        ></b-input>
      </b-field>
      <b-field
        :label="$t('filterSearch.middleNameLabel')"
        class="custom mr-6 mb-4"
      >
        <b-input
          class="is-focused is-primary"
          type="text"
          v-model="formData.middle_name"
        ></b-input>
      </b-field>
      <b-field
        :label="$t('filterSearch.lastName1Label')"
        class="custom mr-6 mb-4"
      >
        <b-input
          class="is-focused"
          type="text"
          v-model="formData.last_name_1"
        ></b-input>
      </b-field>
      <b-field
        :label="$t('filterSearch.lastName2Label')"
        class="custom mr-0 mb-4"
      >
        <b-input
          class="is-focused"
          type="text"
          v-model="formData.last_name_2"
        ></b-input>
      </b-field>
      <b-field
        :label="$t('filterSearch.nationalIdNumberLabel')"
        class="custom mr-6 mb-4"
      >
        <b-input
          type="text"
          class="is-focused"
          v-model="formData.national_id_number"
        ></b-input>
      </b-field>
      <b-field
        :label="$t('filterSearch.accountNumberLabel')"
        class="custom mr-6 mb-4"
      >
        <b-input
          type="text"
          class="is-focused"
          v-model="formData.account_number"
        ></b-input>
      </b-field>
    </b-field>
    <b-button
      type="is-primary"
      class="mr-2"
      :class="isLoadingSearch ? 'is-loading' : ''"
      v-on:click="$parent.submitSearch(formData)"
      >{{ $t("filterSearch.searchButton") }}</b-button
    >
    <b-button
      type="is-danger"
      :class="isLoadingClear ? 'is-loading' : ''"
      outlined
      v-on:click="clearSearch()"
      >{{ $t("filterSearch.clearButton") }}</b-button
    >
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "FilterSearch",
  props: {
    isLoadingSearch: {
      type: Boolean
    },
    isLoadingClear: {
      type: Boolean
    }
  },
  data() {
    return {
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
  methods:{
    clearSearch() {
      this.formData= {
        first_name: "",
        middle_name: "",
        last_name_1: "",
        last_name_2: "",
        national_id_number: "",
        account_number: ""
      };
    	this.$emit('clearSearch');
    }
  }
});
</script>
