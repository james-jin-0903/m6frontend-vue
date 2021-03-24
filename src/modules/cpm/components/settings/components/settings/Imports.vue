<template>
  <div class="row">
    <v-card>
      <div class="box">
        <button
          class="btn btn-primary"
          :disabled="submitLoading"
          @click="importCompanies"
        >
          Companies
        </button>
      </div>

      <div class="box">
        <button
          class="btn btn-primary"
          :disabled="submitLoading"
          @click="importUsers"
        >
          Users
        </button>
      </div>
    </v-card>
  </div>
  <v-card>
    <div
      v-if="newCompanies || updatedCompanies"
      class="alert alert-primary"
      role="alert"
    >
      {{ newCompanies }} Companies have been created and {{ updatedCompanies }} Companies have been updated.
    </div>

    <div
      v-if="newUsers || updatedUsers"
      class="alert alert-primary"
      role="alert"
    >
      {{ newUsers }} Users have been created and {{ updatedUsers }} Users have been updated.
    </div>
    </div>
    </div>
  </v-card>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import axios from 'axios'
export default {
  data() {
    return {
      newCompanies: 0,
      updatedCompanies: 0,
      newUsers: 0,
      updatedUsers: 0,
      submitLoading: false
    }
  },
  methods: {
    saveCompanies(data) {
      this.newCompanies = 0
      this.updatedCompanies = 0
      data.forEach(item => {
        db.collection('companies').where('cid', '==', parseInt(item.nid)).get().then(newCompany => {
          if (newCompany.empty) {
            db.collection('companies').add({
              cid: parseInt(item.nid),
              name: item.title,
              nextTicketNumber: 1
            })
            this.newCompanies++
          } else {
            this.updatedCompanies++
            newCompany.docs[0].ref.update({ 'name': item.title })
          }
        })
      })
    },
    importCompanies() {
      this.submitLoading = true
      axios.get('/cadence/get/companies')
        .then(response => {
          this.saveCompanies(response.data)
          this.submitLoading = false
        })
        .catch(error => {
          this.$snotify.error(error, 'Error')
        })
    },
    saveUsers(data) {
      this.newUsers = 0
      this.updatedUsers = 0
      data.forEach(item => {
        db.collection('users').where('uid', '==', parseInt(item.uid)).get().then(newUser => {
          if (newUser.empty) {
            db.collection('users').add({
              uid: parseInt(item.uid),
              fullName: item.name,
              email: item.email
            })
            this.newUsers++
          } else {
            this.updatedUsers++
            newUser.docs[0].ref.update({
              'name': item.name,
              'email': item.email
            })
          }
        })
      })
    },
    importUsers() {
      this.submitLoading = true
      axios.get('/cadence/get/users')
        .then(response => {
          this.saveUsers(response.data)
          this.submitLoading = false
        })
        .catch(error => {
          this.$snotify.error(error, 'Error')
        })
    }
  },
  firestore() {
    return {

    }
  }
}
</script>

<style>
  .alert-primary {
    color: #004085;
    background-color: #cce5ff;
    border-color: #b8daff;
}
.box {
  padding: 10px;
}
</style>
