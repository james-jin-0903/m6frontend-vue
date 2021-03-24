<template>
  <v-card>
    <v-card-text>
      <v-text-field
        v-model="from"
        :disabled="loading"
        label="From ID"
      />
      <v-text-field
        v-model="to"
        :disabled="loading"
        label="To ID"
      />
      <v-select
        v-model="type"
        :disabled="loading"
        :items="types"
        label="Select Collection to Clone"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="blue"
        dark
        :disabled="loading"
        @click="prepareClone"
      >
        {{ loading ? 'CLONING' : 'Clone' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { db, doFirebaseAuth, newFirebaseInit } from '@/utils/Firebase'

// eslint-disable-next-line vue/require-name-property
export default {
  /* eslint-disable no-console */
  data() {
    return {
      from: '',
      to: '',
      type: 'commitments',
      types: ['commitments', 'spendings'],
      loading: false
    }
  },
  async created() {
    await newFirebaseInit()
    await doFirebaseAuth()
  },
  methods: {
    prepareClone() {
      this.loading = true
      this.copyCollection(`/cpm_projects/${this.from}/${this.type}`, `/cpm_projects/${this.to}/${this.type}`)
        .then(() => {
          console.log('copy complete')
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          console.log('copy failed. ' + error)
        })
    },
    async copyCollection(srcCollectionName, destCollectionName) {
      const documents = await db.collection(srcCollectionName).get()

      let writeBatch = db.batch()
      const destCollection = db.collection(destCollectionName)
      let i = 0
      for (const doc of documents.docs) {
        const numberToCheck = await doc.data().number
        // Check if the document exist on the destination
        const existDocument = await this.existDocument(numberToCheck, destCollection)

        if (!existDocument) {
          const newDoc = {
            ...doc.data(),
            clonedBy: 'cloneTool'
          }
          delete newDoc._id
          if (newDoc.po_number) {
            const ref = await this.getDocument('commitments', this.to, newDoc.po_number)
            if (ref) {
              newDoc.commitment = ref
            }
          }
          console.log('New item', newDoc)
          writeBatch.set(destCollection.doc(`${doc.id}Cloned`), newDoc)
          i++
          const lineItems = await db.collection(`${srcCollectionName}/${doc.id}/line_items`).get()
          const destCollectionLineItems = db.collection(`${destCollectionName}/${doc.id}Cloned/line_items`)
          for (const docLine of lineItems.docs) {
            const newLine = {
              ...docLine.data(),
              clonedBy: 'cloneTool'
            }
            delete newLine._id

            writeBatch.set(destCollectionLineItems.doc(`${docLine.id}Cloned`), newLine)
            i++
            if (i > 400) { // write batch only allows maximum 500 writes per batch
              i = 0
              console.log('Intermediate committing of batch operation')
              await writeBatch.commit()
              writeBatch = db.batch()
            }
          }
          if (i > 400) { // write batch only allows maximum 500 writes per batch
            i = 0
            console.log('Intermediate committing of batch operation')
            await writeBatch.commit()
            writeBatch = db.batch()
          }
        } else {
          console.log('Document exist on destination', numberToCheck)
        }
      }
      if (i > 0) {
        console.log('Firebase batch operation completed. Doing final committing of batch operation.')
        await writeBatch.commit()
      } else {
        console.log('Firebase batch operation completed.')
      }
    },
    async existDocument(numberToCheck, destCollection) {
      const docs = await destCollection
        .where('number', '==', numberToCheck)
        .get()

      if (docs.empty) {
        return false
      }
      return true
    },
    async getDocument(type, projectID, numberToCheck) {
      const docs = await db.collection('cpm_projects')
        .doc(projectID).collection(type)
        .where('number', '==', numberToCheck.toString())
        .get()

      if (docs.empty) {
        return false
      }
      return docs.docs[0].ref
    }
  }
}
</script>
