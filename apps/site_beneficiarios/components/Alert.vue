<template>
  <section>
    <b-modal :active.sync="active" has-modal-card :can-cancel="false">
      <div class="card" style="width: auto">
        <header class="card-header" :class="type">
          <h2 class="card-header-title has-text-white">{{ title }}</h2>
        </header>
        <section class="modal-card-body">
          <div class="media">
            <div class="media-left">
              <b-icon
                class="file-icon"
                :icon="icon"
                size="is-large"
                :type="type"
              ></b-icon>
            </div>
            <div class="media-content">
              <div>
                <div class="block message-alert" v-if="messageArray">
                  <div
                    v-for="(messageItem,index) of messageArray"
                    :key="index"
                  >
                    {{ messageItem.description }}
                  </div>
                </div>

                <div class="block message-alert" v-if="!messageArray">
                  {{ message }}
                </div>
                <b-progress
                  v-if="progressBar"
                  type="is-warning"
                  :value="valueProgressBar"
                  show-value
                  size="is-large"
                  format="percent"
                ></b-progress>
              </div>
            </div>
          </div>
          <div class="field is-grouped is-grouped-centered">
            <button
              class="button mr-2"
              @click="$parent.closeModal()"
              v-if="closeButton"
            >
              {{ $t("alert.closeButton") }}
            </button>
            <button
              class="button"
              :class="type"
              v-if="confirmButton"
              @click="$parent.onConfirm()"
            >
              {{ $t("alert.confirmButton") }}
            </button>
          </div>
        </section>
      </div>
    </b-modal>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "Alert",
  data() {
    return {
      isEmpty: false
    };
  },
  props: {
    type: {
      type: String
    },
    message: {
      type: String
    },
    messageArray: {
      type: Array
    },
    title: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    confirmButton: {
      type: Boolean
    },
    closeButton: {
      type: Boolean
    },
    progressBar: {
      type: Boolean
    },
    valueProgressBar: {
      type: Number
    }
  }
});
</script>
