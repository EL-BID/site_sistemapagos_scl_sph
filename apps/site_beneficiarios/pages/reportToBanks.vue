<template>
  <div class="container report-to-banks">
    <h1 class="subtitle is-flex is-align-items-center is-justify-content-start">
      <b-icon
        class="is-flex is-align-items-center is-justify-content-center"
        type="is-primary"
        icon="export"
      />
      {{ $t("reportToBanks.title") }}
    </h1>
    <div class="align-items-flex-end block is-mobile">
      <b-field grouped group-multiline>
        <b-field>
          <b-dropdown
            aria-role="list"
            ref="dropdown"
            @change="cancel(false)"
            v-model="typeFile"
          >
            <button
              class="button is-flex is-justify-content-space-between"
              type="button"
              slot="trigger"
            >
              <span v-if="!typeFile">{{
                $t("reportToBanks.typeFileLabel")
              }}</span>
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
        <b-field>
          <b-dropdown
            v-model="selectedbanks"
            multiple
            ref="dropdown"
            aria-role="list"
            :disabled="typeFile === 'PBC'"
            id="dropdownBanks"
          >
            <button
              class="button is-flex is-justify-content-space-between"
              type="button"
              slot="trigger"
            >
              <span v-if="selectedbanks.length">{{
                $t("reportToBanks.selectedBanksLabel")
              }}</span>
              <span v-for="(bank, index) in selectedbanks" :key="index">
                - {{ bank }}</span
              >
              <span v-if="!selectedbanks.length">{{
                $t("reportToBanks.banksLabel")
              }}</span>
              <b-icon icon="chevron-down"></b-icon>
            </button>

            <b-dropdown-item
              custom
              v-for="(option, index) in banksItems"
              :value="option.bank_code"
              :key="index"
              aria-role="listitem"
            >
              <b-checkbox @input="$refs.dropdown.selectItem(option.bank_code)">
                <span>{{ option.bank_code }}</span>
              </b-checkbox>
            </b-dropdown-item>
          </b-dropdown>
        </b-field>
        <b-field :label="$t('reportToBanks.initialDateLabel')">
          <b-datepicker
            v-model="initialDate"
            :date-formatter="dateFormatter"
            locale="es-ES"
            :placeholder="$t('reportToBanks.initialDateLabel')"
            icon="calendar-today"
            trap-focus
          >
          </b-datepicker>
        </b-field>
        <b-field :label="$t('reportToBanks.finishDate')">
          <b-datepicker
            v-model="finishDate"
            :date-formatter="dateFormatter"
            locale="es-ES"
            :placeholder="$t('reportToBanks.finishDate')"
            icon="calendar-today"
            trap-focus
          >
          </b-datepicker>
        </b-field>
      </b-field>
    </div>
    <div class="block">
      <b-button
        type="is-primary"
        :class="isLoadingSubmitSearch ? 'is-loading' : ''"
        v-on:click="submitSearch()"
        >{{ $t("reportToBanks.previewDocumentButton") }}</b-button
      >
    </div>
    <section>
      <div class="block" v-if="showGrid && !itemsFile.length">
        <h2>
          <strong>{{ $t("reportToBanks.noRecords") }}</strong>
        </h2>
      </div>
      <div class="block" v-if="itemsFile.length">
        <h2>
          <strong>{{ $t("reportToBanks.previewDocumentTitle") }}</strong>
        </h2>

        <Grid
          :columns="columns"
          :elements="itemsFile"
          :backendPagination="false"
        ></Grid>

        <div class="field is-grouped is-grouped-centered">
          <p class="control" expanded>
            <b-button
              type="is-success"
              :class="isLoadingExportFile ? 'is-loading' : ''"
              v-on:click="exportFile()"
              >{{ $t("reportToBanks.exportButton") }}</b-button
            >
          </p>
          <p class="control">
            <b-button type="is-danger" outlined v-on:click="cancel(true)">{{
              $t("reportToBanks.cancelButton")
            }}</b-button>
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Grid from "~/components/Grid.vue";
import { getBanks } from "../services/bank";
import {
  getDownloadFileByBank,
  getDownloadFileCentralBank
} from "../services/file";
export default Vue.extend({
  name: "ReportToBanks",
  components: {
    Grid
  },
  data() {
    return {
      resultsBanks: [] as any,
      showGrid: false,
      resultBankCentral: [] as any,
      filter: {} as any,
      fileElements: [],
      typeFile: null as any,
      selectedbanks: [],
      finishDate: new Date(),
      initialDate: new Date(),
      itemsFile: "",
      columns: [] as any,
      isLoadingSubmitSearch: false,
      isLoadingExportFile: false,
      limitItemsFile: 100,
      limitPreviewFile: 10000,
      typeFileItems: [
        {
          name: this.$i18n.t("reportToBanks.typeFileCentralBank"),
          id: "PBC"
        },
        {
          name: this.$i18n.t("reportToBanks.typeFileBanks"),
          id: "PB"
        }
      ],
      banksItems: []
    };
  },
  created: async function() {
    try {
      let result = await getBanks();
      if (result) {
        this.banksItems = JSON.parse(JSON.stringify(result));
      }
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    submitSearch: async function() {
      try {
        this.isLoadingSubmitSearch = true;
        switch (this.typeFile) {
          case "PBC":
            this.createFilter("", 0);
            this.resultBankCentral = await getDownloadFileCentralBank(
              this.filter
            );
            if (this.resultBankCentral) {
              this.previewFile(this.resultBankCentral);
            }
            this.showGrid = true;
            break;

          case "PB":
            for await (var bank of this.selectedbanks) {
              this.createFilter(bank, this.limitPreviewFile);
              this.resultsBanks = await getDownloadFileByBank(
                this.selectedbanks[0],
                this.filter
              );
              if (this.resultsBanks) {
                await this.previewFile(this.resultsBanks);
                if (this.itemsFile.length) {
                  break;
                }
              }
            }
            this.showGrid = true;
            break;

          default:
            break;
        }
      } catch (error) {
        console.log(error);
      }
      this.isLoadingSubmitSearch = false;
    },
    previewFile: async function(file: string) {
      let lines = [];
      lines = (<string>file).trim().split("\n");
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

      for (let i = 1; i < lines.length; i++) {
        let obj = {} as any;
        let currentline = lines[i].split(",");
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j];
        }
        result.push(obj);
      }
      this.itemsFile = JSON.parse(JSON.stringify(result)); //JSON
    },
    exportFile: async function() {
      try {
        var date = new Date();
        var mm = date.getMonth() + 1;
        var dd = date.getDate();
        var yy = date.getFullYear();
        let nameFile = "";
        switch (this.typeFile) {
          case "PBC":
            this.isLoadingExportFile = true;
            nameFile = "BC." + mm + dd + yy + ".csv";
            this.exportToCsv(this.resultBankCentral, nameFile);
            this.isLoadingExportFile = false;
            break;

          case "PB":
            let files = [];
            for await (var bank of this.selectedbanks) {
              this.isLoadingExportFile = true;
              let codeBank: string = bank;
              nameFile = "IB." + codeBank + "." + mm + dd + yy + ".csv";
              this.createFilter(codeBank, 0);
              let file = await getDownloadFileByBank(bank, this.filter);
              files.push({
                file: file,
                nameFile: nameFile
              });
            }
            for (var itemFile of files) {
              this.exportToCsv(itemFile.file, itemFile.nameFile);
            }
            this.isLoadingExportFile = false;
            break;

          default:
            break;
        }
      } catch (error) {
        console.log(error);
      }
    },
    exportToCsv(file: any, nameFile: string) {
      var blob = new Blob([file], { type: "text/csv; charset=UTF-8" });
      var link = document.createElement("a");
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", nameFile);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    cancel(clearTypeFile: boolean) {
      if (clearTypeFile) {
        this.typeFile = null as any;
      }
      this.resultsBanks = [] as any;
      this.resultBankCentral = [] as any;
      this.filter = {} as any;
      this.fileElements = [];
      this.selectedbanks = [];
      this.finishDate = new Date();
      this.initialDate = new Date();
      this.itemsFile = "";
      this.columns = [] as any;
      this.showGrid = false;

      let formElement = document.getElementById("dropdownBanks");
      if (formElement !== null) {
        var inputs = formElement.getElementsByTagName("input");
        for (var i = 0, input; (input = inputs[i++]); ) {
          input.checked = false;
        }
      }
    },
    createFilter(bankCode: string, limitPreviewFile: number) {
      this.filter = {
        startDate: this.initialDate.toLocaleDateString("es-ES"),
        finishDate: this.finishDate.toLocaleDateString("es-ES"),
        bankCode: bankCode,
        limit: limitPreviewFile
      };
    },
    dateFormatter(date: Date) {
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    }
  }
});
</script>
