<template>
  <div
    :ref="ganttName"
    style="height:500px;"
  />
</template>

<script>
import 'dhtmlx-gantt'
export default {
  props: {
    ganttName: {
      type: [String, Number],
      default: 'gantt'
    },
    tasks: {
      type: Object,
      default() {
        return { data: [], links: [] }
      }
    }
  },
  mounted() {
    this.forceReload()
  },
  methods: {
    $_initGanttEvents: function () {
      if (gantt.$_eventsInitialized) {
        return
      }

      gantt.attachEvent('onAfterTaskDrag', (id, link, e) => {
        const event = gantt.getEvent(id)
        // console.log(event.start_date,9);
        this.$emit('on-after-task-drag', id, link, e)
      })

      // Block default modal
      gantt.showLightbox = id => {
        const task = gantt.getTask(id)
        this.$emit('task-selected', task)
        return
      }

      gantt.attachEvent('onTaskSelected', id => {
        const task = gantt.getTask(id)
        this.$emit('task-selected', task)
      })

      gantt.attachEvent('onTaskSelected', id => {
        const task = gantt.getTask(id)
        this.$emit('task-selected', task)
      })

      gantt.attachEvent('onAfterTaskAdd', (id, task) => {
        this.$emit('task-updated', id, 'inserted', task)
        task.progress = task.progress || 0
        if (gantt.getSelectedId() == id) {
          this.$emit('task-selected', task)
        }
      })
      gantt.attachEvent('onAfterTaskUpdate', (id, task) => {
        this.$emit('task-updated', id, 'updated', task)
      })
      gantt.attachEvent('onAfterTaskDelete', id => {
        this.$emit('task-updated', id, 'deleted')
        if (!gantt.getSelectedId()) {
          this.$emit('task-selected', null)
        }
      })
      gantt.attachEvent('onAfterLinkAdd', (id, link) => {
        this.$emit('link-updated', id, 'inserted', link)
      })
      gantt.attachEvent('onAfterLinkUpdate', (id, link) => {
        this.$emit('link-updated', id, 'updated', link)
      })
      gantt.attachEvent('onAfterLinkDelete', (id, link) => {
        this.$emit('link-updated', id, 'deleted')
      })


      gantt.config.drag_move = false
      gantt.config.drag_resize = false
      gantt.config.drag_links = false
      gantt.config.drag_progress = false

      gantt.config.duration_unit = 'month'
      // gantt.config.duration_step = 1;
      gantt.config.fit_tasks = true
      gantt.config.full_day = true
      gantt.config.scale_unit = 'month'
      gantt.config.date_scale = '%M,%Y'


      gantt.attachEvent('onError', function (errorMessage) {
        // debugger;
        console.log(errorMessage)
        return true
      })

      gantt.config.columns = [
        { name: 'text', label: 'Date', tree: true, width: 250, resize: true }
      ]
      gantt.config.layout = {
        // css: "gantt_container",
        cols: [{
          width: 250,
          min_width: 300,
          rows: [
            {
              view: 'grid',
              scrollX: 'gridScroll',
              scrollable: true,
              scrollY: 'scrollVer'
            },
            { view: 'scrollbar', id: 'gridScroll', group: 'horizontal' }
          ]
        },
        { resizer: true, width: 1 },
        {
          rows: [
            { view: 'timeline', scrollX: 'scrollHor', scrollY: 'scrollVer' },
            { view: 'scrollbar', id: 'scrollHor', group: 'horizontal' }
          ]
        },
        { view: 'scrollbar', id: 'scrollVer' }
        ]
      }

      gantt.$_eventsInitialized = true
    },
    forceReload() {
      this.$_initGanttEvents()
      const auxGantt = gantt
      auxGantt.init(this.$refs[this.ganttName])
      auxGantt.parse(this.tasks)
    }
  }
}
</script>


<style lang="scss">
@import "~dhtmlx-gantt/codebase/dhtmlxgantt.css";
@import "~dhtmlx-gantt/codebase/skins/dhtmlxgantt_material.css";

.data-loading {
  position: absolute;
  z-index: 99;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
}

.slider-config-width {
  position: relative;
  width: 915px;
  margin-bottom: -35px;
  z-index: 2;
}

.gantt_grid_data .gantt_row.odd,
.gantt_grid_data .gantt_row {
  box-shadow: inset 0 -1px 0 0 rgba(100, 121, 143, 0.122);
}

.gantt_grid_data .gantt_row.odd:hover,
.gantt_grid_data .gantt_row:hover {
  background-color: transparent;
  box-shadow: inset 1px 0 0 #dadce0, inset -1px 0 0 #dadce0,
    0 1px 2px 0 rgba(60, 64, 67, 0.3),
    inset 0 -1px 0 0 rgba(100, 121, 143, 0.122);
  z-index: 1;
}

.gantt_grid_editor_placeholder {
  background: #fff;
  z-index: 2;
}

.task-modal-overlay {
  width: 500%;
  height: 500%;
  position: absolute;
  top: -50%;
  left: -50%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 99;
}

.custom-modal {
  overflow-y: auto;
  position: absolute;
  top: 0;
  left: 0;
  background: rgb(255, 255, 255);
  z-index: 999;
  width: 100%;
  height: 90vh;
  max-height: 90%;
}

.status-circle {
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
}

.task-milestone {
  background: url(/sites/all/themes/m6connect/images/milestone-diamond.png)
    no-repeat center center;
  background-size: contain;
  z-index: 2;
  border: none;

  .gantt_task_content {
    color: transparent;
    padding: 0;
    z-index: 2;
  }
  .gantt_side_content.gantt_left {
    color: #265a7f;
    font-weight: bold;
    z-index: 1;
  }

  &.gantt_task_line {
    .gantt_task_drag,
    .gantt_task_progress_drag {
      display: none !important;
    }
  }
}

.task-activity {
  border: 2px solid #404040;
  border-bottom: none;
  border-radius: 0;
  background-color: transparent;

  .gantt_task_content {
    color: #404040;
  }
}
.task-red {
  background-color: #fb3b3b;
  .gantt_task_progress {
    background: #e50505;
  }
}
.task-green {
  background-color: #66cd00;
  .gantt_task_progress {
    background: #0e8f67;
  }
}
.task-yellow {
  background-color: #ffda3e;
  .gantt_task_progress {
    background: #d8ad00;
  }
}

.fiscal-year {
  background: #f4f7f4 !important;
}

.no-fiscal-year {
  background: none !important;
}

.gantt_grid .gantt_grid_scale .gantt_grid_head_cell {
  font-size: 12px;
}
.gantt_modal_box {
  width: 270px;
}
.gantt_marker {
  width: 1px;

  .gantt_marker_content {
    top: 5%;
    transition: all 0.25s;

    &:hover {
      transform: scale(1.6);
      opacity: 1;
    }
  }

  &.milestone {
    background-color: #404040;

    .gantt_marker_content {
      top: 20%;
      background: green;
      opacity: 0.7;
      max-width: 22px;
      transform: rotate(45deg) scale(1);
      overflow: hidden;
      color: green;
      margin-left: 5px;

      &:hover {
        animation: milestone 0.4s forwards;
      }
    }
  }
}

@keyframes milestone {
  50% {
    transform: rotate(0) scale(1.2);
    max-width: 22px;
    color: green;
  }
  100% {
    transform: rotate(0) scale(1.4);
    color: #fff;
    max-width: 800px;
  }
}
</style>
