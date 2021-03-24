<template>
  <div
    class="app-slider-wrapper elevation-0 full-screen px-0"
  >
    <div class="records-search-container rounded">
      <v-card color="white pa-5 elevation-0">
        <div>
          <v-text-field
            v-model="searchInput"
            background-color="grey lighten-2"
            class="max-w-content mx-auto pt-0 px-4 py-2 records-search-box text-capitalize"
            dense
            flat
            height="40"
            hide-details
            :label="placeHolder"
            rounded
            single-line
            @keyup="changeEvent"
          />
        </div>
        <div>
          <general-list-drop-down
            v-model="tableView"
            :current-app="appListSorted[selected]"
            @input="validateView"
            @recordsToShow="recordsToShow"
          />
        </div>
      </v-card>
    </div>

    <div
      v-if="showApps || (!showApps && !showFiles)"
      class="in-here min-h-sidepanel relative"
    >
      <video
        v-show="!showFilesSlot"
        id="bgvid"
        autoplay
        class="h-full header-background rounded-lg w-full"
        loop
        muted
        playsinline
        poster="@/assets/header-background.png"
      >
        <source
          src="@/assets/header-background-video.webm"
          type="video/webm"
        >
      </video>
      <div
        v-if="showGrid"
        :class="'app-slider-grid vertical-scroll'"
      >
        <div
          v-for="(item, index) in appListSorted"
          :key="index"
          class="pa-1"
          :class="selected > -1 ? (selected === index ? 'carousel-cell selected-item flicky-item' : 'carousel-cell flicky-item unselected-item') : 'carousel-cell flicky-item'"
          :style="`z-index:${appListSorted.length - index}`"
          @click="changingApps(item, index)"
          @mouseleave="setHoverText('')"
          @mouseover="setHoverText(item.text)"
        >
          <v-hover
            v-slot="{ hover }"
          >
            <div class="relative">
              <div class="item-img-container">
                <div
                  ref="itemImgs"
                  class="item-img"
                  :class="selected > -1 ? (selected === index ? 'item-img img-shadow' : 'item-img') : 'item-img'"
                  :style="{backgroundColor: getBGColor(item)}"
                >
                  <v-img
                    v-if="item.iconLink && item.iconLink !== ''"
                    alt="m6app_img"
                    class="image-icon"
                    :src="item.iconLink"
                  />
                  <template v-else-if="item.metadata">
                    <template v-if="item.metadata.appIcon">
                      <v-icon
                        :color="item.metadata.appIcon.iconColor"
                        :size="iconWidth"
                      >
                        {{ item.metadata.appIcon.icon }}
                      </v-icon>
                    </template>
                    <v-icon
                      v-else
                      :size="iconWidth"
                    >
                      mdi-store
                    </v-icon>
                  </template>
                  <v-icon
                    v-else
                    :size="iconWidth"
                  >
                    mdi-store
                  </v-icon>
                </div>
                <v-btn
                  v-if="item.id && hover"
                  class="edit-app-button grey--text"
                  icon
                  @click="editApp(item)"
                >
                  <v-icon>
                    mdi-pencil-outline
                  </v-icon>
                </v-btn>
              </div>
              <div
                class="mt-2 w-full z-10"
                :class="hover ? 'help-text__span absolute' : 'item-text'"
              >
                <p class="ma-0 pa-0 white--text">
                  {{ item.text }}
                </p>
              </div>
            </div>
          </v-hover>
        </div>
      </div>
      <div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import GeneralListDropDown from '@/components/Apps/GeneralListDropDown'
import { mapActions } from 'vuex'

export default {
  name: 'RecordListHeader',
  components: {
    GeneralListDropDown
  },
  props: {
    appList: {
      type: Array,
      default: () => []
    },
    showFilterBtn: {
      type: Boolean,
      default: false
    },
    currentAppID: {
      type: Number,
      default: 0
    },
    showApps: {
      type: Boolean,
      default: true
    },
    showFiles: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    viconWidth: 0,
    searchInput: '',
    tableView: {},
    placeHolder: 'Search all Apps & Files',
    flickityOptions: {
      cellAlign: 'left',
      prevNextButtons: true,
      pageDots: false,
      wrapAround: true,
      contain: true,
      percentPosition: true,
      draggable: false
    },
    hoveredText: '',
    showGrid: false,
    showFilesSlot: true,
    selected: -1,
    collapseAppPanel: true,
    appListSorted: [],
    appSortAsc: false
  }),
  computed: {
    iconWidth: function () {
      return this.viconWidth
    }
  },
  watch: {
    tableView() {
      this.$emit('tableViewChange', this.tableView)
    },
    selected() {
      this.placeHolder = 'Search all Apps & Files'
    },
    appList() {
      this.sortAppList()
      // console.log('a', this.appList)
    }
  },
  mounted() {
    const _this = this
    this.sortAppList()
    setTimeout(function () {
      if (typeof this.$refs !== 'undefined' && typeof this.$refs.itemImgs !== 'undefined' && this.$refs.itemImgs.length > 0) {
        _this.updateViconWidth(this.$refs.itemImgs[0].offsetWidth)
      } else {
        _this.updateViconWidth(60)
      }
    }, 1000)

    const allAppsItem = this.appList.find(row => row.text === 'All Apps')
    const allAppsIndex = this.appList.findIndex(row => row.text === 'All Apps')

    if (typeof allAppsItem !== 'undefined' && allAppsIndex !== -1) {
      this.changingApps(allAppsItem, allAppsIndex)
    }
  },
  methods: {
    ...mapActions('AppFeedView', ['getApp']),
    validateView(a) {
      this.showGrid = !(a.key === 'table' || a.key === 'files' || a.key === 'app_feed')
      if (a.key === 'files' || a.key === 'app_feed') {
        this.showFilesSlot = true
      } else {
        this.showFilesSlot = false
      }
    },
    changeEvent() {
      this.$emit('changeEvent', this.searchInput)
    },
    changingApps(item, index) {
      this.appPanelCollapseToggle(true)
      this.selected = index
      this.getApp(item.id)
      this.$emit('changingApps', item)
    },
    getBGColor(item) {
      if (item.metadata) {
        if (item.metadata.appIcon) return item.metadata.appIcon.background
      }
      return item.bgColor
    },
    updateViconWidth(number) {
      this.viconWidth = number
    },
    editApp(appItem) {
      this.$router.push(`/dev/${appItem.id}`)
    },
    appPanelCollapseToggle(status = null) {
      this.collapseAppPanel = status === true ? status : !this.collapseAppPanel
      this.$emit('collapseAppPanelEvent', this.collapseAppPanel)
    },
    clearFilter() {
      this.$emit('clearFilter')
    },
    recordsToShow(data) {
      this.$emit('recordsToShow', data)
    },
    sortAppList(type = 'asc') {
      const _this = this
      if (type === 'asc') {
        this.appSortAsc = true
      } else {
        this.appSortAsc = false
      }

      this.appListSorted = [...this.appList]
      this.appListSorted.sort(function (a, b) {
        if (!_this.appSortAsc) {
          return b.text.localeCompare(a.text)
        } else {
          return a.text.localeCompare(b.text)
        }
      })
    },
    setHoverText(text) {
      this.hoveredText = text
    }
  }
}
</script>

<style lang="scss">
.header-background {
  object-fit: cover;
  width: 60vw;
  height: 10vh;
  position: absolute;
  top: 0;
  left: 0;
  filter: brightness(.7)
}
.header-title {
  font-size: 1.6em;
  line-height: 1;
}
.flicky-item {
  width: calc(20% - 20px);
  height: auto;
  // margin-right: 20px;
  text-align: center;
  opacity: 0.8;

}
.flicky-item{
  &:hover {
    cursor: pointer;
  }

  &.unselected-item {
    &:hover{
      .item-img-container{
        padding-top: 100%;
        width: 100%;
      }

    }
    .item-img-container{
      padding-top: 80%;
      width: 80%;
    }
  }
}
.item-img-container {
  position: relative;
  padding-top: 100%;
  width: 100%;
  transition: .3s;
  margin: auto
}
.item-img {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.image-icon {
  border-radius: 15px;
  height: 100%;
  width: 100%;
}
.flickity-slider {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
/* no circle */
.flickity-button {
  background: transparent;
}
/* big previous & next buttons */
.flickity-prev-next-button {
  width: 100px;
  height: 100px;
}
/* icon color */
.flickity-button-icon {
  fill: white;
}
/* hide disabled button */
.flickity-button:disabled {
  display: none;
}
.flickity-prev-next-button {
  .flickity-button-icon {
    top: 0;
    width: 50%;
    height: 50%;
    left: 25%;
  }
}
.flickity-prev-next-button:hover {
  background: transparent;
}
.flickity-prev-next-button:hover {
  background: transparent;
}
.flickity-prev-next-button.previous {
  left: -70px;
}
.flickity-prev-next-button.next {
  right: -70px;
}
.custom-field-input-field {
  background-color: white;
  color: grey;
}
.img-shadow {
  box-shadow: 0px 0px 4px 4px #ffffff7a;
}
.edit-app-button {
  color: white !important;
  position: absolute !important;
  right: -10px;
  top: -10px;
}
.min-h-sidepanel{
  min-height: calc(100vh - 240px);
}
.records-search-box {
  &.v-text-field{
    margin-top: 0!important;
    margin-left: 10px;
    margin-right: 10px;
    &.v-input--dense:not(.v-text-field--outlined) input {
      padding: 8px 0 8px;
    }
    .v-btn {
      height: 40px;
    }
  }
}
@media(max-width: 599px) {
  .flicky-item {
    width: calc(4 * 100% / 12 - 10px);
    height: auto;
    // margin-right: 10px;
    text-align: center;
  }
  .records-search-box {
    &.v-text-field{
      margin-top: 0!important;
      padding-bottom: 6px!important;
      margin-left: 5px;
      margin-right: 5px;
      }
  }
  .records-search-container{
    margin-left:-52px;
    margin-right:-52px;
  }
}
.app-slider-wrapper{
  position: relative;
}
.app-slider-wrapper .app-slider--collapse-button{
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translate(20%, 50%)
}
.app-slider-wrapper .app-slider-grid{
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 20px;
}

.app-slider-wrapper .app-slider-grid:focus {
  outline: none;
}

.app-slider-grid .flickity-viewport {
  height: fit-content !important;
  width: 100%;

  .flickity-slider {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    transform: none !important;
    align-items: center;

    .flicky-item {
      position: relative !important;
      left: 0 !important;
    }
  }
}

@media only screen and (max-device-width: 600px) {
  .app-slider-wrapper .app-slider--collapse-button{
    transform: translate(8px, 50%)
  }
  .app-slider-wrapper.full-screen .app-slider--collapse-button{
    position: fixed;
    bottom: 90px;
    z-index: 100;
  }
}

.app-slider-wrapper{
  background-image: 'linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) )';
  background-position: 'center center';
  background-size: 'cover';
  margin-bottom: '8px!important';
  position: 'relative';
  overflow: '';
}

.app-slider-wrapper .in-here .item-text{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hovered-text {
  min-height: 30px;
  height: auto;
  position: relative;
  p {
    font-size: 25px;
    color: white;
    margin: 0;
    padding: 0 15px;
  }
}

</style>
