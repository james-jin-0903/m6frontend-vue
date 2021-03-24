<template>
  <v-container class="rounded-lg">
    <v-row
      class="text-center"
      column
    >
      <v-col>
        <h1>404</h1>
      </v-col>

      <v-col>
        <h2 v-text="'Not Found'" />
      </v-col>

      <v-col>
        <span v-text="'Resource searched does not exist or is not found.'" />
      </v-col>

      <v-col>
        <p>
          <a
            href=""
            @click.prevent="$router.back"
            v-text="'« Go Back'"
          />
          /
          <a
            href=""
            @click.prevent="$router.replace({ name: 'dashboard' })"
            v-text="'Go Dashboard »'"
          />
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Error404'
}
</script>
