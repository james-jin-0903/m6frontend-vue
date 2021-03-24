<template>
  <v-card>
    <v-card-text class="vertical-scroll">
      <v-row>
        <v-col md="12">
          <v-container
            class="rounded-lg"
            fluid
            grid-list-md
          >
            <v-row>
              <v-col md="12">
                <v-select
                  v-model="settings.defaultStandard"
                  clearable
                  item-text="name"
                  :items="standards"
                  label="Policy and Procedures"
                >
                  <template slot="no-options">
                    type to search for policies and procedures
                  </template>
                </v-select>
              </v-col>
            </v-row>

            <v-row>
              <v-col md="12">
                <v-btn
                  color="blue"
                  outlined
                  @click="cancel"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="blue"
                  dark
                  :disabled="loading"
                  :loading="loading"
                  @click="save"
                >
                  Save
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col md="12">
          <v-treeview
            v-if="settings.defaultStandard && settings.defaultStandard.files"
            activatable
            hoverable
            :items="settings.defaultStandard.files"
            open-on-click
          >
            <template
              slot="prepend"
              slot-scope="{ item, open }"
            >
              <v-icon v-if="!item.file">
                {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
              </v-icon>
              <v-icon
                v-else-if="
                  item.file === 'image/jpeg' || item.file === 'image/png'
                "
              >
                mdi-image
              </v-icon>
              <v-icon v-else-if="item.file === 'application/pdf'">
                mdi-file-pdf-box
              </v-icon>
              <v-icon v-else>
                mdi-text-box-outline
              </v-icon>
            </template>
            <template
              slot="append"
              slot-scope="{ item, open, leaf }"
            >
              <template>
                <template v-if="item.file">
                  <a
                    :href="item.url"
                    style="padding-top: 6px"
                    target="_blank"
                  >
                    <v-icon small>mdi-folder-plus</v-icon>
                  </a>
                </template>
              </template>
            </template>
          </v-treeview>
          <div
            v-else-if="
              settings.defaultStandard &&
                (!settings.defaultStandard.files ||
                  settings.defaultStandard.files.length <= 0)
            "
          >
            No files found
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { db } from '@/utils/Firebase.js'
import { mapState } from 'vuex'

export default {
  name: 'DefaultPolicyProcedure',
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  data() {
    return {
      settings: {},
      standards: [],
      loading: false
    }
  },
  mounted() {
    this.getStandards()
  },
  methods: {
    getStandards() {
      db.collection('standards')
        .where('active', '==', true)
        .get()
        .then(rows => {
          for (const index in rows.docs) {
            const data = rows.docs[index].data()
            const row = {
              id: rows.docs[index].id,
              number: data.number,
              name: data.title,
              type: data.type,
              files: data.files,
              campus: data.campus,
              notes: data.notes,
              exhibit: data.exhibit,
              createdAt: '',
              updatedAt: '',
              version: data.version
            }
            this.standards.push(row)
          }
        })
    },
    cancel() {
      this.settings.defaultStandard = {}
    },
    save() {
      this.loading = true

      if (
        this.settings.defaultStandard &&
        (!this.settings.defaultStandard.files ||
          this.settings.defaultStandard.files.length <= 0)
      ) {
        delete this.settings.defaultStandard.files
      }

      db.collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
        .update({
          defaultStandard: this.settings.defaultStandard
        })
        .then(() => {
          this.loading = false
          this.$snotify.success(
            'The policy and procedure default has been saved',
            'Success'
          )
        })
    }
  },
  firestore() {
    return {
      settings: db
        .collection('settings')
        .doc(this.currentCompany.id)
        .collection('settings')
        .doc('projects')
    }
  }
}
</script>
