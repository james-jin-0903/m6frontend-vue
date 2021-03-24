<template>
  <div
    id="gantt-container"
    class="gantt-container"
  >
    <v-row
      class="gantt-header"
    >
      <v-col
        class="align-center gantt-header-item shrink"
        @click="closeAll"
      >
        <v-icon>
          mdi-arrow-expand-up
        </v-icon>
        {{ $t('cpm.forecasting.cashflow.collapseAll') }}
      </v-col>
      <v-col
        class="align-center gantt-header-item shrink"
        @click="openAll"
      >
        <v-icon>
          mdi-arrow-expand-down
        </v-icon>
        {{ $t('cpm.forecasting.cashflow.expandAll') }}
      </v-col>
      <v-col
        class="align-center gantt-header-item shrink"
        @click="zoomOut"
      >
        <v-icon>
          mdi-magnify-plus-outline
        </v-icon>
        {{ $t('cpm.forecasting.cashflow.zoomIn') }}
      </v-col>
      <v-col
        class="align-center gantt-header-item shrink"
        @click="zoomIn"
      >
        <v-icon>
          mdi-magnify-minus-outline
        </v-icon>
        {{ $t('cpm.forecasting.cashflow.zoomOut') }}
      </v-col>
      <v-spacer />
      <v-col
        class="align-center gantt-header-item shrink"
        @click="exportTo('excel')"
      >
        <v-icon>
          mdi-border-all
        </v-icon>
        {{ $t('cpm.forecasting.cashflow.exportTo', { fileFormat: 'Excel' }) }}
      </v-col>
      <v-col
        class="align-center gantt-header-item shrink"
        @click="exportTo('png')"
      >
        <v-icon>
          mdi-image
        </v-icon>
        {{ $t('cpm.forecasting.cashflow.exportTo', { fileFormat: 'PNG' }) }}
      </v-col>
      <v-col
        class="align-center gantt-header-item shrink"
        @click="exportTo('pdf')"
      >
        <v-icon>
          mdi-file-pdf-box
        </v-icon>
        {{ $t('cpm.forecasting.cashflow.exportTo', { fileFormat: 'PDF' }) }}
      </v-col>
      <v-spacer />
      <v-col
        class="align-center gantt-header-item shrink"
        @click="refreshData"
      >
        <v-icon>
          mdi-refresh
        </v-icon>
        {{ $t('cpm.forecasting.cashflow.refresh') }}
      </v-col>
      <v-col
        class="align-center gantt-header-item shrink"
        @click="showProjectsSelection = !showProjectsSelection"
      >
        <v-icon>
          mdi-plus
        </v-icon>
        {{ $tc('cpm.forecasting.cashflow.selectProject', 2) }}
      </v-col>
      <v-col
        class="align-center gantt-header-item shrink"
        @click="toggleFullScreen"
      >
        <v-icon>
          mdi-fullscreen
        </v-icon>
        {{ $t('cpm.forecasting.cashflow.fullscreen') }}
      </v-col>
    </v-row>

    <v-row
      class="fill-height"
    >
      <v-col
        class="pa-0"
        cols="12"
      >
        <div
          ref="gantt"
          class="gantt"
        />
      </v-col>
    </v-row>
    <forecasting-projects
      v-if="showProjectsSelection"
      @close="showProjectsSelection = false"
    />
  </div>
</template>

<script>
import { gantt } from 'dhtmlx-gantt'
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ForecastingProjects from './ForecastingProjects'
export default {
  name: 'ForecastingGantt',

  components: {
    ForecastingProjects
  },

  data() {
    return {
      dataProcessorsAreSet: false,
      selectedFiscalYears: ['fy21'],
      showProjectsSelection: true
    }
  },

  computed: {
    ...mapGetters('cpm/planned/cashflow', [
      'budgetAndCumulativeTasks',
      'tasks',
      'reloadGantt',
      'reloadBudgetAndCumulativeTasks',
      'projectIds',
      'tasksToDeleteInGantt'
    ])
  },

  watch: {
    reloadGantt() {
      this.loadGantt()
    },
    reloadBudgetAndCumulativeTasks() {
      this.tasksToDeleteInGantt.map(task => {
        if (gantt.isTaskExists(task.id)) {
          gantt.deleteTask(task.id)
        }
      })

      this.setTasksToDeleteInGantt([])

      this.budgetAndCumulativeTasks.map(task => {
        if (gantt.isTaskExists(task.id)) {
          const ganttTask = gantt.getTask(task.id)
          ganttTask.budget = this.$h.dg(task, 'budget', 0)
        } else {
          gantt.addTask(task)
        }
      })
      gantt.refreshData()
    }
  },

  mounted: function () {
    const onlineExportScript = document.createElement('script')
    onlineExportScript.setAttribute('src', 'https://export.dhtmlx.com/gantt/api.js?v=7.0.9')
    document.head.appendChild(onlineExportScript)
  },

  methods: {
    ...mapActions('cpm/planned/cashflow', [
      'createTask',
      'updateTask',
      'deleteTask',
      'createLink',
      'updateLink',
      'deleteLink',
      'getProjectsTasksAndLinks'
    ]),
    ...mapMutations('cpm/planned/cashflow', [
      'updateTaskLocally',
      'setTasksToDeleteInGantt'
    ]),
    loadGantt() {
      gantt.clearAll()

      this.setPluggins()
      this.allowSort()
      // To define grid, gantt and resource views
      this.setLayout()
      this.enableAutoSchedule()
      this.setOtherSettings()
      this.setScales()
      this.setTooltipText()
      this.setGanttEvents()
      this.moveChildrenTasksInSyncWithParent()
      this.setTemplates()
      this.setCustomTaskClass()
      this.setFullScreen()
      this.setWheelZoom()

      gantt.init(this.$refs.gantt)
      // const tasks = { ...this.tasks }
      gantt.parse(this.tasks)
      gantt.refreshData()
      this.createDataProcessors()
    },
    setPluggins() {
      gantt.plugins({
        auto_scheduling: true,
        click_drag: true,
        fullscreen: true,
        multiselect: true,
        tooltip: true,
        undo: true
      })
    },
    allowSort() {
      gantt.config.sort = true
    },
    setLayout() {
      // MAIN GRID
      gantt.config.columns = [
        {
          name: 'text',
          label: 'Task name',
          tree: true,
          width: 100,
          resize: true
        },
        {
          name: 'start_date',
          label: 'Start Date',
          width: 100,
          resize: true
        },
        {
          name: 'end_date',
          label: 'End Date',
          width: 70,
          resize: true
        },
        {
          name: 'add',
          width: 44,
          resize: true
        }
      ]

      // RIGHT GRID
      const secondGridColumns = {
        columns: [
          {
            name: 'percentage',
            label: '%',
            width: 30,
            template: task => Math.floor(task.progress * 100) + '%'
          },
          {
            name: 'budget',
            width: 80,
            label: 'Budget',
            template: task => {
              let budgetPercentage = 0
              let budget = 0

              if (task.type === 'project') {
                budgetPercentage = Math.floor(this.$h.dg(task, 'progress', 0) * 100)
                budget = this.$h.dg(task, 'budget', 0) * (budgetPercentage / 100)
              } else {
                budgetPercentage = Math.floor(this.$h.dg(task, 'progress', 0) * 100)
                budget = this.$h.dg(task, 'fiscalYearBudget', 0) * (budgetPercentage / 100)
              }

              return this.$options.filters.currency(budget)
            }
          }
        ]
      }

      gantt.config.layout = {
        css: 'gantt_container',
        rows: [
          {
            cols: [
              {
                view: 'grid',
                width: 320,
                scrollY: 'scrollVer'
              },
              {
                resizer: true,
                width: 1
              },
              {
                view: 'timeline',
                scrollX: 'scrollHor',
                scrollY: 'scrollVer'
              },
              {
                resizer: true,
                width: 1
              },
              {
                view: 'grid',
                width: 140,
                bind: 'task',
                scrollY: 'scrollVer',
                config: secondGridColumns
              },
              {
                view: 'scrollbar',
                id: 'scrollVer'
              }
            ]
          },
          {
            view: 'scrollbar',
            id: 'scrollHor',
            height: 20
          }
        ]
      }
    },
    enableAutoSchedule() {
      gantt.config.auto_scheduling = true
      gantt.config.auto_scheduling_strict = true
      gantt.config.auto_scheduling_compatibility = true
    },
    setOtherSettings() {
      gantt.config.xml_date = '%Y-%m-%d %H:%i'
      gantt.config.multiselect = true
      gantt.config.open_split_tasks = true
      gantt.locale.labels.section_priority = 'Priority'
      gantt.config.autosize = 'y'
    },
    quarterLabel(date) {
      const month = date.getMonth()
      let q_num

      if (month >= 9) {
        q_num = 4
      } else if (month >= 6) {
        q_num = 3
      } else if (month >= 3) {
        q_num = 2
      } else {
        q_num = 1
      }

      return 'Q' + q_num
    },
    setScales() {
      gantt.config.min_column_width = 8
      gantt.config.scale_height = 90

      gantt.config.scales = [
        { unit: 'year', step: 1, format: '%Y' },
        { unit: 'quarter', step: 1, format: this.quarterLabel },
        { unit: 'month', step: 1, format: '%M' }
      ]
    },
    setTooltipText() {
      gantt.templates.tooltip_text = (start, end, task) => {
        const budget = this.$h.dg(task, 'budget', 0)
        return '<b>Task:</b> ' + task.text +
                  '<br/><b>start_date:</b> ' + this.$moment(task.start_date).format('MM/DD/YYYY') +
                  '<br/><b>end_date:</b> ' + this.$moment(task.end_date).format('MM/DD/YYYY') +
                  '<br/><b>budget:</b> ' + this.$options.filters.currency(budget)
      }
    },
    setGanttEvents() {
      gantt.attachEvent('onAfterTaskUpdate', (id, item) => {
        gantt.autoSchedule()
      })
    },
    moveChildrenTasksInSyncWithParent() {
      // MOVE CHILDREN TASKS IN SYNC WITH PARENT
      gantt.eachSuccessor = function (callback, root) {
        if (!this.isTaskExists(root)) {
          return
        }

        // remember tasks we've already iterated in order to avoid infinite loops
        const traversedTasks = arguments[2] || {}
        if (traversedTasks[root]) {
          return
        }
        traversedTasks[root] = true

        const rootTask = this.getTask(root)
        const links = rootTask.$source
        if (links) {
          for (let i = 0; i < links.length; i++) {
            const link = this.getLink(links[i])
            if (this.isTaskExists(link.target) && !traversedTasks[link.target]) {
              callback.call(this, this.getTask(link.target))

              // iterate the whole branch, not only first-level dependencies
              this.eachSuccessor(callback, link.target, traversedTasks)
            }
          }
        }
      }

      gantt.attachEvent('onTaskDrag', function (id, mode, task, original) {
        const modes = gantt.config.drag_mode
        if (mode === modes.move) {
          const diff = task.start_date - original.start_date
          gantt.eachSuccessor(function (child) {
            child.start_date = new Date(+child.start_date + diff)
            child.end_date = new Date(+child.end_date + diff)
            gantt.refreshTask(child.id, true)
          }, id)
        }
        return true
      })

      gantt.attachEvent('onAfterTaskDrag', function (id, mode, e) {
        const modes = gantt.config.drag_mode
        if (mode === modes.move) {
          gantt.eachSuccessor(function (child) {
            child.start_date = gantt.roundDate(child.start_date)
            child.end_date = gantt.calculateEndDate(child.start_date, child.duration)
            gantt.updateTask(child.id)
          }, id)
        }
      })
    },
    setTemplates() {
      gantt.templates.task_text = (start, end, task) => {
        if (task.showBudgetInsteadOfTitle) {
          const budget = this.$h.dg(task, 'budget', 0)

          return this.$options.filters.currency(budget)
        }
        return task.text
      }

      gantt.templates.rightside_text = (start, end, task) => {
        if (task.type === 'project') {
          if (Math.floor(task.progress * 100) > 100) return 'Over Budget'
          else if (Math.floor(task.progress * 100) < 100) return 'Under Budget'
        }
      }

      gantt.templates.grid_header_class = (columnName, column) => {
        if (columnName === 'add') {
          return 'header-add-button'
        }
      }
    },
    setCustomTaskClass() {
      gantt.templates.task_class = (start, end, task) => {
        if (task.type === 'project' && Math.floor(task.progress * 100) !== 100) {
          return 'no_drag_progress out-budget'
        } else if (task.type === 'project') {
          return 'no_drag_progress'
        }
      }
    },
    setFullScreen() {
      gantt.ext.fullscreen.getFullscreenElement = function () {
        return document.getElementById('dashboard-container')
      }
    },
    setWheelZoom() {
      gantt.config.min_column_width = 80
      const zoomConfig = {
        minColumnWidth: 80,
        maxColumnWidth: 150,
        levels: [
          [
            { unit: 'year', step: 1, format: '%Y' },
            { unit: 'quarter', step: 1, format: this.quarterLabel },
            { unit: 'month', step: 1, format: '%M' }
          ],
          [
            { unit: 'quarter', step: 1, format: this.quarterLabel }
          ],
          [
            { unit: 'month', step: 1, format: '%M' }
          ],
          [
            { unit: 'month', format: '%M %Y', step: 1 },
            { unit: 'day', format: '%d %M', step: 2 }
          ],
          [
            { unit: 'day', format: '%d %M', step: 1 }
          ]
        ],
        useKey: 'ctrlKey',
        trigger: 'wheel',
        element: function () {
          return gantt.$root.querySelector('.gantt_task')
        }
      }
      gantt.ext.zoom.init(zoomConfig)
    },
    createDataProcessors() {
      if (this.dataProcessorsAreSet) return
      gantt.createDataProcessor((entity, action, data, id) => {
        if (data.type === 'project' || data.isBudgetsByMonthTask || data.isCumulativeTask) return
        let projectId = ''

        if (entity === 'task') {
          projectId = data.projectId || this.getGrandParent(data.parent)
        } else if (entity === 'link') {
          const task = gantt.getTask(data.source)

          projectId = task.projectId || this.getGrandParent(data.parent)
        }

        switch (action) {
          case 'create':
            const projectTask = gantt.getTask(projectId)
            if (entity === 'task') {
              const taskIndex = gantt.getTaskIndex(id)
              this.createTask({
                task: data,
                project: projectTask,
                taskIndex
              })
                .then(newTaskId => {
                  gantt.changeTaskId(id, newTaskId)
                })
            } else if (entity === 'link') {
              this.createLink({ link: data, project: projectTask })
                .then(newLinkId => {
                  gantt.changeLinkId(id, newLinkId)
                })
            }
            break
          case 'update':
            if (entity === 'task') {
              const oldTaskProgress = this.getOldTaskProgress(id)
              const newTaskProgress = this.$h.dg(data, 'progress', 0)
              if (oldTaskProgress !== newTaskProgress) {
                const projectTask = gantt.getTask(projectId)
                projectTask.progress = projectTask.progress + (newTaskProgress - oldTaskProgress)
                gantt.updateTask(projectId)
                this.updateTaskLocally({
                  id,
                  field: 'progress',
                  value: newTaskProgress
                })
              }

              this.updateTask({ task: data, projectId })
                .then(udpatedTask => {
                  const projectTask = gantt.getTask(projectId)

                  gantt.getTask(id).forecast = this.$h.dg(udpatedTask, 'forecast')
                  gantt.getTask(id).budget = this.$h.dg(udpatedTask, 'budget', 0)

                  projectTask.budgetsByTasks[id] = this.$h.dg(udpatedTask, 'forecast.totals.budget', 0)
                  if (!isNaN(this.$h.dg(projectTask, 'forecast.totalTasksBudget'))) {
                    projectTask.forecast.totalTasksBudget = this.getProjectBudget(projectTask.budgetsByTasks)
                  }
                  gantt.refreshData()
                })
            } else if (entity === 'link') {
              this.updateLink({ link: data, projectId })
            }
            break
          case 'delete':
            if (entity === 'task') {
              this.deleteTask({ task: data, projectId })
                .then(() => {
                  const projectTask = gantt.getTask(projectId)
                  projectTask.progress = projectTask.progress - this.$h.dg(data, 'progress', 0)
                  if (this.$h.dg(projectTask.budgetsByTasks, id)) {
                    delete projectTask.budgetsByTasks[id]

                    projectTask.forecast.totalTasksBudget = this.getProjectBudget(projectTask.budgetsByTasks)
                    gantt.refreshData()
                  }
                })
            } else if (entity === 'link') {
              this.deleteLink({ link: data, projectId })
            }
        }
      })
      this.dataProcessorsAreSet = true
    },
    getProjectBudget(budgetsByTasks) {
      return Object.values(budgetsByTasks).reduce((total, numb) => total + numb)
    },
    getGrandParent(childId) {
      const parentId = gantt.getParent(childId)

      return (parentId) ? this.getGrandParent(parentId) : (childId)
    },
    getOldTaskProgress(id) {
      const task = this.tasks.data.find(task => task.id === id)

      return this.$h.dg(task, 'progress', 0)
    },
    closeAll() {
      gantt.eachTask(task => {
        task.$open = false
      })
      gantt.render()
    },

    openAll() {
      gantt.eachTask(task => {
        task.$open = true
      })
      gantt.render()
    },
    toggleFullScreen() {
      gantt.ext.fullscreen.toggle()
      gantt.render()
    },
    exportTo(fileType) {
      const data = gantt.serialize().data

      switch (fileType) {
        case 'excel':
          gantt.exportToExcel({
            data
          })
          break
        case 'png':
          gantt.exportToPNG()
          break
        case 'pdf':
          gantt.exportToPDF()
          break
        default:
          break
      }
    },
    zoomIn() {
      gantt.ext.zoom.zoomIn()
    },
    zoomOut() {
      gantt.ext.zoom.zoomOut()
    },
    refreshData() {
      this.getProjectsTasksAndLinks({ projectIds: this.projectIds })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~dhtmlx-gantt/codebase/dhtmlxgantt.css';

  .gantt {
    height: 100%;
  }

  .gantt-container {
    display: block;
  }

  .gantt-header {
    min-height: 40px;
    background-color: white;
  }

  .gantt-header-item {
    display: flex;
    cursor: pointer;

    &:hover {
      background-color: #A9A9A9;
    }
  }
</style>

<style>
  .gantt_task_progress {
		text-align: left !important;
		padding-left: 10px !important;
		box-sizing: border-box !important;
		color: white !important;
		font-weight: bold !important;
	}
	.no_drag_progress .gantt_task_progress_drag{
     display:none !important;
  }
  .out-budget {
    border: 2px solid red !important;
		color: red !important;
		background-color: red !important;
  }

  .out-budget .gantt_task_progress {
		background: #ff5956 !important;
	}

	.header-add-button {
    opacity: 0 !important;
    pointer-events: none !important;
	}
</style>
