<template>
  <v-card>
    <v-card-text class="vertical-scroll">
      <label>{{ $t('cpmSettings.settings.projOptions.expirationDate.title') }}:</label>
      <v-text-field
        v-model="expirationDefaultDate"
        hide-details
        single-line
        type="number"
      />
      <v-btn
        color="blue"
        outlined
        @click="clear"
      >
        {{ $t('general.clear') }}
      </v-btn>
      <v-btn
        color="blue"
        dark
        type="submit"
        @click="save"
      >
        {{ submitLoading ? $t('general.saving') : $t('general.save') }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'ExpirationDate',
  data() {
    return {
      settings: {},
      expirationDefaultDate: 7,
      submitLoading: false,
      rules: {
        required: value => !!value || 'Required.'
      }
    }
  },
  computed: {
    ...mapGetters(['appLabel']),
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  mounted() {
    db.collection('settings')
      .doc(this.currentCompany.id)
      .collection('settings')
      .doc(this.appLabel.settingsCollection)
      .get()
      .then(settings => {
        if (!settings.exists) {
          db.collection('settings')
            .doc(this.currentCompany.id)
            .collection('settings')
            .doc(this.appLabel.settingsCollection)
            .set({
              expirationDefaultDate: 7
            })
        } else {
          this.expirationDefaultDate = settings.data()['expirationDefaultDate']
            ? settings.data()['expirationDefaultDate']
            : this.createDefault()
        }
      })
  },
  methods: {
    createDefault() {
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          expirationDefaultDate: 7
        })
      return this.settings.expirationDefaultDate || this.expirationDefaultDate
    },
    clear() {
      this.expirationDefaultDate = ''
    },
    save() {
      this.submitLoading = true
      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.settingsCollection)
        .update({
          expirationDefaultDate: this.expirationDefaultDate
        })
        .then(() => {
          this.$snotify.success(
            this.$t('cpmSettings.settings.projOptions.expirationDate.saved'),
            this.$t('alerts.success')
          )
          this.submitLoading = false
        })
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc(this.appLabel.settingsCollection)
    }
  }
}
</script>
