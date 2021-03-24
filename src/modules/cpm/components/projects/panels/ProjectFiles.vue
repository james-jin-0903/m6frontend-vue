<template>
  <m6-card-dialog :title="$t('cpm.projectProfile.sidebar.files')">
    <template v-slot:after:title>
      <v-tooltip
        v-if="$route.name === 'cpm.projects.show'"
        left
      >
        <template v-slot:activator="{ on }">
          <a
            class="pointer pr-1"
            :href="'/m6apps#/cpm/projects/' + $route.params.id + '/fullscreen/project-files'"
            target="_blank"
            v-on="on"
          >
            <v-icon
              light
              text
            >
              mdi-launch
            </v-icon>
          </a>
        </template>
        <span>{{ $t('general.openNewTab') }}</span>
      </v-tooltip>
    </template>

    <v-tabs
      v-model="tabs"
      centered
      color="white"
      flat
      slider-color="blue lighten--2"
    >
      <v-tab
        class="pb-0"
        href="#project_files"
      >
        {{ $t('cpm.projectFiles.photos') }}
      </v-tab>

      <v-tab
        class="pb-0"
        href="#file_system"
      >
        <template>
          {{ $t('cpm.projectFiles.documents') }}
        </template>
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tabs">
      <v-tab-item value="project_files">
        <project-photos />
      </v-tab-item>

      <v-tab-item value="file_system">
        <file-system />
      </v-tab-item>
    </v-tabs-items>
  </m6-card-dialog>
</template>

<script>
import FileSystem from '../file_system/FileSystem'
import ProjectPhotos from '../file_system/ProjectPhotos'

export default {
  components: {
    FileSystem,
    ProjectPhotos
  },

  data: () => ({
    tabs: 'file_system'
  })
}
</script>
