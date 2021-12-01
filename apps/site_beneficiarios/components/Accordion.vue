<template>
  <div class="block">
    <b-collapse
      class="card mb-4"
      animation="slide"
      v-for="(collapse, index) of collapses"
      :key="index"
      :open="isOpen == index"
      @open="isOpen = index"
    >
      <template #trigger="props">
        <div class="card-header" role="button">
          <p class="card-header-title has-text-black is-flex is-align-items-center is-justify-content-flex-start">
            <b-icon :icon="icon" /> <span class="pl-2">{{ concatName(collapse) }}</span>
          </p>
          <a class="card-header-icon">
            <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
          </a>
        </div>
      </template>
      <div class="card-content">
        <div class="content">
          <div class="columns is-multiline is-mobile">
            <div class="column is-half">
              <b-field expanded class="is-half">
                <label class="mr-2"><strong>{{ $t("accordion.genderLabel") }}</strong></label>
                <span>{{ collapse.gender ? $t("accordion.female") : $t("accordion.male") }}</span>
              </b-field>
            </div>
            <div class="column is-half">
              <b-field expanded class="is-half">
                <label class="mr-2"><strong>{{ $t("accordion.educationLevelLabel") }}</strong></label>
                <span>{{ collapse.education_level }}</span>
              </b-field>
            </div>
            <div class="column is-half">
              <b-field expanded>
                <label class="mr-2"><strong>{{ $t("accordion.nationalIdNumberLabel") }}</strong></label>
                <span>{{ collapse.national_id_number }}</span>
              </b-field>
            </div>
            <div class="column is-half">
              <b-field expanded>
                <label class="mr-2"><strong>{{ $t("accordion.healthInsuranceLabel") }}</strong></label>
                <span>{{ collapse.health_insurance ? $t("accordion.yes") : $t("accordion.no") }}</span>
              </b-field>
            </div>
            <div class="column is-half">
              <b-field expanded>
                <label class="mr-2"><strong>{{$t("accordion.maritalStatusLabel")}}</strong></label>
                <span>{{ collapse.marital_status }}</span>
              </b-field>
            </div>
            <div class="column is-half">
              <b-field expanded>
                <label class="mr-2"><strong>{{$t("accordion.specialNeedsLabel")}}</strong></label>
                <span>{{ collapse.special_needs }}</span>
              </b-field>
            </div>
            <div class="column is-half">
              <b-field expanded>
                <label class="mr-2"><strong>{{$t("accordion.relationshipLabel")}}</strong></label>
                <span>{{ collapse.relationship }}</span>
              </b-field>
            </div>
            <div class="column is-half">
              <b-field expanded>
                <label class="mr-2"><strong>{{$t("accordion.handicapLabel")}}</strong></label>
                <span>{{ collapse.handicap ? $t("accordion.yes") : $t("accordion.no") }}</span>
              </b-field>
            </div>
            <div class="column is-half">
              <b-field expanded>
                <label class="mr-2"><strong>{{$t("accordion.addIncomeLabel")}}</strong></label>
                <span>{{ collapse.add_income ? $t("accordion.yes") : $t("accordion.no") }}</span>
              </b-field>
            </div>
          </div>
        </div>
      </div>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Accordion",
  data() {
    return {
      isOpen: 0
    };
  },
  props: {
    collapses: {
      type: Array,
      required: true
    },
    icon: {
      type: String
    }
  },
  methods: {
    concatName(item: any) {
      let name = item.first_name;
      if (item.middle_name != "") {
        name += " " + item.middle_name;
      }
      if (item.last_name_1 != "") {
        name += " " + item.last_name_1;
      }
      if (item.last_name_2 != "") {
        name += " " + item.last_name_2;
      }
      return name;
    }
  }
});
</script>
