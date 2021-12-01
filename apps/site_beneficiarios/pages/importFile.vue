<template>
  <div class="container">
    <h1 class="subtitle is-flex is-align-items-center is-justify-content-start">
      <b-icon
        class="is-flex is-align-items-center is-justify-content-center"
        type="is-primary"
        icon="import"
      />
      {{ $t("importFile.title") }}
    </h1>
    <div class="block" v-if="!itemsFile.length">
      <b-field grouped>
        <b-field
          type="is-danger"
          :message="
            validatePage && !typeFile ? $t('importFile.typeFileRequired') : ''
          "
        >
          <b-dropdown aria-role="list" ref="dropdown" v-model="typeFile">
            <button class="button" type="button" slot="trigger">
              <span v-if="!typeFile">{{ $t("importFile.typeFile") }}</span>
              <span v-if="typeFile">{{
                typeFileItems.filter(value => value.id == typeFile)[0].name
              }}</span>
              <b-icon icon="chevron-down"></b-icon>
            </button>
            <b-dropdown-item
              v-for="(option, index) in typeFileItems"
              :value="option.id"
              :key="index"
              aria-role="listitem"
              >{{ option.name }}</b-dropdown-item
            >
          </b-dropdown>
        </b-field>

        <b-field
          expanded
          type="is-danger"
          :message="
            validatePage && this.file.size === undefined
              ? $t('importFile.fileRequired')
              : ''
          "
        >
          <b-upload v-model="file" class="file-label" accept=".csv">
            <span class="file-cta">
              <b-icon class="file-icon" icon="upload"></b-icon>
              <span class="file-label">{{ $t("importFile.selectFile") }}</span>
            </span>
            <span class="file-name">
              {{ file.name }}
            </span>
          </b-upload>
        </b-field>

        <b-field expanded>
          <b-button
            type="is-primary"
            :class="isLoadingLoadFiles ? 'is-loading' : ''"
            v-on:click="getPreviewFile()"
            >{{ $t("importFile.previewFiles") }}</b-button
          >
        </b-field>
      </b-field>
    </div>
    <div class="block" v-if="showGrid && !itemsFile.length">
      <h2>
        <strong>{{ $t("importFile.noRecords") }}</strong>
      </h2>
    </div>
    <div class="block" v-if="itemsFile.length">
      <b-field grouped>
        <b-field expanded>
          <label
            ><strong> {{ $t("importFile.typeFileLabel") }}</strong></label
          >
          <span>{{ typeFile }}</span>
        </b-field>
        <b-field expanded>
          <label
            ><strong>{{ $t("importFile.nameFileLabel") }}</strong></label
          >
          <span>{{ file.name }}</span>
        </b-field>
        <b-field expanded>
          <label
            ><strong>{{ $t("importFile.totalRecordsLabel") }}</strong></label
          >
          <span>{{ totalRecords }}</span>
        </b-field>
      </b-field>
      <section>
        <Grid
          :columns="columns"
          :elements="itemsFile"
          :backendPagination="false"
        ></Grid>
      </section>

      <div class="field is-grouped is-grouped-centered">
        <p class="control" expanded>
          <b-button
            type="is-success"
            :class="isLoadingConfirmButton ? 'is-loading' : ''"
            v-on:click="uploadFile()"
            >{{ $t("importFile.confirmButton") }}</b-button
          >
        </p>
        <p class="control">
          <b-button
            v-if="isCancelButton"
            type="is-danger"
            outlined
            v-on:click="clearFile()"
            >{{ $t("importFile.cancelButton") }}</b-button
          >
        </p>
      </div>
    </div>

    <div class="block" v-if="listErrors.length && idStatusFile">
      <article class="panel list-errors">
        <p
          class="panel-heading is-flex is-align-items-center is-justify-content-flex-start has-text-danger"
        >
          <b-icon
            class="file-icon"
            icon="alert-circle-outline"
            type="is-danger"
          />
          <span class="subtitle is-6 has-text-danger">{{
            $t("importFile.alertTitle")
          }}</span>
        </p>
        <div class="notification is-white">
          <p v-for="(error, index) in listErrors" :key="index">
            {{ error.description }}
          </p>
        </div>
      </article>
      <p class="control">
        <b-button
          v-if="isCancelButtonAlert"
          type="is-danger"
          outlined
          v-on:click="clearFile()"
          >{{ $t("importFile.cancelButton") }}</b-button
        >
      </p>
    </div>

    <Alert
      :message="messageAlert"
      :title="titleAlert"
      :type="typeAlert"
      :active="isOpenAlert"
      :icon="iconAlert"
      :progressBar="isProgressAlert"
      :valueProgressBar="valueProgressBar"
      :closeButton="isCloseButtonAlert"
    ></Alert>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Grid from "~/components/Grid.vue";
import { postFile, getFileById } from "../services/file";
import { StatusFile } from "~/types/statusFile";
import Alert from "~/components/Alert.vue";
export default Vue.extend({
  name: "ImportFile",
  components: {
    Grid,
    Alert
  },
  data() {
    return {
      validateFile: false,
      isLoadingConfirmButton: false,
      isLoadingLoadFiles: false,
      isOpenAlert: false,
      isProgressAlert: false,
      isCloseButtonAlert: false,
      isCancelButton: true,
      showGrid: false,
      validatePage: false,
      isCancelButtonAlert: false,
      itemsFile: "",
      file: [] as any,
      columns: [] as any,
      typeFile: null as any,
      responseStatusFile: {} as StatusFile | undefined,
      listErrors: [] as any,
      getFile: [] as any,
      iconAlert: "",
      titleAlert: "" as any,
      typeAlert: "" as string,
      messageAlert: "" as any,
      valueProgressBar: 0 as any,
      totalRecords: 0,
      limitItemsFile: 10000,
      statusFile: "" as any,
      idStatusFile: "" as string | (string | null)[],
      typeFileItems: [
        {
          name: this.$i18n.t("importFile.typeFileBDI"),
          id: "BDI"
        },
        {
          name: this.$i18n.t("importFile.typeFileBDA"),
          id: "BDA-SB"
        },
        {
          name: this.$i18n.t("importFile.typeFileARC"),
          id: "BDA-ARC"
        },
        {
          name: this.$i18n.t("importFile.typeFileAM"),
          id: "BDA-AM"
        },
        {
          name: this.$i18n.t("importFile.typeFileRPIB"),
          id: "RPIB"
        },
        {
          name: this.$i18n.t("importFile.typeFileFM"),
          id: "FM"
        }
      ]
    };
  },
  mounted: function() {
    this.idStatusFile = this.$route.query.id;
    if (this.idStatusFile) {
      this.getFileStatus(0);
      this.isCancelButtonAlert = true;
    }
  },
  methods: {
    pollData() {
      var refreshId = setInterval(async () => {
        this.getFileStatus(refreshId);
      }, 10000);
    },
    getFileStatus: async function(refreshId: any) {
      try {
        if (this.idStatusFile) {
          this.getFile = await getFileById(this.idStatusFile);
          if (this.getFile) {
            this.listErrors = JSON.parse(this.getFile.error);
            if (this.getFile.total_rows > 0) {
              this.valueProgressBar = Math.trunc(
                (this.getFile.current_row / this.getFile.total_rows) * 100
              );
            }
            this.statusFile = this.getFile.status;
            if (this.getFile.status === "created") {
              this.openAlert("warning");
              clearInterval(refreshId);
              this.pollData();
            }

            if (this.getFile.status === "completed") {
              this.openAlert("success");
              this.isLoadingConfirmButton = false;
              clearInterval(refreshId);
            }

            if (this.getFile.status === "error") {
              this.openAlert("danger");
              this.isLoadingConfirmButton = false;
              clearInterval(refreshId);
            }
          }
        }
      } catch (error) {
        console.log(error);
        this.isLoadingConfirmButton = false;
      }
    },
    openAlert: function(type: string) {
      this.typeAlert = `is-${type}`;
      this.messageAlert = this.$i18n.t(`importFile.${type}MessageAlert`);
      this.titleAlert = this.$i18n.t(`importFile.${type}TitleAlert`);
      switch (type) {
        case "danger":
          this.iconAlert = "alert-circle-outline";
          this.isProgressAlert = false;
          this.isCloseButtonAlert = true;
          this.isCancelButton = true;
          break;
        case "warning":
          this.iconAlert = "alert-outline";
          this.isProgressAlert = true;
          this.isCloseButtonAlert = false;
          this.isCancelButton = false;
          break;
        case "success":
          this.iconAlert = "check-circle-outline";
          this.isProgressAlert = false;
          this.isCloseButtonAlert = true;
          break;
        default:
          break;
      }
      this.isOpenAlert = true;
    },
    getPreviewFile: function() {
      try {
        if (!this.typeFile || this.file.size === undefined) {
          this.validatePage = true;
          return false;
        }
        this.valueProgressBar = 0;
        this.isLoadingLoadFiles = true;
        const reader = new FileReader();
        reader.onload = e => {
          let lines = [];
          lines = (<string>reader.result).trim().split("\n");
          let result = [];
          const headers = lines[0].split(",");

          let header = [] as any;
          for (const value of headers) {
            header.push({
              field: value,
              label: value.replace(/([a-z])([A-Z])/g, "$1 $2")
            });
          }
          this.columns = [...header];
          this.totalRecords = lines.length - 1;
          if (lines.length < this.limitItemsFile) {
            this.limitItemsFile = lines.length - 1;
          }

          for (let i = 1; i <= this.limitItemsFile; i++) {
            let obj = {} as any;
            let currentline = lines[i].split(",");
            for (let j = 0; j < headers.length; j++) {
              obj[headers[j]] = currentline[j];
            }
            result.push(obj);
          }
          this.itemsFile = JSON.parse(JSON.stringify(result));
          this.showGrid = true;
          this.isLoadingLoadFiles = false;
        };
        reader.readAsText(this.file);
        this.isCancelButton = true;
      } catch (error) {
        console.log(error);
        this.isLoadingLoadFiles = false;
      }
    },
    uploadFile: async function() {
      try {
        this.openAlert("warning");
        this.isLoadingConfirmButton = true;
        let formData = new FormData();
        formData.append("file", this.file);
        formData.append("type", this.typeFile);
        this.responseStatusFile = await postFile(formData);
        if (this.responseStatusFile?.status === "created") {
          this.idStatusFile = this.responseStatusFile.ID;
          this.$router.push({
            path: this.$route.path,
            query: { id: this.idStatusFile }
          });
          this.pollData();
        }
      } catch (error) {
        console.log(error);
      }
    },
    clearFile() {
      this.file = [];
      this.itemsFile = "";
      this.typeFile = null;
      this.responseStatusFile = {} as StatusFile | undefined;
      this.listErrors = [];
      this.getFile = [];
      this.isLoadingConfirmButton = false;
      this.valueProgressBar = 0;
      this.showGrid = false;
      this.validatePage = false;
      this.isOpenAlert = false;
      this.isCancelButtonAlert = false;
      this.$router.push({
        path: this.$route.path,
        query: {}
      });
    },
    closeModal() {
      this.isOpenAlert = false;
      if (this.typeAlert === "is-success") {
        this.clearFile();
      }
    }
  }
});
</script>
