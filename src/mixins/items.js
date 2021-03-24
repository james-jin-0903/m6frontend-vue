export const items = {
  data: () => ({
    dialog: false,
    // true for create new item, false to update an item info
    dialogMode: true,
    dataPeople: [
      { name: 'Name 1', email: 'name1@gmail.com', phone: '987362367'},
      { name: 'Name 2', email: 'name2@gmail.com', phone: ''},
      { name: 'Name 3', email: 'name3@gmail.com', phone: '999555415'}
    ],
    dataCompany: [
      { name: '3DR Labs II, LLC'}, 
      { name: '3M Health Information Systems, Inc'}, 
      { name: '4S Information Systems Ltd'},
      { name: 'AAOS (American Academy of Orthopaedic Surgeons)'}, 
      { name: 'Abbott (formerly Alere and Medical Automation Systems)'},
      { name: 'Ability Network Inc'}, 
      { name: 'Accenture, LLP'}, 
      { name: 'Accuray'}, 
      { name: 'ACR Analytics, LLC'}, 
      { name: 'Acuity Cloud Solutions'}, 
      { name: 'Adobe Systems Inc'},
      { name: 'ADP, LLC'}, 
      { name: 'Advance Innovative Solutions, Inc'}, 
      { name: 'Advanced Bionics LLC'}, 
      { name: 'Advancedd Brain Technologies'},
      { name: 'Advanced Call Processing, Inc'}
    ],
    items: []
  }),
  computed: {
    titleDialog() {
      return !this.dialogMode ? 'Update ' + this.itemsName + ' info' : 'Create ' + this.itemsName;
    },
    titleAction() {
      return !this.dialogMode ? 'Update' : 'Save';
    }
  },
  methods: {
    clickAction() {
      this.dialogMode ? this.saveItem() : this.updateItem();
    },
    saveItem() {
      if(this.valid) {
        let id = parseInt(Date.now() * Math.random());
        let newItem = {};
        let info = [newItem,this.itemInfo];
        newItem = Object.assign(...info);
        newItem.id = id;
        this.items.push(newItem);
        this.closeDialog();
        this.post();
      }
    },
    updateItem() {
      if(this.valid) {
        this.items.forEach((item) => {
          if(item.id == this.itemInfo.id) {
              let info = [item,this.itemInfo];
              item = Object.assign(...info);
          }
        });
        this.closeDialog();
        this.put();
      }
    },
    customFilter (item, queryText) {
      const textOne = item.value.toLowerCase();
      const searchText = queryText.toLowerCase();
      return textOne.indexOf(searchText) > -1;
    },
    showUpdateDialog(data) {
      let info = [this.itemInfo,data];
      this.itemInfo = Object.assign(...info);
      this.dialog = true;
      this.dialogMode = false;
    },
    deleteItem() {
      let indexDeletedItem = this.items.findIndex((element) => element.id == this.itemInfo.id);
      this.items.splice(indexDeletedItem, 1);
      this.closeDialog();
      this.delete();
    },
    closeDialog() {
      this.reset();
      this.dialog = false;
    }
  }
};