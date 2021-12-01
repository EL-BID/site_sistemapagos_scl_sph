<template>
  <section class="dataGrid">
    <b-table
      :loading="loading"
      class="is-striped is-bordered"
      :data="isEmpty ? [] : elements"
      :bordered="true"
      :striped="true"
      :hoverable="true"
      :scrollable="true"
      :per-page="100"
      :paginated="true"
      pagination-order="is-centered"
      :backend-pagination="backendPagination"
      :total="total"
      @page-change="onPageChange"
    >
      <b-table-column
        v-for="(column, index) of columns"
        :key="index"
        :field="column.field"
        :label="column.label"
        :sortable="false"
        v-slot="props"
      >
        <template v-if="!column.type">
          {{ props.row[column.field] }}
        </template>
        <template v-if="column.type === 'alert' && props.row[column.field]">
          <a @click="openModal(props.row[column.field])">
            <div v-if="errorInitial(props.row[column.field]) === 'danger'">
              <b-icon
                class="file-icon"
                icon="alert-circle-outline"
                type="is-danger"
              />
            </div>
            <div v-if="errorInitial(props.row[column.field]) === 'warning'">
              <b-icon
                class="file-icon"
                icon="alert-outline"
                type="is-warning"
              />
            </div>
          </a>
        </template>
        <template v-if="column.type === 'link'">
          <NuxtLink
            :to="
              localePath(column.to) +
                '?' +
                column.param +
                '=' +
                props.row[column.param]
            "
          >
            <u> {{ props.row[column.field] }} </u>
          </NuxtLink>
        </template>
        <template v-if="column.type === 'date'">
          {{
            new Date(props.row[column.field]).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit"
            })
          }}
        </template>
      </b-table-column>

      <template #empty>
        <div class="has-text-centered">{{ $t("grid.noRecords") }}</div>
      </template>
    </b-table>
    <Alert
      :messageArray="messageArray"
      :title="title"
      :type="type"
      :active="isOpen"
      :icon="icon"
      :closeButton="true"
    ></Alert>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import Alert from "~/components/Alert.vue";

export default Vue.extend({
  name: "Grid",
  components: {
    Alert
  },
  data() {
    return {
      isEmpty: false,
      message: "",
      title: "",
      isOpen: false,
      type: "",
      icon: "",
      messageArray: [] as any
    };
  },
  props: {
    columns: {
      type: Array,
      required: true
    },
    elements: {
      type: Array,
      required: true
    },
    backendPagination: {
      type: Boolean,
      required: true
    },
    total: {
      type: Number
    },
    loading: {
      type: Boolean
    }
  },
  methods: {
    openModal(row: any) {
      this.messageArray = JSON.parse(row);
      this.title = this.messageArray[0].title;
      this.isOpen = true;
      if (this.messageArray[0].type === "danger") {
        this.type = "is-danger";
        this.icon = "alert-circle-outline";
      }
      if (this.messageArray[0].type === "warning") {
        this.type = "is-warning";
        this.icon = "alert-outline";
      }
    },
    closeModal() {
      this.isOpen = false;
    },
    errorInitial(row: any) {
      const alerts = JSON.parse(row);
      return alerts[0].type;
    },
    onPageChange(page: any) {
      this.$emit("onPageChange", page);
    }
  }
});
</script>
