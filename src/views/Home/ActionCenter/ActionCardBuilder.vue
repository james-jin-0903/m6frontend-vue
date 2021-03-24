<template>
  <v-card>
    <v-card-title
      class="badge-title py-0"
    >
      <v-img
        slot="prepend-inner"
        class="ico-position"
        max-width="40"
        src="@/assets/actioncenterIcons/Tasks.svg"
      />
      <v-btn
        absolute
        class="btn-badge-close"
        icon
        right
        @click="$emit('close')"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>

      <div class="d-inline-block title title-position">
        <div class="group-in-border-style">
          <v-text-field
            v-model="title"
            class="card-title-style px-2 py-0 w-full"
            dark
          />
          <v-btn
            absolute
            icon
            text
          >
            <v-icon>
              mdi-edit
            </v-icon>
          </v-btn>
        </div>
      </div>
      <v-avatar
        class="avatar d-inline-block title-position"
      >
        <v-img
          v-if="currentUser.avatar"
          class="mt-1"
          height="40"
          :src="currentUser.avatar"
          width="40"
        />
        <v-icon
          v-else
          class="icon-profile"
          color="#f1f1f1"
        >
          mdi-account
        </v-icon>
      </v-avatar>
    </v-card-title>
    <v-card-text class="mt-4">
      <v-autocomplete
        v-model="people.invite"
        chips
        class="inputs"
        :filter="filterPeople"
        item-text="id"
        item-value="id"
        :items="companyUsers"
        multiple
      >
        <div slot="label">
          <v-img
            class="d-inline-block"
            height="15"
            src="@/assets/actioncenterIcons/Invite-People.svg"
            width="15"
          />
          <span class="d-inline-block ml-2">Select people</span>
        </div>
        <template
          slot="item"
          slot-scope="data"
        >
          <v-img
            v-if="data.item.avatar"
            class="inline rounded-xl"

            height="18"
            :src="data.item.avatar"
            width="18"
          />
          <v-icon
            v-else
            size="18"
          >
            mdi-account
          </v-icon>
          <span class="ml-3">
            {{ `${data.item.firstName} ${data.item.lastName}` }}
          </span>
        </template>
        <template
          slot="selection"
          slot-scope="data"
        >
          <div class="people-background">
            <v-img
              v-if="data.item.avatar"
              class="inline rounded-xl"

              height="18"
              :src="data.item.avatar"
              width="18"
            />
            <v-icon
              v-else
              size="18"
            >
              mdi-account
            </v-icon>
            <span
              class="name-people"
              :class="data.item.avatar? 'icon-align':''"
            >
              {{ data.item.firstName }}
            </span>
          </div>
        </template>
      </v-autocomplete>
      <treeselect
        v-if="typeof hasDefault !== 'string'"
        v-model="item.type"
        :multiple="false"
        :normalizer="normalizer"
        :options="options.type"
        placeholder="Search actions"
      />
      <v-datetime-picker
        v-model="item.datatime"
        label="Select due date"
        time-format="HH:mm:ss"
      />
      <v-textarea
        v-model="description"
        class="inputs mt-2"
        dense
        label="Description"
        rows="3"
        :style="`font-size: 1.5rem;`"
      />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        block
        color="#FF9539"
        elevation="0"
        style="color: #FFFF; background-color:#FF9539 !important; border-color:white !important;"
        @click="save"
      >
        Submit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
/* eslint-disable camelcase */
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ActionCardBuilder',
  props: {
    pTitle: {
      type: String,
      default: ''
    },
    submitStatus: {
      type: Boolean,
      default: false
    },
    startDate: {
      type: String,
      default: ''
    },
    actionType: {
      type: String,
      default: 'task'
    },
    pDescription: {
      type: String,
      default: ''
    },
    postId: {
      type: String,
      default: null
    },
    post: {
      type: Object,
      default: null
    },
    hasDefault: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      title: '',
      description: '',
      options: {
        type: []
      },
      people: {},
      item: {},
      dates: [
        {
          name: 'Date',
          value: new Date(),
          path: '032-calendar-8',
          type: 'date'
        },
        {
          name: 'Task',
          value: '',
          path: '014-audit',
          type: 'date'
        },
        {
          name: 'Meeting',
          value: '',
          path: '012-calendar-19',
          type: 'date'
        },
        {
          name: 'Appointment',
          value: '',
          path: '017-calendar-16',
          type: 'date'
        },
        {
          name: 'Location',
          value: '',
          path: '017-pin-8',
          type: 'input'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('Companies', { companyUsers: 'getCurrentCompanyUsers' }),
    ...mapGetters('Auth', { currentUser: 'getUser' })
  },
  watch: {
    pTitle(val) {
      this.title = val
    },
    pDescription(val) {
      this.description = val
    },
    submitStatus(val) {
      if (val) {
        this.save()
      }
    }
  },
  mounted() {
    this.title = this.pTitle
    this.description = this.pDescription
    this.selects({ params: ['wo_request_type'], nesting: 1 }).then(res => {
      const temp = []
      const unselected = {
        app_type: 'department',
        department: null,
        department_id: null,
        field: 'wo_request_type',
        id: 0,
        parent_id: null,
        value: ' ',
        children: []
      }
      res['data']['wo_request_type'].map(row => {
        if (row.department) {
          const check = temp.find(t => t.department_id === row.department.id)
          if (check) {
            temp.map(t => {
              if (t.department_id === row.department.id) {
                row.parent_id = -row.department.id
                t.children = [...t.children, row]
              }
            })
          } else {
            temp.push({
              app_type: 'department',
              department: null,
              department_id: row.department.id,
              field: 'wo_request_type',
              id: row.department.id,
              parent_id: null,
              value: row['department']['title'],
              children: [{ ...row, parent_id: -row.department.id }]
            })
          }
        } else {
          unselected.children.push({
            ...row,
            parent_id: 0
          })
        }
      })
      this.options['type'] = [...temp, unselected]
    })
  },
  methods: {
    ...mapActions('ITAppsModule', { selects: 'get_all_selects' }),
    ...mapActions('WorkOrderModule', { postAction: 'postAction' }),
    filterPeople(item, search) {
      return item.firstName.toLowerCase().includes(search.toLowerCase()) || item.lastName.toLowerCase().includes(search.toLowerCase())
    },
    iconPath(name) {
      return require(`@/assets/actioncenterIcons/${name}.svg`)
    },
    normalizer(node) {
      return {
        label: node.value
      }
    },
    save() {
      const res = {
        activity: {
          data: {
            actor: JSON.stringify({
              created_at: new Date(),
              updated_at: new Date(),
              id: this.currentUser.id,
              data: {
                image: this.currentUser.avatar,
                name: `${this.currentUser.firstName} ${this.currentUser.lastName}`
              }
            }),
            foreign_id: `${Date.now()}-post-${Math.floor(
              Math.random() * 9999999
            )}`,
            time: new Date().toISOString(),
            message: this.description,
            verb: 'action',
            object: 1
          },
          userID: this.currentUser.id
        },
        colors: JSON.stringify({
          background: '#FF9539',
          text: '#FFF'
        }),
        application_id: null,
        assignment_list: this.people.invite,
        author: this.currentUser.id,
        company_id: this.currentUser.currentCompany.toString(),
        description: this.description,
        due_date: this.item.datatime ? this.item.datatime
          .toISOString()
          .replace(/T/, ' ')
          .replace(/\..+/, '') : new Date()
          .toISOString()
          .replace(/T/, ' ')
          .replace(/\..+/, ''),
        record_id: null,
        requested_date: new Date().toISOString().slice(0, 10),
        start_date: this.startDate ? this.startDate : new Date().toISOString().slice(0, 10),
        title: this.title,
        type: this.item.type,
        father_post_id: this.postId,
        default: this.hasDefault
      }

      this.$emit('close')
      this.postAction(res).then(response => {
        if (this.post) {
          this.post.tasks ? this.post.tasks.push(response.data.work_id) : this.post.tasks = [
            response.data.work_id
          ]
        }
        this.$store.dispatch('GSFeed/updateActivity', this.post).then(() => {
          this.$store.dispatch('WorkOrderModule/setWorkOrder')
        })
      })
    }
  }
}
</script>

<style scoped>
  .wi-100 {
    width:100%!important;
  }
  .title {
    width: 80%;
  }
  .time-text-field {
    width: 20%!important;

  }
  .mw-20 {
    max-width:20%
  }
  .badge{
      background: antiquewhite;
  }
  .v-input {
      font-size: 12px;
  }
  .v-text-field{
    width: 140px;
  }
  .row-name{
      color: black;
      font-weight: 500;
  }
  .title-position{
    position: relative;
  }
  .row-height{
      height: 50px;
  }
  .btn-submit{
    display: block;
    margin: auto;
    width: auto;
  }
  .btn-submit button{
    width: -webkit-fill-available;
  }
  .inputs{
    width: 100% !important;
  }
  .people-background{
    background: #505251;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    border-radius: 5px;
    height: 20px;
    margin: 0.2rem;
  }
  .name-people{
    color: white;
    margin: auto;
    padding: 10px;
    text-align: center;

    position: relative;
  }
  .v-responsive{
    flex: none !important;
  }
  .icon-align{
    top: -5px;
  }
  .card-title-style{
    font-weight: bold;
    font-size: 1.5rem;
    position: relative;
  }
  .badge-title{
    background: #FF9539;
    height: 60px;
  }
  .btn-badge-close{
     top: -10px !important;
    right: -10px !important;
    background: #252525bd !important;
    width: 25px !important;
    height: 25px !important;
  }
  .btn-badge-close .mdi-close::before{
  font-weight: 900 !important;
  color: white !important;
  font-size: 20px !important;
}
  .icon-profile{
    color: #f1f1f1;
  }

</style>

<style lang="scss">
  .group-in-border-style {
    .v-text-field > .v-input__control > .v-input__slot:before {
      border-style: none !important;
    }
  }
  .v-input__prepend-inner{
    margin-top: auto !important;
    margin-bottom: auto !important;
    margin-right: 5px !important;
  }
</style>
