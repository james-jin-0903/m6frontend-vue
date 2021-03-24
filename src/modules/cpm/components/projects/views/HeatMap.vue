<template>
  <v-data-table
    :headers="headers"
    :items="resources"
  >
    <template v-slot:items="{ index, item }">
      <tr :class="{ 'light-blue lighten-4': index & 1 }">
        <td>
          {{ item.title || $t('general.nA') }}
        </td>
        <td>
          {{ item.covidRiskComment }}
        </td>
        <td>
          <template v-for="status in covidRiskStatus">
            <div
              class="square"
              :style="{ 'background-color': getCovidStatusColor(item.covidRiskStatus, status) }"
            />
          </template>
        </td>
        <td class="text-right">
          <v-icon
            class="edit-icon pointer"
            @click="goToProject(item)"
          >
            mdi-pencil
          </v-icon>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'HeatMap',

  props: {
    resources: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      headers: [
        {
          text: this.$t('general.projectName'),
          class: 'info dark white--text subheading'
        },
        {
          text: this.$tc('general.comment', 2),
          class: 'info dark white--text subheading',
          sortable: false,
          width: '60%'
        },
        {
          text: this.$t('general.riskLevel'),
          class: 'info dark white--text subheading',
          sortable: false
        },
        {
          text: this.$t('general.action'),
          class: 'info dark white--text subheading dark',
          sortable: false
        }
      ]
    }
  },

  computed: {
    ...mapGetters('companies/cpmProjects/settings', {
      covidRiskStatus: 'getCovidRiskStatus'
    })
  },

  mounted() {
    if (!this.covidRiskStatus.length) {
      this.fetchCovidRiskStatus()
    }
  },

  methods: {
    ...mapActions('companies/cpmProjects/settings', {
      fetchCovidRiskStatus: 'fetchCovidRiskStatus'
    }),
    getCovidStatusColor(projectStatus, item) {
      if (!this.$h.dg(projectStatus, 'name')) return

      if (this.$h.dg(projectStatus, 'name') === this.$h.dg(item, 'name')) {
        return this.$h.dg(projectStatus, 'color')
      } else return
    },
    goToProject(item) {
      this.$emit('goToProject', item)
    }
  }
}
</script>

<style lang="scss" scoped>
  .edit-icon {
    transition: all 0.2s ease-out;

    &:hover {
      transform: scale(1.2);
      color: #2196F3;
    }
  }
  .square {
    height: 1.875rem;
    width: 1.875rem;
    border: 1px solid;
    display: inline-block;
    margin: 5px;
  }
</style>
