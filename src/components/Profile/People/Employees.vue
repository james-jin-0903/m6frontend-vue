<template>
    <v-row class="d-block ma-0 pt-4 pb-6 px-5 white width-100 vertical-scroll dont-show-scroll rounded-xl">
      <p class="grey--text text--darken-3 font-weight-medium text-h6 mb-5">Sharp Employees</p>
      <template v-for="(employee,index) in employees">
        <v-row class="d-flex flex-column px-3" :key="'employee' + index">
          <v-row class="d-flex ma-0 align-center">
            <v-col cols="2" class="pa-0">
              <v-avatar size="90">
                <img
                    :src="employee.imgSource"
                    :alt="employee.firstName"
                >
              </v-avatar>
            </v-col>
            <v-col cols="6" class="pl-6">
              <p class="mb-0 ml-2 text-h5 grey--text text--darken-1">{{ employee.firstName }} {{ employee.lastName }}</p>
              <p class="mb-0 ml-2 text-body-1 grey--text">{{ employee.jobTitle }}</p>
            </v-col>
            <v-col cols="4" class="pa-0">
              <div class="d-flex align-center justify-end mb-2">
                <v-btn :icon="true" height="35" width="35" class="grey lighten-3 grey--text">
                  <v-icon :size="21">mdi-email-outline</v-icon>
                </v-btn>
                <v-btn :icon="true" height="35" width="35" class="grey lighten-3 grey--text ml-2">
                  <v-icon :size="20">mdi-phone</v-icon>
                </v-btn>                  
                <v-btn :icon="true" height="35" width="35" class="grey lighten-3 grey--text ml-2">
                  <v-icon :size="20">mdi-message-outline</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
          <div v-if="index !== employees.length - 1">
            <v-divider class="my-3 grey lighten-2"></v-divider>
          </div>
        </v-row>
      </template>
    </v-row>
</template>

<script>
export default {
  data: () => ({
    employees: [
      { imgSource:'https://cdn.vuetifyjs.com/images/john.jpg', firstName:'User', lastName:'Userson', jobTitle: 'IT Manager' },
      { imgSource:'https://cdn.vuetifyjs.com/images/john.jpg', firstName:'User', lastName:'Userson', jobTitle: 'IT Manager' },
      { imgSource:'https://cdn.vuetifyjs.com/images/john.jpg', firstName:'User', lastName:'Userson', jobTitle: 'IT Manager' },
      { imgSource:'https://cdn.vuetifyjs.com/images/john.jpg', firstName:'User', lastName:'Userson', jobTitle: 'IT Manager' },
      { imgSource:'https://cdn.vuetifyjs.com/images/john.jpg', firstName:'User', lastName:'Userson', jobTitle: 'IT Manager' }
    ],
  }),
  name: "Employees",
  computed: {
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
</style>