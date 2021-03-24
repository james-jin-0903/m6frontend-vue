<template>
  <v-dialog
    v-model="showModal"
    persistent
    :width="loading ? '300px' : '90%'"
  >
    <v-card
      v-if="loading"
      color="primary"
      dark
    >
      <v-card-text>
        Please stand by
        <v-progress-linear
          class="mb-0"
          color="white"
          indeterminate
        />
      </v-card-text>
    </v-card>
    <v-stepper
      v-else
      v-model="step"
    >
      <v-stepper-header>
        <v-stepper-step
          :complete="step > 1"
          step="1"
        >
          Import File
        </v-stepper-step>

        <v-divider />

        <v-stepper-step
          :complete="step > 2"
          step="2"
        >
          Are these your column headers?
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="3">
          Select the column headers to add to the table view.
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <v-card class="mb-12 rounded-lg">
            <v-card-text class="pa-5">
              <label class="mr-2">Please upload your .xslx or .csv export file</label>
              <input
                accept=".xlsx, .csv"
                type="file"
                @change="onFileChange"
              >
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="closeModal">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="2">
          <v-card
            class="mb-12"
            height="200px"
          >
            <v-card-text class="ctm-ovx">
              <table
                v-if="isHeader === 'yes'"
                style="width: 100%; border-collapse: collapse;"
              >
                <tr>
                  <td
                    v-for="(cell, index) in fileData.data[0]"
                    :key="index"
                    class="header__td"
                  >
                    {{ cell }}
                  </td>
                </tr>
              </table>
              <v-select
                v-else
                v-model="selectedHeader"
                :items="fileData.data.slice(0, 21)"
                label="Select Row"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                @click="goToStep3"
              >
                Yes
              </v-btn>

              <v-btn
                text
                @click="isHeader = isHeader === 'no' ? 'yes' : 'no'"
              >
                No
              </v-btn>
              <v-btn @click="closeModal">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card class="mb-12 rounded-lg">
            <v-card-text>
              <v-checkbox
                v-for="(cell, index) in selectedHeader"
                :key="index"
                v-model="selectedFields"
                :label="`${cell.toString()}`"
                :value="index"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                @click="saveFields"
              >
                Save
              </v-btn>

              <v-btn @click="closeModal">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-dialog>
</template>

<script>
export default {
  name: 'ImportExcelDialog',
  props: {
    showModal: Boolean
  },
  data() {
    return {
      step: 1,
      loading: false,
      fileErrors: [],
      fileData: {
        data: []
      },
      isHeader: 'yes',
      selectedHeader: 0,
      selectedFields: []
    }
  },
  methods: {
    closeModal() {
      this.step = 1
      this.fileErrors = []
      this.fileData = { data: [] }
      this.selectedFields = []
      this.isHeader = 'yes'
      this.selectedHeader = 0
      this.$emit('closeImportModal')
    },
    onFileChange(e) {
      this.loading = true
      this.fileErrors = []
      const files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        return
      }
      const formData = new FormData()
      formData.append('file', files[0])
      this.axios
        .post(
          `${process.env.VUE_APP_HTTP}${process.env.VUE_APP_ENDPOINT}/api/cpm-import/parse`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        .then(({ data } = {}) => {
          console.log(data)
          const noEmptyHeaders = data.headers.filter(
            header => header !== null
          )
          const noEmptyFields = data.data.filter(field => field !== null)
          if (noEmptyHeaders.length === 0 && noEmptyFields.length === 0) {
            this.fileErrors = ['There are no headers in this file']
          } else {
            this.step = 2
            this.fileData = data
            this.fileErrors = []
          }
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          console.log(error)
          this.fileErrors = [error.message]
        })
    },
    goToStep3() {
      if (this.isHeader === 'yes') {
        this.selectedHeader = this.fileData.data[0]
      }
      this.step = 3
    },
    saveFields() {
      const fields = []
      this.selectedFields.map(row => {
        fields.push(this.selectedHeader[row])
      })
      this.$emit('addFieldFromExcel', fields)
      this.step = 1
      this.fileErrors = []
      this.selectedFields = []
      this.isHeader = 'yes'
      this.selectedHeader = 0
      this.fileData = { data: [] }
    }
  }
}
</script>

<style>
.header__td {
  border: 1px solid grey;
  text-align: center;
  font-size: 20px;
  padding: 10px;
}

.ctm-ovx {
  overflow-x: auto !important;
}
</style>
