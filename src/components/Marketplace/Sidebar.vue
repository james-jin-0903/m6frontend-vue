<template>
  <div class="">
    <v-container class="py-10">
      <div class="mx-n10">
        <div class="pb-5 px-10">
          <div class="d-flex py-5">
            <div class="flex-grow-1 font-weight-bold text-h5">
              Marketplace
            </div>
            <v-btn
              class="elevation-0 mr-3"
              :class="themeCommon.content"
              fab
              small
              @click="addDialog = true"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <v-menu
              max-height="550"
              offset-y
            >
              <template v-slot:activator="{on, attrs}">
                <v-badge
                  bordered
                  color="indigo"
                  content="3"
                >
                  <v-btn
                    v-bind="attrs"
                    class="elevation-0"
                    :class="themeCommon.content"
                    fab
                    small
                    v-on="on"
                  >
                    <v-icon>mdi-cart</v-icon>
                  </v-btn>
                </v-badge>
              </template>
              <v-card
                class="white"
                width="400"
              >
                <div class="d-flex pa-5">
                  <div class="flex-grow-1">
                    Cart
                    {{ cart.items.length ? `(${cart.items.length} items)` : '' }}
                  </div>
                  <div
                    class="blue--text"
                    @click="$router.push({name: 'marketplace-cart'})"
                  >
                    Go to cart
                    <v-icon color="blue">
                      mdi-chevron-right
                    </v-icon>
                  </div>
                </div>
                <div class="flex-grow-1 grey lighten-4 px-5 vertical-auto">
                  <div
                    v-for="(item, i) in cart.items"
                    :key="i"
                    class="d-flex py-5"
                  >
                    <v-avatar
                      class="rounded-lg"
                      color="grey"
                      size="50"
                      tile
                    />
                    <div class="flex-grow pl-5">
                      <div>{{ item.title || 'No name provided' }}</div>
                      <div>$ {{ item.price || 'FREE' }}</div>
                    </div>
                  </div>
                </div>
                <div class="px-10 py-3">
                  <v-btn
                    block
                    color="indigo accent-4"
                    dark
                    large
                  >
                    Checkout
                  </v-btn>
                </div>
              </v-card>
            </v-menu>
          </div>
          <v-text-field
            :class="themeCommon.content"
            hide-details
            label="Search"
            rounded
          />
        </div>
        <v-divider class="mt-5" />
      </div>
      <div class="align-center d-flex pt-3 px-5">
        <v-switch
          v-model="$vuetify.theme.dark"
          inset
          label="DARK MODE"
        />
        <v-spacer />
        <v-icon v-if="$vuetify.theme.dark">
          mdi-weather-night
        </v-icon>
        <v-icon v-else>
          mdi-weather-sunny
        </v-icon>
      </div>
      <v-list
        :class="themeCommon.background"
        nav
      >
        <v-list-item @click="$router.push({name: &quot;marketplace-home&quot;})">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content
            class="font-weight-medium"
            :class="themeCommon.text"
          >
            Home
          </v-list-item-content>
        </v-list-item>
        <template>
          <v-list-group prepend-icon="mdi-shape">
            <v-list-item-title
              slot="activator"
              class="font-weight-medium"
              :class="themeCommon.text"
            >
              Categories
            </v-list-item-title>
            <v-list :class="themeCommon.background">
              <v-list-item
                v-for="(category, i) in categories"
                :key="i"
                class="px-10"
              >
                <v-list-item-content :class="themeCommon.text">
                  {{ category.name }}  ({{ category.qty || 0 }})
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-list-group>
        </template>
      </v-list>
    </v-container>
    <v-dialog
      v-model="addDialog"
      content-class="rounded-dialog"
      width="500"
      @close="() => addDialog = false"
    >
      <app-creation-form />
    </v-dialog>
  </div>
</template>

<style>
.rounded-dialog {
    border-radius: 15px;
}
</style>

<script>
import AppCreationForm from './components/forms/AppCreation'
import { mapState } from 'vuex'

export default {
  name: 'Sidebar',
  components: { AppCreationForm },
  computed: {
    ...mapState('NewMarketplace', ['cart']),
    themeCommon() {
      return {
        text: this.$vuetify.theme.dark ? 'white--text' : '',
        content: this.$vuetify.theme.dark ? 'bg-content' : 'grey lighten-2',
        background: this.$vuetify.theme.dark ? 'bg-container' : 'white'
      }
    }
  },
  async mounted() {
    this.$store.dispatch('CoreTaxonomy/listTaxonomyTerms', {
      type: 'naic',
      parentId: null
    }).then(res => console.log(res))

    await this.$store.dispatch('CoreTaxonomy/fetchTaxonomyTerms', {
      parentId: 18
    }).then(res => this.categories = res[0].children)
  },
  methods: {
    turnDarkOn() {}
  },
  data: () => ({
    addDialog: false,
    items: [],
    categories: [],
    sections: [
      {
        icon: 'mdi-shape',
        title: 'Categories',
        sub: [
          {
            icon: 'mdi-file-document',
            name: 'Forms'
          },
          {
            icon: 'mdi-account-group',
            name: 'Teams'
          },
          {
            icon: 'bx-group',
            name: 'Capital'
          },
          {
            icon: 'bx-group',
            name: 'Marketing'
          },
          {
            icon: 'bx-group',
            name: 'Facilities'
          },
          {
            icon: 'bx-group',
            name: 'Information Technology'
          }
        ]
      }
    ]
  })
}
</script>
