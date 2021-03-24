export const validations = {
  data: () => ({
    valid: false,
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.trim().length !== 0) || 'Name is required'
    ],
    textRules: [
      v => !!v || 'Field is required',
      v => (v && v.trim().length !== 0) || 'Field is required'
    ],
    tagRules: [
      v => v !== null || 'Tag is required',
      v => (v && v.length !== 0) || 'Please select 1 or more tags'
    ],
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    quantityRules: [
      v => (v && v >= 0) || 'Please choose a number equal or greater than 0'
    ],
    selectBool: [
      v => v != null || 'Please choose an option',
    ],
    selectRules: [
      v => !!v || 'Please choose an option',
    ],
    date: new Date().toISOString().substr(0, 10),
    fileHeaders: [
      { text: 'Name', value: 'name' },
      { text: 'Last Modified Date', value: 'lastModifiedDate' },
      { text: 'Size', value: 'size' },
      { text: 'Type', value: 'type' },
    ],
  }),
  methods: {
    validate() {
      this.$refs.form.validate()
    },
    reset() {
      this.$refs.form.resetErrorBag()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    },
    // upload file button
    onButtonClick() {
      this.$refs.uploader.click()
    },
    onFileChanged(e) {
      this.itemInfo.files = [...e.target.files]
    }
  },
};
