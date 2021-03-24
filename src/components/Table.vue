<template>
  <v-data-table
    :headers="data.headers"
    :items="data.body"
    :items-per-page="5"
    class="elevation-1"
  />
 </template>

<script>  
  export default {
    name:"TableComponent",
    props:{
      data: Object
    }
  }
</script>