<template>
  <v-card
    class="rounded-lg"
    flat
  >
    <v-card-text class="vertical-scroll">
      <v-container
        class="rounded-lg"
        fluid
        grid-list-md
      >
        <v-row
          v-for="(project, indexProject) in projectGroup.projects"
          :key="indexProject"
        >
          <v-col md="12">
            <preview-project
              :preview-options="previewOptions"
              :project="project"
              :project-group="projectGroup"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import PreviewProject from './PreviewProject'
export default {
  components: {
    PreviewProject
  },
  props: {
    projectGroup: {
      type: Object,
      required: true
    },
    checkProjectCards: {
      type: Boolean,
      default: false
    },
    previewOptions: {
      type: Object,
      required: true
    }
  }
}
</script>
