<template>
  <v-card
    class="rounded-lg"
    flat
  >
    <v-card-text class="vertical-scroll">
      <v-container
        class="rounded-lg"
        fluid
      >
        <template v-if=" proposal.hasAllowances && allowances.length>0">
          <template v-for="(allowance, index) in allowances">
            <v-row
              :key="index"
            >
              <v-col md="12">
                <h4><strong>Allowance #{{ allowance.index }}</strong></h4>
              </v-col>
            </v-row>

            <v-row
              :key="`${index}body`"
            >
              <v-col md="12">
                <div v-html="allowance.html" />
              </v-col>
            </v-row>

            <!-- <v-layout row wrap :key="`${index}template-body`">
              <v-flex md12>
                <div v-html="proposalAuxiliar.allowanceTemplateSelectedBody"></div>
              </v-flex>
            </v-layout> -->
          </template>
        </template>

        <template v-else>
          This RFP does not have allowances.
        </template>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
import { db } from '@/utils/Firebase'

export default {
  name: 'Allowance',
  props: {
    proposal: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      proposalAuxiliar: {}
    }
  },
  firestore() {
    const returnObj = {
      proposalAuxiliar: db.collection('proposals').doc(this.proposal.id)
    }

    return returnObj
  },
  computed: {
    allowances() {
      if (!this.proposal.allowances) {
        return []
      }

      const aux = JSON.parse(JSON.stringify(this.proposal.allowances))

      aux.map((score, index) => {
        score.index = index + 1
      })

      return aux
    }
  }
}
</script>

<style scoped>
.allowance-header{
  text-decoration: underline;
}

</style>
