
<template>
  <div style="inline-flex">
    <kanban-board
      :blocks="rapids"
      class="lists w-100"
      :stages="stages"
      style="height: 100%; margin-top:5px;"
      @update-block="updateBlock"
    >
      <div
        v-for="stage in stages"
        :key="stage"
        :slot="stage"
        class="w-5"
      >
        <h5>
          {{ stage }}
        </h5>
      </div>
      <div
        v-for="task in rapids"
        :key="task.id"
        :slot="task.id"
        class="flex-column-space-between item-blocks pa-4"
        @click="taskEditModal(task)"
      >
        <div class="flex-row-space-between h-card-half">
          <h5>{{ task.title }}</h5>
          <img class="dev-pic" v-if="task.rapid_developer&&transformedUsers[task.rapid_developer[0]].profilePic" :src="task.rapid_developer&&transformedUsers[task.rapid_developer[0]].profilePic" alt="rapid developer" />
          <img class="dev-pic" v-else src="@/assets/default_user.png" alt="default user picture" />
        </div>
        <div class="flex-row-space-between h-card-half">
          <span class="grey--text">{{ processDueDate(task.rapid_due_date) }}</span>
          <v-chip color="blue lighten-5">
            <span class="circle mr-2" />
            <b class="blue--text">{{ task.status }}</b>
          </v-chip>
        </div>
      </div>
    </kanban-board>
  </div>
</template>
/

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
  data() {
    return {
      rapids: [],
      stages: [ 'Backlog', 'Documentation', 'ToDo', 'In Progress', 'Rework', 'Pull Request', 'Review', 'UAT', 'Done' ],
      stageItems: [],
      priorities: [
        {
          name: 'Highest',
          icon: 'arrow_upward',
          color: '#F44336'
        }, {
          name: 'High',
          icon: 'arrow_upward',
          color: '#FF9800'
        },
        {
          name: 'Medium',
          icon: 'arrow_upward',
          color: '#FFEB3B'
        }, {
          name: 'Low',
          icon: 'arrow_downward',
          color: '#4CAF50'
        },
        { name: 'Lowest', icon: 'arrow_downward', color: '#8BC34A' }
      ],
      monthPartials: {
        "01": "Jan",
        "02": "Feb",
        "03": "Mar",
        "04": "Abr",
        "05": "May",
        "06": "Jun",
        "07": "Jul",
        "08": "Aug",
        "09": "Sep",
        "10": "Oct",
        "11": "Nov",
        "12": "Dec"
      }
    }
  },
  methods: {
    ...mapActions('RapidTicket', {
      getRapidList: 'getList'
    }),

    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),

    processDueDate(orig) {
      if (orig)
      {
        const partial = orig.split(' ')[0]
        const [ year, month, date ] = partial.split('-')
        return this.monthPartials[month] + ' ' + date
      }
      else 
      {
        return null
      }
    },

    updateBlock: function (id, status) {
    },
    getBlockNums: function (stage) {
    },
    getInitials: function (item) {
    },
    taskEditModal: function (task) {
    },
    detect(prop, task) {
    },
    getPriorityColor(priority) {
    }
  },

  computed: {
    ...mapGetters('Companies', {
      users: 'getCurrentCompanyUsers'
    }), 
    transformedUsers() {
      let res = {}
      this.users.map( u => res[u.user.id] = u.user )
      return res 
    }
  },

  async mounted() {
    try {
      this.rapids = await this.getRapidList()
    } catch(e) {
    }
  }
}
</script>

<style lang="scss">
.inline-flex {
  display: inline-flex;
}
.w-100 {
  width: 120vw;
}
.w-5 {
  width: 5rem !important;
}
.float {
    position:absolute;
    z-index:99;
    width:500px;
}
  $on-hold: #FB7D44;
  $in-progress: #2A92BF;
  $needs-review: #F4CE46;
  $approved: #00B961;
  $merged: #00A970;
  * {
    box-sizing: border-box;
  }
  .drag-column {

    .drag-column-header {
      padding: 0;

      div {
        width: 100%;
        h2 > a {
          float: right;
        }
      }
    }
    .drag-column-footer > div {
        margin-left: 10px;
        a {
            text-decoration: none;
            color: white;
            &:hover {
                text-decoration: underline;
            }
        }
    }
    &-on-hold {
      .drag-column-header,
      .is-moved,
      .drag-options {
        background: $on-hold;
      }
    }
    &-in-progress {
      .drag-column-header,
      .is-moved,
      .drag-options {
        background: $in-progress;
      }
    }
    &-needs-review {
      .drag-column-header,
      .is-moved,
      .drag-options{
        background: $needs-review;
      }
    }
    &-approved {
      .drag-column-header,
      .is-moved,
      .drag-options {
        background: $approved;
      }
    }
    &-merged{
      .drag-column-header,
      .is-moved,
      .drag-options {
        background: $merged;
      }
    }
  }
  .section {
    padding: 20px;
    text-align: center;
    a {
      color: white;
      text-decoration: none;
      font-weight: 300;
    }
    h4 {
      font-weight: 400;
      a {
        font-weight: 600;
      }
    }
  }
    .lists ul{
      height: 100%; width: 100%;
    }


  	/* Some Sass variables */
    // Layout
    $appbar-height: 70px;
    $navbar-height: 0px;
    $list-width: 300px;
    $gap: 10px;
    $scrollbar-thickness: 17px;
    $list-header-height: 36px;
    $list-footer-height: 36px;
    // Misc
    $list-border-radius: 0px;
    $card-border-radius: 0px;
    // Colors
    $board-bg-color: #E3E3E3;
    $appbar-bg-color: #ECECEC;
    $list-bg-color: #ECECEC;

    .ui {
      height: 100vh;

      display: grid;
      grid-template-rows: $appbar-height $navbar-height 1fr;
      //grid-template-columns: 100%;

      background-color: $board-bg-color;
      color: #eee;
    }

    .navbar {
      padding-left: $gap;
      display: flex;
      align-items: center;
      &.app {
        background-color: $appbar-bg-color;
        font-size: 1.5rem;
      }
      &.board {
        font-size: 1.1rem;
      }
    }

    .lists {
      display: flex;
      //overflow-x: auto;
      //width: 100%; // This is needed for FF < 54
      > * {
        flex: 0 0 auto; // 'rigid' lists
        margin-left: $gap;
      }
      &::after {
        content: '';
        flex: 0 0 $gap;
      }
    }

    .list {
      width: $list-width;
      height: calc(100% - #{$gap} - #{$scrollbar-thickness});

      > * {
        background-color: $list-bg-color;
        color: #333;

        padding: 0 $gap;
      }

      header {
        line-height: $list-header-height;
        font-size: 16px;
        font-weight: bold;
        border-top-left-radius: $list-border-radius;
        border-top-right-radius: $list-border-radius;
      }

      footer {
        line-height: $list-footer-height;
        border-bottom-left-radius: $list-border-radius;
        border-bottom-right-radius: $list-border-radius;
        color: #888;
      }

      ul {
        // list-style: none;
        // margin: 0;

        // max-height: calc(100% - #{$list-header-height} - #{$list-footer-height});
        // overflow-y: auto;
        width: 200vw !important;

        li {
          background-color: #fff;
          padding: $gap;
          &:not(:last-child) {
            margin-bottom: $gap;
          }

          border-radius: $card-border-radius;
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);

          img {
            display: block;
            width: calc(100% + 2 * #{$gap});
            margin: -$gap 0 $gap (-$gap);
            border-top-left-radius: $card-border-radius;
            border-top-right-radius: $card-border-radius;
          }
        }
      }
    }


/* experiment from here on */
 @import '../../assets/kanban.scss';
  .drag-container {
    max-width: 100vw;
    overflow: auto;
    height: 45vh !important;

    .drag-list {
      width: 187.5rem;
    }

    .drag-column {
      background: #eee;
      border-radius: 0px;
      padding-bottom: 40px;

      .drag-column-header {
        padding-left: 20px;
        padding-right: 20px;
        h2 {
          font-size: 1.1rem;
          color: #878787;;
        }
      }

      .drag-inner-list {
        .drag-item {
          padding: 0px;
          background: #FEFEFE;
          border: none;
          border-radius: 0px;
          opacity: 1;
          color: #404040;
          width: 20rem !important;
          height: 9rem;

          &.is-moving {
            -webkit-transform: scale(1.1);
            transform: scale(1.1);
            background: #0c75c6;
            color: #FFF;
            opacity: .2;
          }

          .task-top {
            .labels {
              width: 50%;
              display: inline-block;

              .task-label-indicator {
                height: 8px;
                border-radius: 0px;

                &.low {
                  background: #61ff69;
                }
                &.normal {
                  background: #265a7f;
                }
                &.high {
                  background: #ffe061;
                }
                &.critical {
                  background: #ff6961;
                }
              }
            }

            .actions {
              width: 50%;
              display: inline-block;
              color: #AEAEAE;

              .fa {
                padding-left: 8px;
                cursor: pointer;

                &:hover {
                  color: #0f75bc;
                }
              }
            }
          }

          .task-title {
            padding: 12px 0;

            h5 {
              margin: 0;
            }
          }

          .task-bottom {
            color: #AAA;

            div {
              display: inline-block;
              width: 33%;

              .fa {
                padding-left: 6px;
              }
            }

            .info {
            }
            .actions {
              .fa {
                cursor: pointer;

                &:hover {
                  color: #0f75bc;
                }
              }
            }
            .assignment {
              width: 34%;
            }
          }
        }
      }
    }
  }

  .drag-item.gu-mirror {
    background: #FFF !important;
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
    border: 1px solid #DDD;
    .actions {
      display: none;
    }
  }

  .dropdown-menu {
    a:hover {
      background: #C0C0C0;
    }
  }

.item-blocks {
  width: 20rem;
  height: 100%;
  display: inline-block;
  cursor: pointer;
  display: flex
}

.flex-row-space-between {
  width: 95%;
  display: flex;
  display: -webkit-flex;
  flex-direction: row;
  justify-content: space-between;
}

.flex-column-space-between {
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: space-between;
}

.dev-pic {
  width: auto;
  height: 2.3rem;
  border-radius: 50%;
}

.circle {
  height: 10px;
  width: 10px;
  background-color: #2196F3;
  border-radius: 50%;
  display: inline-block;
}
</style>
