<template>
  <v-container class="max-w-none px-0 py-0 rounded-lg">
    <v-card
      id="create"
      class="rounded-lg"
    >
      <v-speed-dial
        v-model="fab"
        direction="bottom"
        left
        open-on-hover
        top
        transition="slide-x-transition"
      >
        <template v-slot:activator>
          <v-btn
            v-model="fab"
            color="blue darken-2"
            dark
            fab
          >
            <v-icon v-if="fab">
              mdi-close
            </v-icon>
            <v-icon v-else>
              mdi-animation
            </v-icon>
          </v-btn>
        </template>
        <v-tooltip
          v-for="(action, index) of header"
          :key="index"
          right
        >
          <template v-slot:activator="{ on, attrs }">
            <v-avatar
              v-bind="attrs"
              class="cursorhover mx-1 my-2"
              color="grey lighten-2"
              size="36"
              v-on="on"
              @click="moveComponent(index)"
            >
              <v-icon>{{ action.icon }}</v-icon>
            </v-avatar>
          </template>
          <span class="white--text">{{ action.name }}</span>
        </v-tooltip>
      </v-speed-dial>
    </v-card>
    <record-body
      v-if="project['app_type'] !== 'dynamic_app'"
      :component="project"
      :name="getName()"
      :nav-commp="component"
      :sort-array="header"
      @items="setState"
    />
    <component
      :is="builder"
      class="w-full"
      :class="indexBuilder !== 0 ? 'px-2' : 'px-0'"
      :index="indexBuilder >= 0 ? indexBuilder : null"
      :info="project"
    />
  </v-container>
</template>

<script>
import RecordBody from './RecordBody'

export default {
  name: 'NavigationBar',
  components: {
    RecordBody
  },
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    NavWidgets: {
      type: Array,
      default: () => ([])
    },
    project: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    indexBuilder: null,
    builder: null,
    header: [],
    component: [],
    currentState: 0,
    fab: false
  }),
  watch: {
    // Clean the component
    NavWidgets: function () {
      this.component = []
      this.header = []
      this.NavWidgets.forEach(action => this.header.push(action))
      this.NavWidgets.forEach(action => this.component.push(action.component))

      this.indexBuilder = this.header[0]['index'] >= 0 ? this.header[0]['index'] : null
      this.builder = this.header[0]['component'] ? this.header[0]['component'] : null
    }
  },
  methods: {
    // The global function to make scroll and order components
    async moveComponent(index) {
      if (this.project['app_type'] === 'dynamic_app') {
        this.indexBuilder = this.header[index]['index'] >= 0 ? this.header[index]['index'] : null
        this.builder = this.header[index]['component'] ? this.header[index]['component'] : null
      } else {
        await this.orderComponents(index)
        const cont = this.currentState
        if (document.getElementById(this.getName() + '-' + index).classList.contains('container')) {
          this.scrolling(document.getElementById(this.getName() + '-' + index))
        } else {
          this.scrolling(document.getElementById(this.getName() + '-' + cont))
        }
      }
    },
    // Order the components in order of call
    orderComponents(index) {
      const cont = this.currentState
      if (index > this.currentState) {
        const state = this.header[index]
        this.header.splice(index, 1)
        this.header.splice(cont, 0, state)
        return new Promise(resolve => setTimeout(() => {
          resolve('¡Éxito!')
        }, 10))
      }
    },
    // Get the component name
    getName() {
      const name = this.project.title.split(' ')
      return name.join('-')
    },
    // Action of scroll
    scrolling(element) {
      const speed = 300
      return new Promise(resolve => {
        element.scrollIntoView({ block: 'start', behavior: 'smooth' })
        setTimeout(() => {
          resolve('¡Éxito!')
        }, speed)
      })
    },
    // Update the state at the list of widgets
    setState(index) {
      this.currentState = index
    }
  }
}
</script>

<style>
  .max-height-container{
    overflow: auto;
    white-space: nowrap;
  }
  /* This is for documentation purposes and will not be needed in your application */
  .v-speed-dial {
    position: absolute;
  }

  .v-btn--floating {
    position: relative;
  }
</style>
