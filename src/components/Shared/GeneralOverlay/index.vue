<template>
  <div
    opacity="0"
    class="d-flex align-end w-viewport h-viewport fixed left-0 top-0"
    style="pointer-events: none;">
    <v-row no-gutters>
      <div
        v-for="(i,index) of 2" :key="index" class="preview-container py-0 px-0 mx-2">
        <div v-if="Object.keys(active_previews[index]).length != 0" class>
          <!-- <idle-records v-if="get_idle_previews().length != 0" class="pointer-auto" /> -->
          <div
              v-if="active_previews[index]" style="height: 78vh;"
              class="white elevation-3 py-0 px-0" >
            <preview-Selector
              class="h-full pointer-auto"
              :data="active_previews[index]"></preview-Selector>
          </div>
        </div>
        <div v-if="get_idle_previews().length > 0">
          <v-col cols="12"
            v-if="index == 0 ? getHiddenState1() : getHiddenState2()"
            class="px-1 pb-0 panels-preview relative  pointer-auto"
            :id="'idle-'+index"
            style="
              top: 70vh;
              height: 78vh;">
            <idle-records :index="index" />
          </v-col>
        </div>
      </div>
    </v-row>
  </div>
</template>

<script>
import PreviewSelector from "@/components/Shared/PreviewSelector";
import IdleRecords from "../../RecordMode/IdleRecords"
import _ from "lodash";

// Store
import { mapActions, mapGetters } from "vuex";

export default {
  name: "general-overlay",
  components: {
    PreviewSelector,
    IdleRecords
  },
  methods: {
    ...mapActions("GeneralListModule", ["remove_from_idle", "show_preview_of_idle"]),
    ...mapActions("NavigationStack", ["hiddenRecord"]),
    removeFromIdle(id) {
      this.remove_from_idle(id);
    },
  },
  computed: {
    ...mapGetters("GeneralListModule", [
      "get_active_previews",
      "get_idle_previews",
    ]),
    ...mapGetters("NavigationStack",["getHiddenState1", "getHiddenState2"]),
    active_previews() {
      let ap = this.get_active_previews();
      return ap;
    },
    idle_previews() {
      let ip = _.reverse(this.get_idle_previews());
      return ip;
    },
  },
};
</script>

<style lang="scss">
.panels-preview > div {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.preview-container {
  width: 460px;
}
</style>