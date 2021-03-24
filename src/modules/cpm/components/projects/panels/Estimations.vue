<template>
  <m6-card-dialog :title="$t('cpm.projects.estimates.title')">
    <template v-slot:after:title>
      <v-tooltip
        v-if="$route.name === 'cpm.projects.show'"
        left
      >
        <template v-slot:activator="{ on }">
          <a
            class="pointer pr-1"
            :href="'/m6apps#/cpm/projects/' + $route.params.id + '/fullscreen/estimations'"
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

      <v-icon
        class="cursor"
        light
        @click="openModal"
      >
        mdi-pencil
      </v-icon>
    </template>

    <v-data-table
      :headers="headers"
      :items="estimations"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <td>
          <router-link
            target="_blank"
            :to="{ name: 'estimations.show', params: { id: props.item.id } }"
          >
            <v-avatar size="36">
              <img
                v-if="props.item.avatar"
                :alt="$t('general.avatar')"
                :src="props.item.avatar"
              >
              <v-icon
                v-else
                size="36"
              >
                mdi-image
              </v-icon>
            </v-avatar>
          </router-link>
        </td>
        <td class="text-center">
          <div>
            <router-link
              target="_blank"
              :to="{ name: 'estimations.show', params: { id: props.item.id } }"
            >
              {{ props.item.name }}
            </router-link>
          </div>
        </td>
        <td class="text-center">
          {{ props.item.total }}
        </td>

        <td class="text-right">
          <m6-dropdown-actions
            :options="dropdownOptions"
            @delete="disassociateEstimation(props.item.id)"
            @edit="editEstimation(props.item.id)"
          />
        </td>
      </template>

      <template v-slot:footer>
        <td />
        <td class="text-center">
          <strong>{{ $t('cpm.projects.estimates.totalCost') }}:</strong>
        </td>
        <td class="text-center">
          <strong>{{ totalCost | currency }}</strong>
        </td>
        <td />
      </template>
    </v-data-table>

    <v-dialog
      v-model="showModal"
      persistent
      scrollable
      :width="800"
    >
      <v-card>
        <v-card-title class="headline px-6 py-4 white">
          <span class="grey--text text--darken-1">
            {{ $t('cpm.projects.estimates.createEstimate') }}
          </span>
        </v-card-title>
        <v-divider class="grey lighten-3" />

        <v-card-text class="vertical-scroll">
          <v-container
            class="rounded-lg"
            fluid
            grid-list-md
          >
            <v-row>
              <v-col>
                <v-autocomplete
                  v-model="draftAssociatedEstimations"
                  clearable
                  item-text="name"
                  :items="allEstimations"
                  :label="$t('general.name')"
                  multiple
                  return-object
                >
                  <template v-slot:selection="data">
                    <v-chip
                      close
                      color="primary"
                      label
                      small
                      text-color="white"
                      @input="removeEstimation(data.item.id)"
                    >
                      {{ data.item.name }}
                    </v-chip>
                  </template>
                </v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="showModal = false"
          >
            {{ $t('general.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="update"
          >
            {{ $t('general.upadte') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </m6-card-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { db } from '@/utils/Firebase'

export default {
  name: 'Estimations',
  data() {
    return {
      headers: [
        { text: this.$t('cpm.projects.estimates.image'), sortable: false },
        { text: this.$t('general.name'), value: 'name' },
        { text: this.$t('general.total'), value: 'total' },
        {
          text: this.$t('general.actions'),
          value: 'number',
          sortable: false
        }
      ],
      estimations: [],
      allEstimations: [],
      totalCost: 0,
      showModal: false,
      draftAssociatedEstimations: [],
      projectEstimationsRef: db.collection('project_estimations'),
      projectsRef: db.collection('cpm_projects'),
      projectId: this.$route.params.id,
      searchInput: ''
    }
  },
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    }),
    dropdownOptions() {
      return [
        {
          icon: 'edit',
          title: this.$t('general.show'),
          event: 'edit'
        },
        {
          icon: 'delete',
          title: this.$t('general.delete'),
          event: 'delete'
        }
      ]
    }
  },
  created() {
    this.getAssociatedEstimations()
  },
  methods: {
    getAssociatedEstimations() {
      this.totalCost = 0
      this.estimations = []
      const ref = this.projectsRef.doc(this.$route.params.id)
      this.projectEstimationsRef
        .where('project', '==', ref)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const total = this.getTotal(doc.data())
            this.estimations.push({ ...doc.data(), id: doc.id, total: total })
          })
        })
    },
    getAllEstimations() {
      this.projectEstimationsRef
        .where(
          'company_nid',
          '==',
          this.currentCompany.id
        )
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.allEstimations.push({ ...doc.data(), id: doc.id })
          })
        })
    },
    getTotal(item) {
      if (item.products && item.products.length > 0) {
        let total = 0
        item.products.map(product => {
          if (product.estimationInformation) {
            const quantity = product.estimationInformation.quantity || 0
            const unitCost = product.estimationInformation.unitCost || 0

            total += quantity * unitCost
          }
        })
        this.totalCost += total

        return total
      } else {
        return 0
      }
    },
    editEstimation(estimationId) {
      window.open(
        this.$router.resolve({
          name: 'estimations.show',
          params: { id: estimationId }
        }).href,
        '_blank')
    },
    disassociateEstimation(id) {
      if (this.allEstimations.length === 0) {
        this.getAllEstimations()
      }

      this.draftAssociatedEstimations = [...this.estimations]

      this.removeEstimation(id)

      this.$nextTick(this.update)
    },

    update() {
      const oldAssociatedEstimationIds = this.estimations.map(estimation => estimation.id)

      const newAssociatedEstimationIds = this.draftAssociatedEstimations.map(
        estimation => estimation.id
      )

      if (
        this.arraysEqual(oldAssociatedEstimationIds, newAssociatedEstimationIds)
      ) {
        this.$snotify.success(this.$t('cpm.projects.estimates.updated'))
        this.showModal = false
        return
      }

      const associatedEstimationsToRemove = oldAssociatedEstimationIds.filter(
        function (val) {
          return newAssociatedEstimationIds.indexOf(val) === -1
        }
      )

      const estimationsToAddPromises = newAssociatedEstimationIds.map(id => {
        this.projectEstimationsRef
          .doc(id)
          .update({ project: this.projectsRef.doc(this.projectId) })
      })

      const estimationsToRemovePromises = associatedEstimationsToRemove.map(
        id => {
          this.projectEstimationsRef.doc(id).update({ project: [] })
        }
      )

      const allPromises = [
        ...estimationsToAddPromises,
        ...estimationsToRemovePromises
      ]

      Promise.all(allPromises).then(() => {
        this.$snotify.success(this.$t('cpm.projects.estimates.updated'))
        this.showModal = false
        setTimeout(() => this.getAssociatedEstimations(), 1000)
      })
    },
    arraysEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) {
        return false
      }

      for (let i = arr1.length; i--;) {
        if (arr1[i] !== arr2[i]) return false
      }

      return true
    },
    openModal() {
      if (this.allEstimations.length === 0) {
        this.getAllEstimations()
      }
      this.draftAssociatedEstimations = [...this.estimations]
      this.showModal = true
    },
    removeEstimation(id) {
      this.draftAssociatedEstimations = this.draftAssociatedEstimations.filter(
        estimation => estimation.id !== id
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.associated-estimations-box {
  overflow-y: auto;
}
</style>
