<template>
  <v-btn
    color="primary"
    @click="runScript"
  >
    Execute Script
  </v-btn>
</template>

<script>
import { db } from '@/utils/Firebase'
import { defaultFilesStructure } from './DefaultFilesStructure'

export default {
  name: 'ScriptToSetDocumentStructure',

  data() {
    return {

    }
  },

  methods: {
    runScript() {
      db
        .collection('cpm_projects')
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
              const data = {
                id: doc.id,
                ...doc.data()
              }

              if (!this.$h.dg(data, 'files', []).length) {
                db
                  .collection('cpm_projects')
                  .doc(data.id)
                  .update({
                    files: defaultFilesStructure
                  })
              }
            })
          }
        })
    }
  }
}
</script>
