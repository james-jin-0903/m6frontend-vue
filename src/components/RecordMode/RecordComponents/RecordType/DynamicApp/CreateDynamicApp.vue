<template>
  <v-card>
    <v-card-title>
      {{ title }}
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'CreateDynamicApp',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>
