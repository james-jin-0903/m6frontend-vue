<template>
  <section class="v-card">
    <v-card>
      <!-- Header -->
      <div class="mx-auto w-main-content">
        <v-row align="center">
          <v-col cols="auto">
            <img
              alt=""
              class="mr-1 rounded"
              height="140"
              src="https://unsplash.it/140/140"
            >
          </v-col>

          <v-col>
            <h1 class="mb-1 text-h4">
              Demolition Company
            </h1>
            <span
              class="font-weight-light text-body-1"
            >Lorem ipsum dolor sit amet consectetur adipisicing elit</span>
          </v-col>

          <v-col cols="auto">
            <v-btn
              class="ml-auto px-12 py-7"
              color="primary"
              depressed
              x-large
            >
              Connect
            </v-btn>
          </v-col>
        </v-row>

        <v-divider class="pb-2" />

        <!-- Tabs -->
        <v-tabs
          v-model="tab"
          class="tabstesting"
        >
          <v-tabs-slider color="primary" />

          <div
            class="d-flex justify-center w-full"
            flat
          >
            <v-tab
              class="font-weight-black text-body-1 text-capitalize"
              :class="{ 'blue--text text--darken-2': tab === 0 }"
            >
              Home
            </v-tab>
            <v-tab
              class="font-weight-black text-body-1 text-capitalize"
              :class="{ 'blue--text text--darken-2': tab === 1 }"
            >
              People
            </v-tab>
            <v-tab
              class="font-weight-black text-body-1 text-capitalize"
              :class="{ 'blue--text text--darken-2': tab === 2 }"
            >
              Topics
            </v-tab>
            <v-tab
              class="font-weight-black text-body-1 text-capitalize"
              :class="{ 'blue--text text--darken-2': tab === 3 }"
            >
              Store
            </v-tab>

            <v-btn
              class="align-self-center ml-auto"
              color="#D5D5D5"
              depressed
              small
            >
              Follow
            </v-btn>

            <v-btn
              class="align-self-center ml-1"
              color="#D5D5D5"
              depressed
              small
            >
              Message
            </v-btn>

            <v-btn
              class="align-self-center ml-1"
              color="#D5D5D5"
              depressed
              small
            >
              <v-icon dark>
                mdi-magnify
              </v-icon>
            </v-btn>
          </div>
        </v-tabs>
      </div>
    </v-card>

    <!-- Home -->
    <div
      v-if="tab === 0"
      class="mx-auto pt-2 w-main-content"
    >
      <v-row>
        <v-col
          class="pr-10"
          cols="5"
        >
          <v-card class="rounded-card">
            <v-card-title>
              Information
            </v-card-title>

            <v-card-text class="text-body-1">
              <div class="align-center d-flex py-2">
                <v-icon class="mr-2">
                  mdi-clipboard-outline
                </v-icon>
                <span>
                  We are a <strong>Bondable</strong> and
                  <strong>Insured</strong> company
                </span>
              </div>
              <div class="align-center d-flex py-2">
                <v-icon class="mr-2">
                  mdi-earth
                </v-icon>
                <span>
                  www.sample.com
                </span>
              </div>
              <div class="align-center d-flex py-2">
                <v-icon class="mr-2">
                  mdi-phone
                </v-icon>
                <span>
                  (915) 889 - 1234
                </span>
              </div>
              <div class="align-center d-flex py-2">
                <v-icon class="mr-2">
                  mdi-mail
                </v-icon>
                <span>
                  contact@sample.com
                </span>
              </div>
              <div class="align-center d-flex py-2">
                <v-icon class="mr-2">
                  mdi-linkedin
                </v-icon>
                <span>
                  demo-crew
                </span>
              </div>
              <!-- Expanded -->
              <v-expand-transition>
                <div
                  v-show="expand"
                  class="mx-auto"
                  height="100"
                  width="100"
                >
                  <div class="align-center d-flex py-2">
                    <v-icon class="mr-2">
                      mdi-instagram
                    </v-icon>
                    <span>
                      demo-crew
                    </span>
                  </div>
                  <div class="align-center d-flex py-2">
                    <v-icon class="mr-2">
                      mdi-twitter
                    </v-icon>
                    <span>
                      demo-crew
                    </span>
                  </div>
                  <div class="align-center d-flex py-2">
                    <v-icon class="mr-2">
                      mdi-facebook
                    </v-icon>
                    <span>
                      demo-crew
                    </span>
                  </div>
                </div>
              </v-expand-transition>

              <a
                class="d-block mt-3 text-body-2"
                @click="expand = !expand"
              >{{
                expand ? 'Show less' : 'Show more'
              }}</a>
            </v-card-text>
          </v-card>

          <v-card class="mt-5 rounded-card">
            <v-card-title>Locations</v-card-title>
            <v-card-text>
              <div class="align-center d-flex py-2">
                <v-icon class="mr-2">
                  mdi-map
                </v-icon>
                <span>
                  El Pasco, TX
                </span>
              </div>
              <div class="align-center d-flex py-2">
                <v-icon class="mr-2">
                  mdi-map
                </v-icon>
                <span>
                  El Pasco, TX
                </span>
              </div>

              <!-- Operate -->
              <h3 class="mb-1 mt-5">
                Where we operate
              </h3>
              <div class="align-center d-flex py-2">
                <v-icon class="mr-2">
                  mdi-map
                </v-icon>
                <span>
                  El Pasco, TX
                </span>
              </div>
              <div class="align-center d-flex py-2">
                <v-icon class="mr-2">
                  mdi-map
                </v-icon>
                <span>
                  El Pasco, TX
                </span>
              </div>
            </v-card-text>
          </v-card>

          <v-card class="mt-5 rounded-card">
            <v-card-title>Classification Codes</v-card-title>
            <v-card-text>
              <div class="d-flex mb-2">
                <span
                  class="font-weight-bold text-body-1 type-tile"
                >Type:</span>
                <span
                  class="text-body-1"
                >Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </span>
              </div>
              <div class="d-flex mb-2">
                <span
                  class="font-weight-bold text-body-1 type-tile"
                >Type:</span>
                <span
                  class="text-body-1"
                >Lorem ipsum dolor sit amet consectetur
                </span>
              </div>
              <div class="d-flex mb-2">
                <span
                  class="font-weight-bold text-body-1 type-tile"
                >Type:</span>
                <span
                  class="text-body-1"
                >Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  consectetur adipisicing elit.
                </span>
              </div>
            </v-card-text>
          </v-card>

          <v-card class="mt-5 pb-5 rounded-card">
            <v-card-title>Who we are</v-card-title>
            <v-card-text>
              <div class="align-start d-flex mb-2">
                <v-icon class="mr-2">
                  mdi-alert-circle-outline
                </v-icon>
                <span
                  class="text-body-1"
                >Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  consectetur adipisicing elit.
                </span>
              </div>

              <div class="align-start d-flex mb-2">
                <v-icon class="mr-2">
                  mdi-alert-circle-outline
                </v-icon>
                <span
                  class="text-body-1"
                >Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  consectetur adipisicing elit.
                </span>
              </div>

              <div class="align-start d-flex mb-2">
                <v-icon class="mr-2">
                  mdi-account-multiple-outline
                </v-icon>
                <span
                  class="text-body-1"
                >Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  consectetur adipisicing elit.
                </span>
              </div>

              <div class="d-flex justify-center mt-8">
                <img
                  class="mx-3"
                  src="https://unsplash.it/60/60"
                >
                <img
                  class="mx-3"
                  src="https://unsplash.it/60/60"
                >
                <img
                  class="mx-3"
                  src="https://unsplash.it/60/60"
                >
                <img
                  class="mx-3"
                  src="https://unsplash.it/60/60"
                >
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          class="pl-8"
          cols="7"
        >
          <header-component
            class="card-custom-shadow h-auto mb-4 rounded"
            hasslot
            :info="{ title: 'Create Post', icon: '' }"
          >
            <template v-slot:select>
              <v-menu
                bottom
                offset-y
                transition="slide-y-transition"
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    class="capitalize font-weight-bold mb-0 pl-1 purple--text px-0 text--darken-1 transparent"
                    elevation="0"
                    v-on="on"
                  >
                    Project
                    <v-icon class="blue--text text--darken-3">
                      mdi-chevron-down
                    </v-icon>
                  </v-btn>
                </template>
                <template>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-title class="grey--text">
                        text
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </template>
              </v-menu>
            </template>
            <template #input>
              <img
                alt="username"
                class="mr-1 rounded-circle"
                height="40"
                src="https://unsplash.it/40/40"
                width="40"
              >
              <v-row>
                <v-col
                  class="pt-0"
                  cols="12"
                >
                  <v-text-field
                    class="font-weight-bold ml-1"
                    dense
                    flat
                    height="40"
                    hide-details
                    :label="`Whats on your mind, john?`"
                    rounded
                    single-line
                    solo-inverted
                  >
                    <template #append>
                      <v-row
                        class="align-center d-flex"
                        style="min-width: 108px;"
                      >
                        <v-menu
                          bottom
                          offset-y
                          open-on-hover
                        >
                          <template #activator="{ on, attrs }">
                            <v-btn
                              v-bind="attrs"
                              color="primary"
                              dark
                              icon
                              v-on="on"
                            >
                              <v-icon>mdi-file-plus-outline</v-icon>
                            </v-btn>
                          </template>
                        </v-menu>
                        <v-menu
                          v-model="menu"
                          bottom
                          :close-on-content-click="false"
                          offset-y
                        >
                          <template #activator="{ on, attrs }">
                            <v-btn
                              v-bind="attrs"
                              color="primary"
                              dark
                              icon
                              v-on="on"
                            >
                              <v-icon>mdi-apps</v-icon>
                            </v-btn>
                          </template>
                          <v-list width="256">
                            <v-list-item>
                              <v-select
                                item-text="title"
                                item-value="id"
                                label="Application"
                              >
                                <template
                                  slot="selection"
                                  slot-scope="data"
                                >
                                  <!-- HTML that describe how select should render selected items -->
                                  <div>
                                    www
                                  </div>
                                </template>
                              </v-select>
                            </v-list-item>
                            <v-list-item>
                              <v-select
                                height="50"
                                :item-value="Object"
                                label="Record"
                              >
                                <template
                                  slot="selection"
                                  slot-scope="data"
                                >
                                  <!-- HTML that describe how select should render selected items -->
                                  <div>awdawd</div>
                                </template>
                                <template
                                  slot="item"
                                  slot-scope="data"
                                >
                                  <!-- HTML that describe how select should render items when the select is open -->
                                  <div>awdawd</div>
                                </template>
                              </v-select>
                            </v-list-item>
                            <v-list-item>
                              <v-select
                                height="50"
                                item-text="label"
                                :item-value="Object"
                                label="Panel"
                              >
                                <template
                                  slot="selection"
                                  slot-scope="data"
                                >
                                  <!-- HTML that describe how select should render selected items -->
                                  <div>wadawd</div>
                                </template>
                              </v-select>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                        <v-btn icon>
                          <v-icon class="blue--text text--lighten-1">
                            mdi-send
                          </v-icon>
                        </v-btn>
                      </v-row>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </template>
          </header-component>

          <posts-list />
        </v-col>
      </v-row>
    </div>

    <!-- Action buttons -->
    <!-- <v-btn color="primary" fab dark bottom right fixed>
      <v-icon>mdi-chat-outline</v-icon>
    </v-btn> -->

    <div class="fab-button fab-button--right">
      <v-badge
        color="cyan"
        offset-x="18"
        offset-y="18"
        overlap
      >
        <template v-slot:badge>
          6
        </template>

        <v-btn
          color="primary"
          fab
        >
          <v-icon>mdi-chat-outline</v-icon>
        </v-btn>
      </v-badge>
    </div>

    <div class="fab-button fab-button--left">
      <v-badge
        color="primary"
        offset-x="18"
        offset-y="18"
        overlap
      >
        <template v-slot:badge>
          14
        </template>

        <v-btn
          color="secondary"
          fab
        >
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </v-badge>
    </div>
  </section>
</template>

<script>
import HeaderComponent from '@/components/Home/HeaderComponent'
import PostsList from '@/components/Home/SocialMedia/PostsList'

export default {
  name: 'CompanyProfilePage',
  components: {
    HeaderComponent,
    PostsList
  },
  data: () => ({
    tab: null,
    menu: false,
    expand: false
  })
}
</script>

<style lang="scss" scoped>
.type-tile {
  min-width: 60px;
}

.fab-button {
  position: fixed;
  bottom: 20px;

  &--right {
    right: 20px;
  }

  &--left {
    top: 300px;
    left: 20px;
  }
}

.rounded-card {
  border-radius: 5px !important;
}
</style>
