import Vue from 'vue'
import m6CardDialog from '@/modules/cpm/_partials/M6CardDialog'
import m6DataTable from '@/modules/cpm/_partials/M6DataTable'
import m6ConfirmDelete from '@/modules/cpm/_partials/M6ConfirmDelete.vue'
import m6DropDownActions from '@/modules/cpm/_partials/M6DropdownActions'
Vue.component(m6DataTable.name, m6DataTable)
Vue.component(m6CardDialog.name, m6CardDialog)
Vue.component(m6ConfirmDelete.name, m6ConfirmDelete)
Vue.component(m6DropDownActions.name, m6DropDownActions)
