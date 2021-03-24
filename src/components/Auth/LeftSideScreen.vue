<template>
  <div
    class="d-flex height-width-100 justify-center left-background text-center"
    :style="'flex-direction:column;'"
  >
    <!-- <div class="pt-5 d-flex justify-center" >
            <span class="display-1 white--text" >
              {{ $h.dg(currentCompany, 'name', '') || $t('leftSideScreen.title') }}
              </span>
        </div>
        <div class="d-flex justify-center" >
            <span class="body-2 white--text" >
              {{  $t('leftSideScreen.subtitle') }}
            </span>
        </div> -->
    <div class="d-flex justify-center mb-4">
      <template v-if="checkChildrensOmaha">
        <img
          alt="Company Logo"
          class="mt-5"
          src="@/assets/Childrens_Hospital.jpeg"
          width="350"
        >
      </template>
      <template v-else>
        <img
          v-if="$h.dg(currentCompany, 'logo', '').length"
          alt="Company Logo"
          class="mt-5 size"
          :src="$h.dg(currentCompany, 'logo', '')"
        >

        <plan-organize-icon
          v-else
          class="size"
        />
      </template>
    </div>

    <!-- <div class="flex-cols mt-10" v-if="$h.dg(currentCompany, 'id', '').length" > -->
    <!-- <plan-organize-icon class="plan-organize-icon" /> -->
    <div class="flex-cols mt-16">
      <div
        class="justify-center w-full"
        :style="'height:3rem;'"
      >
        <img
          alt="M6Connect"
          src="@/assets/M6-Block-white-transparent.png"
          :style="'height:100%;'"
        >
      </div>

      <span class="body-2 white--text">
        {{ $t('leftSideScreen.subtitle') }}
      </span>
    </div>
  </div>
</template>

<script>
import PlanOrganizeIcon from '@/assets/svgs/PlanOrganizeIcon'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'LeftSideScreen',
  components: {
    PlanOrganizeIcon
  },

  computed: {
    ...mapState('Companies', {
      companiesList: 'list',
      currentCompany: 'currentCompany'
    }),
    checkChildrensOmaha() {
      return window.location.host === 'childrensomaha.m6connect.com'
    }
  },

  watch: {
    companiesList(val) {
      const selectedCompany = val.find(v => v.id === process.env.VUE_APP_CURRENT_COMPANY_ID)
      if (selectedCompany) this.setCurrentCompany(selectedCompany) // this.currentCompany = { ...selectedCompany }
    }
  },

  methods: {
    ...mapMutations('Companies', {
      setCurrentCompany: 'setCurrentCompany'
    })
  }

}
</script>

<style lang="scss" scoped >
.height-width-100 {
  height: 100%;
  width: 100%;
}

.left-background {
  background-color: #04314e;
}

.size {
  width: 70%;
  height: auto;
}

.left-img {
  height: 35rem;
  width: auto;
}

.flex-cols {
  display: flex;
  display: -webkit-flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: flex-end;
}

.plan-organize-icon {
  height: 3rem;
}
</style>
