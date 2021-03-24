<template>
  <div class="expand main-content">
    <div class="row">
      <div class="col-sm-12">
        <div class="row">
          <div class="col-sm-12">
            <div class="row top">
              <div class="col-sm-7">
                <h3 class="subject">
                  {{ conversation.subject }}
                </h3>
              </div>
              <div class="col-sm-4">
                <input
                  v-model="filter.search"
                  class="form-control"
                  placeholder="Search"
                  type="text"
                  @keyup="clearSearch"
                  @keyup.enter="searchInConversations"
                >
              </div>
              <div class="col-sm-1">
                <div class="expand-conversation">
                  <button
                    class="btn"
                    @click="returnMainPage"
                  >
                    <i class="fa fa-arrow-left" />
                  </button>
                </div>
                <button
                  class="edit-conversation pull-right"
                  style="font-weight: 700;"
                  @click.prevent="openConversationSettings"
                >
                  <i class="fa fa-ellipsis-v" />
                </button>
              </div>


              <!---- NEW THREAD ---->
              <transition
                mode="out-in"
                name="router-anim"
              >
                <div
                  v-if="actions.show_new_thread"
                  class="new_thread_window"
                >
                  <div class="new_thread_header">
                    <h3>New Messenger</h3>
                    <div class="m6_checkbox">
                      <input
                        id="new_direc_message"
                        v-model="new_direc_message"
                        type="checkbox"
                      >
                      <label for="new_direc_message" />
                    </div>
                    <button
                      class="link"
                      @click="actions.show_new_thread = false"
                    >
                      <i class="fa fa-times" />
                    </button>
                  </div>

                  <div class="new_thread_body">
                    <!--
							<div class="input-group">
								<input type="text" class="form-control" id="users" placeholder="To:">
								<span class="input-group-btn"> <button class="btn btn-info btn-block" type="button">+</button> </span>
							</div>
						-->
                    <v-select
                      v-model="emails"
                      multiple
                      :options="options"
                      @search="onSearch"
                    >
                      <template slot="no-options">
                        type to search M6Connect users...
                      </template>
                    </v-select>

                    <div
                      v-if="!new_direc_message"
                      class="input-form"
                    >
                      <input
                        id="subject"
                        v-model="subject"
                        class="form-control"
                        placeholder="Subject:"
                        type="text"
                      >
                    </div>
                  </div>

                  <div class="new_thread_actions">
                    <button
                      class="btn btn-block btn-primary"
                      @click="create_new_thread"
                    >
                      Create
                    </button>
                  </div>
                </div>
              </transition>
              <!---------------------------------->
            </div>

            <transition
              mode="out-in"
              name="router-anim"
            >
              <div
                v-if="actions.settings"
                class="conversation_actions"
              >
                <div class="form-group">
                  <button
                    class="link pull-right"
                    @click.stop="actions.settings = false"
                  >
                    <i class="fa fa-times" />
                  </button>
                </div>
                <div class="form-group">
                  <input
                    v-model="conversation.subject"
                    class="form-control"
                    placeholder="Subject"
                  >
                </div>

                <div class="form-group">
                  <v-select
                    v-model="conversation.folder"
                    :options="folders"
                  >
                    <template slot="no-options">
                      Folders...
                    </template>
                  </v-select>
                </div>

                <div class="form-group">
                  <button
                    class="btn btn-block btn-primary"
                    @click.stop="saveConversationsSettings"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </transition>

            <div class="row">
              <div class="actions col-sm-7">
                <div class="row">
                  <div class="col-sm-12 no-padding">
                    <div class="m6_messages">
                      <div
                        v-for="(message, index_day) in messages"
                        class="m6_day"
                      >
                        <span class="date">{{ message.date }}</span>

                        <div
                          v-for="(row, index) in message.messages"
                          :id="'message_' + index_day + '_' + index"
                          :class="['m6_message', row.found != undefined && row.found == true ? 'found': '']"
                        >
                          <div :class="['type_' + row.type, 'm6_type']">
                            <button
                              v-if="row.uid == me"
                              class="m6_message_text"
                              @click="row.show_delete = !row.show_delete"
                              v-html="row.message"
                            />
                            <div
                              v-else
                              class="m6_message_text"
                              @click="row.show_delete = !row.show_delete"
                              v-html="row.message"
                            />
                            <transition
                              mode="out-in"
                              name="router-anim"
                            >
                              <span
                                v-if="row.uid == me && row.show_delete"
                                class="m6_close"
                              >
                                <a @click.prevent="deleteMessage(row, index_day, index)">x</a>
                              </span>
                            </transition>

                            <span class="datetime">{{ row.timestamp_time }} </span>
                          </div>
                          <div :class="['profile_' + row.type, 'm6_profile']">
                            <img
                              v-if="row.uid == me"
                              class="img-circle"
                              :src="user.user_profile_image"
                            >
                            <img
                              v-else-if="!row.letters"
                              class="img-circle"
                              src="/sites/all/themes/m6connect/images/u2603.png"
                            >
                            <span
                              v-else-if="row.letters"
                              class="img-circle m6_letters"
                            >{{ row.letters }}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="text-editor">
                      <div class="form">
                        <span
                          v-if="show_spinner"
                          class="spinner"
                        ><i class="fa fa-spin fa-spinner" /> </span>
                        <input
                          v-model="new_message"
                          class="form-control"
                          placeholder="Enter a new Message"
                          @keyup="userIsTyping"
                          @keyup.enter="saveMessage"
                        >
                      </div>

                      <!-- EMOJI -->
                      <emoji-picker
                        :search="emoji_search"
                        @emoji="append"
                      >
                        <div
                          slot="emoji-invoker"
                          slot-scope="{ events }"
                          class="emoji-invoker"
                          v-on="events"
                        >
                          <svg
                            height="24"
                            viewBox="0 0 24 24"
                            width="24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0 0h24v24H0z"
                              fill="none"
                            />
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                          </svg>
                        </div>
                        <div
                          slot="emoji-picker"
                          slot-scope="{ emojis, insert, display }"
                        >
                          <div
                            class="emoji-picker"
                            :style="{ top: display.y + 'px', left: display.x + 'px' }"
                          >
                            <div class="emoji-picker__search">
                              <input
                                v-model="emoji_search"
                                v-focus
                                type="text"
                              >
                            </div>
                            <div>
                              <div
                                v-for="(emojiGroup, category) in emojis"
                                :key="category"
                              >
                                <h5>{{ category }}</h5>
                                <div class="emojis">
                                  <span
                                    v-for="(emoji, emojiName) in emojiGroup"
                                    :key="emojiName"
                                    :title="emojiName"
                                    @click="insert(emoji)"
                                  >{{ emoji }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </emoji-picker>
                      <!-- END EMOJI -->
                      <label
                        class="upload_files"
                        for="upload_files"
                      >
                        <i class="fa fa-paperclip" />
                      </label>
                      <button
                        class="send"
                        @click="saveMessage"
                      >
                        Send
                      </button>
                    </div>
                    <input
                      id="upload_files"
                      name="file"
                      type="file"
                      @change="onValidateFile"
                    >
                  </div>
                </div>
              </div>

              <div class="col-sm-5 last-column no-padding">
                <div class="users_conversation">
                  <h5>People</h5>

                  <div class="add_users">
                    <button @click="actions.add_users = !actions.add_users">
                      <i class="fa fa-plus" /> Add People
                    </button>

                    <div
                      v-if="actions.add_users"
                      class="add_user_box"
                    >
                      <h4>Users</h4>
                      <v-select
                        v-model="emails"
                        multiple
                        :options="options"
                        @search="onSearch"
                      >
                        <template slot="no-options">
                          type to search M6Connect users...
                        </template>
                      </v-select>

                      <button
                        class="btn btn-block btn-primary"
                        @click="addNewUsers"
                      >
                        Add Users
                      </button>
                    </div>
                  </div>
                  <div class="box_users">
                    <div
                      v-for="user in users_chat"
                      class="user"
                    >
                      <div class="image">
                        <img
                          v-if="user.image_profile"
                          class="img-circle"
                          :src="user.image_profile"
                        >
                        <span
                          v-else-if="!user.image_profiles"
                          :class="['img-circle', 'm6_letters', users_connected[user.uid] != undefined ? 'active' : 'inactive']"
                        >{{ user.letters }}</span>
                        <span
                          v-if="user.typing"
                          class="is_typing"
                        ><i class="fa fa-pencil" /></span>
                      </div>
                      <div class="name">
                        {{ user.name }}
                      </div>

                      <div class="user_actions">
                        <button @click="openUserActions(user)">
                          <i class="fa fa-ellipsis-v" />
                        </button>
                      </div>

                      <transition
                        mode="out-in"
                        name="router-anim"
                      >
                        <div
                          v-if="user.actions_show"
                          class="user_actions_show"
                        >
                          <ul class="list-unstyled">
                            <li>
                              <button
                                class="btn btn-block btn-primary"
                                @click="leaveConversation(user)"
                              >
                                Leave Conversation
                              </button>
                            </li>
                            <li>
                              <a
                                class="btn btn-block btn-primary"
                                :href="'/user/' + user.uid"
                                target="_blank"
                              >See Profile</a>
                            </li>
                          </ul>
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>

                <div class="users_conversation">
                  <h5>Tags</h5>
                  <!-- @search="onSearchTags" @input="changeTags($event)" @option:created="createTag($event)"  -->
                  <v-select
                    v-model="tags"
                    :filterable="false"
                    multiple
                    :options="settings.taskTags"
                    push-tags
                    taggable
                  >
                    <template slot="no-options">
                      type to search M6Connect Tags...
                    </template>
                  </v-select>
                </div>

                <div class="users_conversation">
                  <h5>Shared Files</h5>

                  <ul class="list-unstyled shared_files">
                    <li v-for="file in conversation.files">
                      <a
                        :href="file.url"
                        target="_blank"
                      >
                        <i :class="['fa', file.icon]" />
                        <p>{{ file.name }}</p>
                        <p>{{ file.date }}</p>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import multiSelect from 'vue-multi-select'
import EmojiPicker from 'vue-emoji-picker'
import VueSocketio from 'vue-socket.io'
import { db } from '@/utils/Firebase'
import { mapState } from 'vuex'
Vue.use(VueSocketio, 'https://www.m6thread.com/')

import 'vue-multi-select/dist/lib/vue-multi-select.min.css'

export default {
  components: {
    vSelect,
    multiSelect,
    EmojiPicker
  },
  directives: {
		  focus: {
		    inserted(el) {
		      el.focus()
		    }
		  }
  },
  props: ['id', 'number', 'title'],
  computed: {
    ...mapState('Companies', {
      currentCompany: 'currentCompany'
    })
  },
  data() {
    let taskRef = {}
		    if (this.$route.name === 'tasks' || this.$route.name === 'schedule') {
		      taskRef = db.collection('projects').doc(this.$route.params.id).collection('tasks').doc(this.id)
		    } else if (this.$route.name === 'all-tasks') {
		      taskRef = db.collection('projects').doc(this.projectId).collection('tasks').doc(this.id)
		    } else if (this.$route.name === 'tickets') {
		      taskRef = db.collection('tickets').doc(this.id)
		    }
    return {
      task: {},
      settings: [],
      taskRef,
      getConvoInfo: true,
      me: 0,
      show_spinner: false,
      typing: false,
      emoji_search: '',
      sound: '/sites/all/modules/custom/m6connect_scm/sounds/notification.mp3',
      users_connected: [],
      only_connected: false,
      new_direc_message: false,
      user: {
        name: '',
        profile_status: [{ name: 'Active' }],
        change_image: '',
        user_profile_image: '/sites/all/themes/m6connect/images/messanger_icons/fa-user-icon.png',
        department: 1,
        mail: ''
      },
      searching: false,
      status: [
        { name: 'Active' },
        { name: 'Do Not Disturb' },
        { name: 'Invisible' }
      ],
      conversation: {
        mapping_id: '',
        subject: '',
        folder: 0,
        mapping_group: '',
        files: []
      },
      messages: [],
      people: [],
      users: [],
      new_message: '',
      users_chat: [],
      mapping_id: '',
      users: [],
      windows: [],
      folders: [],
      folder_name: '',
      folders_trash: [],
      emails: [],
      subject: '',
      tags: [],
      tags_options: [],
      tag_first_time: true,
      search_message: 'There are no conversations',
      options: [],
      actions: {
        hide_people: false,
        threads: true,
        link_active: '',
        show_new_thread: false,
        show_new_folder_input: false,
        show_profile: false,
        expand: false,
        settings: false,
        add_users: false
      },
      filter: {
        search: '',
        last_search: '',
        search_options: [],
        search_pointer: 0,
        action: [],
        actions: [{
          title: 'Inbox',
          elements: [
            { name: 'Direct Messages', value: 'direct-message' },
            { name: 'Threads', value: 'thread' }
          ]
        },
        {
          title: 'Folders',
          elements: []
        }
        ],
        btnLabel: 'View: ',
        options: {
				        multi: true,
				        groups: true,
				        labelName: 'name',
				        labelList: 'elements',
				        groupName: 'title'
				    }
      }
    }
  },
  firestore() {
	      return {
	        task: this.taskRef,
	        settings: db.collection('settings').doc(this.currentCompany.id).collection('settings').doc('projects')
	      }
	    },
  sockets: {
    connect: function () {
      console.log('socket connected')
    },
    customEmit: function (val) {
      console.log(val)
    },
    new_message: function (new_message) {
            	new_message.socket = true
            	this.save_new_message(new_message)
    },
    onlineuserlist: function (data) {
            	data = JSON.parse(data)
            	for (const index in data) {
            		let explode = data[index].username.split('@')
            		explode = explode[explode.length - 1]
            		explode = explode.split('_')
            		explode = explode[0]
            		this.users_connected[explode] = true
            	}
    },
    userIsTyping: function (data) {
            	if (data.uid != this.me) {
            		if (data.mapping_id == this.mapping_id) {
            			this.users_chat[data.uid].typing = true
            		}
            	}
    },
    userStopTyping: function (data) {
            	if (data.uid != this.me) {
            		if (data.mapping_id == this.mapping_id) {
            			this.users_chat[data.uid].typing = false
            		}
            	}
    }
  },
  methods: {
    deleteFolder(id) {
      // this.folders.splice(index, 1)
      axios.post('/messenger/delete/folder', { folder_id: id })
	                .then(response => {
	                	if (response.data.error == 0) {
	                		this.$snotify.success(response.data.msg, 'Success')
	                		this.getFolders()
	                	} else {
	                		this.$snotify.error(response.data.msg, 'Error')
	                	}
	                })
	                .catch(error => {
	                    this.$snotify.error(error, 'Error')
	                })
    },
    append(emoji) {
	            this.new_message += emoji
	        },
    returnMainPage() {
      let path = this.conversation.mapping_group
      if (path == 'group' || path == 'user' || path == 'thread') {
        path = ''
      }

      if (this.conversation.id_folder != undefined) {
        window.location.href = '/dashboard#/' + path
      } else {
        window.location.href = '/dashboard#/folders/' + this.conversation.id_folder
      }
    },
    clearSearch() {
      if (this.filter.search == '') {
        this.filter.last_search = ''
        const found = this.$el.querySelectorAll('.found')
        for (let index = 0; index < found.length; index++) {
					    found[index].classList.remove('found')
        }
      }
    },
    searchInConversations() {
      if (this.filter.search == '') {
        this.filter.last_search = ''
        return false
      }
      if (this.filter.search != this.filter.last_search) {
        const found = this.$el.querySelectorAll('.found')
        for (let index = 0; index < found.length; index++) {
					    found[index].classList.remove('found')
        }

        this.filter.search_options = []
        this.filter.search_pointer = 0
        for (const index_day in this.messages) {
          for (const index_message in this.messages[index_day].messages) {
            let content = this.messages[index_day].messages[index_message].message.toLowerCase()
            content = content.split('<body>')
            if (content[1] != undefined) {
              content = content[1].split('</body>')[0]
              var filter = this.filter.search.toLowerCase()
              if (content.search(filter) != -1) {
                var id = '#message_' + index_day + '_' + index_message
                this.filter.search_options.push(id)
                var message = this.$el.querySelector(id)
                message.classList.add('found')
              }
            } else {
              content = content[0].split('<span class="m6message-attachment-filename">')
              if (content.length == 2) {
                content = content[1].split('</span>')[0]
                var filter = this.filter.search.toLowerCase()
                if (content.search(filter) != -1) {
                  var id = '#message_' + index_day + '_' + index_message
                  this.filter.search_options.push(id)
                  var message = this.$el.querySelector(id)
                  message.classList.add('found')
                }
              }
            }
          }
        }
      }
      if (this.filter.search_options[this.filter.search_pointer] == undefined) {
        this.filter.search_pointer = 0
      }
      if (this.filter.search_options.length > 0) {
        var message = this.$el.querySelector(this.filter.search_options[this.filter.search_pointer])
        const container = this.$el.querySelector('.m6_messages')
        container.scrollTop = message.offsetTop - 30
        this.filter.search_pointer++
      }
      this.filter.last_search = this.filter.search
    },
    changeTags(values) {
      if (this.tag_first_time == true) {
        return false
      }
      axios.post('/messenger/validate/tags', {
        mapping_id: this.mapping_id,
        tags: values
      })
		        .then(response => {
		          if (undefined !== response.data.error && response.data.error == false) {
		        	 this.getTags()
		          } else {
		          	this.$snotify.error(response.data.msg, 'Error')
		          }
		          this.storeLoading = false
		        }, error => {
          console.log(error)
        })
    },
    createTag(value) {
      axios.post('/messenger/insert/tag', {
        mapping_id: this.mapping_id,
        tag: value
      })
		        .then(response => {
		          if (undefined !== response.data.error && response.data.error == false) {
		          	 this.tags = response.data.result
		        	 this.getTags()
		          } else {
		          	this.$snotify.error(response.data.msg, 'Error')
		          }
		          this.storeLoading = false
		        }, error => {
          console.log(error)
        })
    },
    getTags() {
      axios.post('/messenger/get/tags')
		        .then(response => {
		          if (undefined !== response.data.error && response.data.error == false) {
		        	 this.tags_options = response.data.result
		          } else {
		          	this.$snotify.error(response.data.msg, 'Error')
		          }
		          this.storeLoading = false
		        }, error => {
          console.log(error)
        })
    },
    leaveConversation(user) {
      axios.post('/messenger/leave/user', {
        user_uid: user.uid,
        mapping_id: this.mapping_id,
        cid: user.cid
      })
		        .then(response => {
		          if (undefined !== response.data.error && response.data.error == false) {
		        	 this.users_chat = response.data.result
					 this.$snotify.success(response.data.msg, 'Success')
		          } else {
		          	this.$snotify.error(response.data.msg, 'Error')
		          }
		          this.storeLoading = false
		        }, error => {
          console.log(error)
        })
    },
    openUserActions(user) {
      if (user.actions_show == true) {
        user.actions_show = false
      } else {
        for (const index in this.users_chat) {
          this.users_chat[index].actions_show = false
        }
        user.actions_show = true
      }
    },
    addNewUsers() {
      axios.post('/messenger/add/users', {
        users: this.emails,
        mapping_id: this.mapping_id
      })
		        .then(response => {
		          if (undefined !== response.data.error && response.data.error == false) {
		        	 this.users_chat = response.data.result
		        	 console.log(this.users_chat.length)
		        	 // this.taskRef.set({ usersCount: this.users_chat.length+1 })
					 this.$snotify.success(response.data.msg, 'Success')
					 this.emails = []
					 this.actions.add_users = false
		          } else {
		          	this.$snotify.error(response.data.msg, 'Error')
		          }
		          this.storeLoading = false
		        }, error => {
          console.log(error)
        })
    },
    onValidateFile($e) {
				 const formData = new FormData()
				 const file = $e.target.files[0]
	             formData.append('files', file)
	             formData.append('mapping_id', this.mapping_id)
	             this.show_spinner = true
	             axios.post('/messenger/insert/attachment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
	                .then(response => {
	                    const new_message = response.data.result
			          	this.new_message = ''
			          	this.save_new_message_window(new_message)
			          	this.$socket.emit('new_message', new_message)
			          	this.getInfoConversation()
			          	this.show_spinner = false
	                })
	                .catch(error => {
	                    console.log(error)
	                    this.show_spinner = false
	                })
    },
    expandConversation() {
      this.actions.expand = true
    },
    deleteMessage(message, index_day, index) {
      axios.post('/messenger/message/delete', { message_id: message.id })
		        .then(response => {
		          if (undefined !== response.data.error && response.data.error == false) {
		        	 this.messages[index_day].messages.splice(index, 1)
					 if (this.messages[index_day].messages.length == 0) {
					  this.messages.splice(index_day, 1)
					 }
					 this.$snotify.success(response.data.msg, 'Success')
		          } else {
		          	this.$snotify.error(response.data.msg, 'Error')
		          }
		          this.storeLoading = false
		        }, error => {
          console.log(error)
        })
    },
    SaveProfile() {
      axios.post('/messenger/save/profile', this.user)
		        .then(response => {
		          if (undefined !== response.data.error && response.data.error == false) {
		        	 this.$snotify.success(response.data.msg, 'Success')
		        	 this.user.user_profile_image = response.data.result
		        	 this.user.change_image = response.data.result
		        	 this.actions.show_profile = false
		          } else {
		          	this.$snotify.error(response.data.msg, 'Error')
		          }
		          this.storeLoading = false
		        }, error => {
          console.log(error)
        })
    },
    onFileChange(e) {
		        const files = e.target.files || e.dataTransfer.files
		        if (!files.length) {
		          return
		        }
		        this.createImage(files[0])
		    },
		      createImage(file) {
		        const reader = new FileReader()
		        const vm = this

		        reader.onload = e => {
		          vm.user.change_image = e.target.result
		        }
		        reader.readAsDataURL(file)
		    },
    onSearch(search, loading) {
      if (search == '') {
        return
      }
      loading(true)
        		this.search(loading, search, this)
		    },
		    search: _.debounce((loading, search, vm) => {
		        fetch(
		          `/messenger/search/users/${escape(search)}`
		        ).then(res => res.json()).then(json => {
		          	vm.options = json
		          	loading(false)
		        })
		    }, 350),
		    onSearchTags(search, loading) {
		    	loading(true)
        		this.searchTags(loading, search, this)
		    },
		    searchTags: _.debounce((loading, search, vm) => {
		        fetch(
		          `/messenger/search/tags/${escape(search)}`
		        ).then(res => res.json()).then(json => {
		          	vm.tags_options = json.result
		          	loading(false)
		        })
		    }, 350),
		    openConversationSettings() {
		    	this.actions.settings = !this.actions.settings
		    },
		    saveConversationsSettings() {
		    	axios.post('/messenger/save/conversation', this.conversation)
		        .then(response => {
		          if (undefined !== response.data.error && response.data.error == false) {
		            this.$snotify.success(response.data.msg, 'Success')
		            this.actions.settings = false
		          } else {
		          	this.$snotify.error(response.data.msg, 'Error')
		          }
		          this.storeLoading = false
		        }, error => {
          console.log(error)
        })
		    },
		    saveNewFolder() {
		    	axios.post('/messenger/save/folder', { folder: this.folder_name })
		        .then(response => {
		          if (undefined !== response.data.error && response.data.error == false) {
		            this.folder_name = ''
		            this.actions.show_new_folder_input = false
		            this.getFolders()
		          }
		          this.storeLoading = false
		        }, error => {
          console.log(error)
        })
		    },
		    create_new_thread() {
		    	if (this.emails.length == 0) {
		    		this.$snotify.error('Users are required ', 'Error')

		    		return false
		    	}

		    	axios.post('/messenger/create/thread', {
        users: this.emails,
        subject: this.subject,
        is_direct_message: this.new_direc_message
      })
		        .then(response => {
		          if (undefined !== response.data.error && response.data.error == false) {
		          	this.subject = ''
		          	this.emails = []
		          	this.actions.show_new_thread = false
		          	this.conversation.subject = this.subject

		          	this.$snotify.success(response.data.msg, 'Success')
		          	this.$router.push('/')
		          } else {
		          	this.$snotify.error(response.data.msg, 'Error')
		          }
		          this.storeLoading = false
		        })
		    },
    closeWindow(data) {
      const index = this.windows.findIndex(win => win.uid === data.uid)
      this.$delete(this.windows, index)

      const rows = this.windows
      this.windows = []
      let new_index = 0
      for (const win in rows) {
        rows[win].left = new_index * 295
        this.windows.push(rows[win])
        new_index++
      }
    },
    callDirectMessage(data) {
      const find = this.windows.findIndex(win => win.uid === data.uid)

      if (find === -1 && data.type_user == 'other') {
        const windows = this.windows.length
        data.left = windows * 295
        this.windows.push(data)
      }
    },

    save_new_message_window(new_message) {
      new_message.socket = false
      this.save_new_message(new_message)
    },
    save_new_message(new_message) {
      if (this.mapping_id == new_message.mapping_id) {
        if ((new_message.socket == true && new_message.uid != this.me)
						 || (new_message.socket == false && new_message.uid == this.me)) {
          new_message.messages[0].type = new_message.socket == true && new_message.uid != this.me ? 'other' : 'me'
          const last_message = this.messages.length - 1
			          	if (this.messages.length > 0 && this.messages[last_message].date == new_message.date) {
			          		this.messages[last_message].messages.push(new_message.messages[0])
			          	} else {
			          		this.messages.push(new_message)
			          	}
			        }
      } else {
        for (const index in new_message.users) {
          if (new_message.users[index] == this.me) {
            if (this.user.profile_status[0].name == 'Active') {
              const audio = new Audio(this.sound)
        						audio.play()
            }
            this.getConversationsByType()
          }
        }
      }


		        this.$nextTick(() => {
			        this.scrollToEnd()
			    })
    },
    saveMessage() {
      if (this.new_message == '') {
        return ''
      }
      this.userStopTyping()
      const message = this.new_message
      axios.post('/messenger/insert', {
        mapping_id: this.mapping_id,
        message: message
      })
		        .then(response => {
		          if (undefined !== response.data.error && response.data.error == false) {
		          	const new_message = response.data.result
		          	this.new_message = ''
		          	this.save_new_message_window(new_message)
		          	this.$socket.emit('new_message', new_message)
		          }
		          this.storeLoading = false
		        })
    },
    getDirectConversations() {
      window.location.href = '/dashboard#/direct-message'

      /*
				this.mapping_id = '';
				this.conversations = []
				this.search_message = 'Searching conversations...'
				if(this.actions.link_active != 'direct-message'){
					this.$router.push('/direct-message')
				}

				var is_direct_message = true;
				this.actions.link_active = 'direct-message';

				axios.post(`/messenger/get_user_messaging`, {is_direct_message: is_direct_message})
		        .then(response => {
		          if (undefined !== response.data.error &&  response.data.error == false) {
		            this.conversations = response.data.result;
		            if(this.mapping_id != ''){
		            	this.getConversation(this.conversations[this.mapping_id])
		            }
		            if(this.getCountConversations() == 0){
		            	this.search_message = 'There are no conversations'
		            }
		          }
		          this.storeLoading = false;
		        }, (error) => { console.log(error) })
		        */
    },
    getThreadConversations() {
      window.location.href = '/dashboard'

      /*
				this.mapping_id = '';
				this.conversations = []
				this.search_message = 'Searching conversations...'
				if(this.actions.link_active != 'threads'){
					this.$router.push('/')
				}
				var is_direct_message = false;
				this.actions.link_active = 'threads';

				axios.post(`/messenger/get_user_messaging`, {is_direct_message: is_direct_message})
		        .then(response => {
		          if (undefined !== response.data.error &&  response.data.error == false) {
		            this.conversations = response.data.result;
		            if(this.mapping_id != ''){
		            	this.getConversation(this.conversations[this.mapping_id])
		            }
		            if(this.getCountConversations() == 0){
		            	this.search_message = 'There are no conversations'
		            }
		          }
		          this.storeLoading = false;
		        }, (error) => { console.log(error) })*/
    },
    getConversationsByFolder(folder) {
      window.location.href = '/dashboard#/folders/' + folder.id
    },
    getConversation() {
      this.messages = []
      axios.post('/messenger/get_messages', {
        mapping_id: this.mapping_id
      })
        .then(response => {
          if (undefined !== response.data.error && response.data.error == false) {
            this.messages = response.data.result
            this.mapping_id = response.data.mapping_id
            this.me = response.data.me
            this.username = response.data.username
            const myobj = { 'username': this.username }
            this.$socket.emit('online_user_list', JSON.stringify(myobj))
            this.image_profile = response.data.image_profile
          }
          this.storeLoading = false
          this.$nextTick(() => {
            this.scrollToEnd()
          })
        })
    },
    scrollToEnd() {
      const container = this.$el.querySelector('.m6_messages')
      			container.scrollTop = container.scrollHeight
    },
    getUsers() {
      this.searching = true
      axios.post('/messenger/get/users')
		        .then(response => {
		          if (undefined !== response.data.error && response.data.error == false) {
		            this.users = response.data.result
		            this.searching = false
		          }
		          this.storeLoading = false
		        }, error => {
		        	this.searching = false
		        })
    },
    getFolders() {
      axios.post('/messenger/get/folders')
		        .then(response => {
		          if (undefined !== response.data.error && response.data.error == false) {
		            this.folders = response.data.result
		            if (this.folders.length > 0 && this.filter.actions[1].elements.length == 0) {
		            	this.filter.actions[1].elements = this.folders
		            }
		            this.folders_trash = response.data.folders_trash
		          }
		          this.storeLoading = false
		        }, error => {
          console.log(error)
        })
    },
    getUserProfile() {
      axios.get('/messenger/user/profile')
		        .then(response => {
		          if (undefined !== response.data.error && response.data.error == false) {
		          	this.user.user_profile_image = (response.data.result.photo) ? response.data.result.photo : this.user.user_profile_image
		          	this.user.name = response.data.result.name
		          	this.user.change_image = this.user.user_profile_image
		          	this.user.mail = response.data.result.mail
		          	this.user.profile_status = [{ name: response.data.result.status }]

		          	this.username = response.data.result.username
		    		const myobj = { 'username': this.username }
            this.$socket.emit('online_user_list', JSON.stringify(myobj))
		          }
		          this.storeLoading = false
		        }, error => {
          console.log(error)
        })
    },
    getInfoConversation() {
      const data = {}
      data.number = this.number
      data.title = this.title
      data.is_ticket = true

      axios.post('/messenger/conversation/info-cadence', {
        mapping_id: this.mapping_id,
        subject: this.task.title,
        data: data
      })
		        .then(response => {
		          if (undefined !== response.data.error && response.data.error == false) {
		        	this.users_chat = response.data.users
		        	this.conversation.subject = response.data.conversation.subject
		        	this.conversation.id_folder = response.data.conversation.id_folder
		        	this.conversation.folder = response.data.folder
		        	this.conversation.files = response.data.files
		        	this.conversation.mapping_group = response.data.conversation.mapping_group
		        	if (this.conversation.mapping_group == 'direct-message') {
		        		this.actions.link_active = 'direct-message'
		        	} else if (this.conversation.id_folder > 0) {
		        		this.actions.link_active = 'folders'
		        	} else {
		        		this.actions.link_active = 'thread'
		        	}
		        	this.tags = response.data.tags
		        	this.tag_first_time = false
		          }
		          this.storeLoading = false
		        }, error => {
          console.log(error)
        })
    },
    userIsTyping() {
      if (this.new_message == '') {
        this.userStopTyping()
        return false
      }
      if (this.typing == false) {
        const userTyping = {
          mapping_id: this.mapping_id,
          uid: this.me,
          name: this.user.name
        }

        this.$socket.emit('userIsTyping', userTyping)
        this.typing = true
      }
    },
    userStopTyping() {
      const userTyping = {
        mapping_id: this.mapping_id,
        uid: this.me,
        name: this.user.name
      }
      if (this.typing == true) {
        this.$socket.emit('userStopTyping', userTyping)
      }
      this.typing = false
    },
    cleanString(data) {
      const regex = /(<([^>]+)>)/ig
      return data.replace(regex, '')
    }
  },
  watch: {
    users_chat(newValue, oldvalue) {
      const size = Object.keys(newValue).length
      this.taskRef.update({ usersCount: size })
    },
    'conversation.files'(newValue, oldValue) {
      this.taskRef.update({ attachmentsCount: newValue.length })
    },
    'task.title'(newValue, oldValue) {
      if (newValue !== undefined && newValue !== '' && this.getConvoInfo) {
        this.mapping_id = this.task.id
        this.conversation.mapping_id = this.task.id
        this.getConversation()
        this.getInfoConversation()
        this.getConvoInfo = false
      }
    }
  },
  mounted() {
    this.user.change_image = this.user.user_profile_image
    this.getUserProfile()
    this.getTags()

		    this.actions.link_active = 'threads'
		    this.$nextTick(() => {
		    	$(this.$el.querySelector('.new-text-message-smilly'))
		    })
    if (this.id) {
      this.mapping_id = this.id
      this.conversation.mapping_id = this.id
      this.getConversation()
      this.getInfoConversation()
      this.getConvoInfo = false
    }
  },
  updated() {
    if (this.folders.length == 0) {
      this.getFolders()
    }

    if (this.users.length == 0 && this.searching == false) {
      this.getUsers()
    }
  }
}
</script>

<style lang="scss">
 @import "~vue-snotify/styles/material";
  $color-primary: #0070d2;
  $color-delete: #ce1e1e;

/*  ::-webkit-scrollbar {
    width: 5px;
  }

  !* Track *!
  ::-webkit-scrollbar-track {
      background: #f1f1f1;
  }

  !* Handle *!
  ::-webkit-scrollbar-thumb {
      background: #888;
  }

  !* Handle on hover *!
  ::-webkit-scrollbar-thumb:hover {
      background: #555;
  }*/
  #app {
    font-family: 'futura_md_btmedium', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: -10px;
    background: #E3E3E3;

    h3.subject {
    	font-size: 14px;
    }

    .btn-primary {
      background-color: $color-primary;

      &:hover {
        background-color: lighten($color-primary, 5%);
      }
    }

    .text-editor {
    	.spinner {
    		position: absolute;
		    top: 8px;
		    left: 6px;
    	}
			margin: 10px;
			border: 1px solid #CCC;
			border-radius: 5px;
			display: grid;
			position: relative;
			grid-template-columns: 11fr 1fr 1fr 2fr;

			.emoji-invoker {
			  svg {
			    margin: 3px auto 0;
			  }
			}

			.upload_files {
				display: flex;
			    justify-content: center;
			    width: 100%;
			    height: 100%;
			    flex-direction: column;
			    text-align: center;
			    cursor: pointer;
			    border-left: 1px solid #CCC;

			   &:hover {
			   	background-color: #CCC;
			   }
			}

			input {
				border: none;
				font-size: 12px;

				&:focus {
					box-shadow: none;
				}
			}
			.send {
				border-left: 1px solid #ccc;
				background-color: $color-primary;
				color: #FFF;

				&:hover {
				   	background-color: lighten($color-primary, 5%);
				}
			}
		}

		#upload_files {
			display: none;
		}

    .m6_checkbox {
      &::before{
        content: 'Online Users';
        font-size: 11px;
        top: 0;
        left: 0;
        position: absolute;
        margin-left: -74px;
        margin-top: -2px;
      }
      input {
        display: none;

        &:checked {
          + label {
            background-color: $color-primary;
            &:before{
              transform: translateX(20px) scale(1.6);
            }

          }
        }
      }

      label {
        width: 30px;
        height: 10px;
        background-color: #c6c6c6;
        border-radius: 20px;
        box-shadow: 0 0 5px  rgba(0, 0, 0, .2);
        position: relative;

        &:before {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 20px;
          top: 0;
          left: 0;
          background-color: #FFF;
          box-shadow: 0 0 2px rgba(0,0,0, .2);
          transform: scale(1.6);
          transition: transform .5s;
        }
      }
    }

    .connected_users {
      position: absolute;
      top: 5px;
      right: 14px;
      z-index: 1000;
    }

    .icon-user {
      width: 12px;
      height: 12px;
      background-color: #a4dc65;
      border: 3px solid #a4dc65;
      box-shadow: 0 0 0 3px #FFF;
      border-radius: 50%;
      display: inline-block;
      float: left;

      &.inactive {
        background-color: #FFF;
      }
    }
    .emojionearea {
      border-radius: 0;
    }
    .emojionearea-upbutton, .emojionearea-sendbutton {
      display: none;
    }

    .no-conversations {
      font-size: 20px;
      text-align: center;
      color: #666;
      margin:  auto;
    }

    .link-over:hover {
      cursor: pointer;
    }


    .messenger_nav {
      ul {
        margin: 0;
        padding: 4px 0;
        li {
          width: 25%;
          vertical-align: middle;
          text-align: center;
          position: relative;

          i {
            font-size: 24px;
            color: #e6b32d;

            &.ms_nav {
              font-size: 40px;
              font-weight: 700;
              color: #CCC;
            }
          }
          img {
            width: 30px;
            height: 30px;
            object-fit: cover;
          }
        }
      }
    }
    .messenger_nav_left {
      height: 594px;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      display: block;
      padding: 0 20px;
      background-color: transparent;
      border-right: 1px solid #efefef;

      h4 {
        font-size: 14px;
      }

      i {
        font-size: 15px;
        font-weight: 700;
      }

      .m6_my_profile {
        width: 298px;
        height: 387px;
        background-color: #FFF;
        position: absolute;
        border: 1px solid #515151;
        top: -320px;
        left: calc(100% + 50px);
        z-index: 1000;
        padding: 20px;

        .profile_status {
          text-align: center;
        }

        > div {
          margin-bottom: 20px;
        }

        .submit {

          button {
            padding: 10px 20px;
            display: block;
            width: 100%;
          }
        }
        .profile_image {
          height: 80px;
          padding-top: 10px;
          text-align: center;

          label {
            cursor: pointer;
          }

          #upload_image {
            display: none;
          }

          img {
            width: 70px;
            height: 70px;
            object-fit: cover;
          }
        }

        h2 {
          margin-bottom: 0;
          font-size: 20px;
          font-weight: 700;
          color: #333333;
        }
        h3 {
          font-size: 13px;
          font-weight: 100;
          color: #333333;
        }

        &:before {
          content: "\A";
          border-style: solid;
          border-width: 30px 50px 35px 0;
          border-color: transparent #f2f2f2 transparent transparent;
          position: absolute;
          left: -51px;
          top: 304px;
        }
        .select {
          width: 60%;

          .line {
            display: none;
          }

          button {
            width: 100%;
            border-radius: 10px;
            border: 1px solid #666;

            span {
              display: none;
            }
          }

          .checkboxLayer {
            width: 179px;
            min-width: 179px;

            .selectList {
              width: 100%;
              padding: 0;
            }

            .selectItem {
              width: 100%;
              max-width: 100%;
              min-width: auto;

              span {
                margin-left: 0;
              }
            }
          }
        }

      }

      .folders {

        li {
          padding-left: 10px;
          position: relative;

          &:hover  {
            background-color: #f9f7f7;

            button.btn_delete_folder {
              opacity: 1;
            }

          }

          button {
            font-size: 12px;
            font-weight: 100;
            color: #999999;

            &.btn_delete_folder {
              position: absolute;
              right: 10px;
              top: 0;
              opacity: 0;
              transition: .2s;

              i {
                color: $color-delete;
                font-size: 12px;

                &:hover {
                  color: lighten($color-delete, 5%);
                }
              }
            }

            &.active {
              font-weight: 700;
            }
          }
        }
      }

      .ms_threads {
        padding: 40px 0;

        .input-group {
          input {
            border-radius: 0;
            font-size: 12px;
          }
          button {
            height: 34px;
            background-color: $color-primary;
          }
          i {
            font-size: 16px;
            font-weight: 100;
          }
        }

      }
      h4 {
        margin: 0;
      }

      .main {
        font-weight: 700;
        color: #868686;
        text-decoration: none;
        font-size: 14px;
        letter-spacing: 1px;
      }

      .first-child {
        font-weight: 700;
        font-size: 12px;
        color: #AEAEAE;
        letter-spacing: 1px;

        &.active {
          color: $color-primary;
        }
      }

      ul {
        padding-left: 10px;
        margin-bottom: 0;
      }
    }

    .new_thread_window {
      width: 300px;
      min-height: 330px;
      height: auto;
      position: absolute;
      border: 1px solid #fff;
      background-color: #efefef;
      z-index: 10000;
      padding: 15px;
      box-shadow: 2px 2px 2px #CCC;

      left: 0;
      top: 0;
      padding: 15px;

      .new_thread_header {
        display: inline-block;
        width: 100%;
        margin-bottom: 10px;
        position: relative;

        .m6_checkbox{
          position: absolute;
          top: 8px;
          right: 20px;

          &::before{
            content: '';
          }
        }

        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        button {
          position: absolute;
          right: 0;
          top: 5px;
        }
      }

      .new_thread_body {
        min-height: 200px;
        height: auto;

        .new_thread_actions {
          button {
            padding: 9px;
          }
        }

        input {
          border-radius: 0;
        }

        .input-group, .input-form {
          margin-bottom: 10px;
        }
        .new_thread_actions {
          margin: 10px 15%;
        }
      }
    }

    .ms_todo {
      padding: 0px 0 40px;
    }

    .ms_people {
      position: relative;

      h4 {
        border-bottom: 1px solid #efefef;
        margin-bottom: 3px;
        padding-bottom: 3px;
      }

      ul {
        li {
          vertical-align: middle;
          margin-bottom: 2px;

          button {
            text-align: left;
            line-height: 12px;
            display: inline-block;
            width: 100%;
            font-family: 'futura_bk_btbook';

            p {
              float: left;
              width: 87%;
              margin: 0 0 0 5px;
              font-size: 10px;
            }
          }
        }
      }
    }

    .messenger_conversations {
      height: 594px;
      overflow-y: hidden;
      border-right: 1px solid #efefef;

      h4 {
          font-size: 16px;
          line-height: 36px;
          text-align: right;
      }

      input {
        border-radius: 0;
      }

      .select {
        width: 100%;

        .line {
          display: none;
        }

        > button {
          border-radius: 0;

          &:focus {
            outline: none;
          }
        }

        .buttonLabel {
          padding: 5px;
        }

        .checkboxLayer {
          min-width: 210px;
          width: 210px;

          .selectItem {
            min-width: 210px;
            width: 210px;
          }
        }

        .line {
          .helperButton {
            display: none;

            &:first-child {
              display: block;
            }
          }

        }

        .helperButton {
          padding: 5px;
        }

        .btn-select {
          width: 100%;
          text-align: right;
        }
      }

    }

    .conversations {

      height: 548px;
      overflow-y: scroll;
      overflow-x: hidden;
      display: block;
      clear: both;

      .list-group {
        margin-bottom: 0;
        padding: 2px 10px 0 0;
          -webkit-box-shadow: none;
        box-shadow: none;
        position: relative;

        a {
          border-radius: 0;
          min-height: 65px;

          &.m6_active {
            background-color: rgba(153, 204, 255, 0.498039215686275);
          }

          .edit-conversation {
            width: 40px;
            display: block;
            text-align: right;
            display: none;

            &:hover {
              background-color: #CCC;
            }

            i {
              font-size: 20px;
            }
          }

          &:hover {
            background: lightblue;

            .edit-conversation {
              display: block;
              background-color: transparent;
            }
          }

          .col-sm-9 {

            &:after {
              content: '';
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 6px;
              border-left: 5px solid #0a63c1;
            }
          }

          .list-group-item-heading {
            font-weight: 700;
            color: $color-primary;
            margin: 0;
            font-size: 14px;
          }

          .users {
            color: #333333;
            font-family: 'futura_bk_btbook';
          }

          .last_message {
            color: #999999;
            font-family: 'futura_bk_btbook';
          }

          p {
            margin: 0;
            font-weight: 100;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .date {
            font-family: 'futura_bk_btbook';
            text-align: right;
            color: #0a63c1;
            font-size: 12px;
            font-weight: 700;
            display: inline-block;
            width: 100%;
          }

          &.read {
            .list-group-item-heading {
              color: #666;
              font-weight: 100;
            }
            .col-sm-9 {
              &:after {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 6px;
                border-left: 5px solid transparent;
              }
            }
            .date {
              color: #888;
              font-weight: 100;
            }
          }
          &:hover {
            background-color: rgba(153, 204, 255, 0.498039215686275);
          }
        }
        .conversation_actions {
          width: 300px;
          height: 200px;
          background-color: #FFF;
          position: absolute;
          top: 0;
          right: 0;
          border: 1px solid #fff;
          background-color: #efefef;
          z-index: 10000;
          padding: 15px;
          box-shadow: 2px 2px 2px #CCC;

          ul {
            li, a, button {
              min-height: 30px;
            }
          }

          input {
            border-radius: 0;
          }
          .selected-tag {
            color: #000;
          }
        }
      }
    }

    .scroll-area {
      position: relative;
      margin: auto;
      width: 200px;
      height: 500px;
    }

    .conversation-users {
      position: relative;

      h5 {
        line-height: 2.7;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .show_more_users {
        width: 200px;
        min-height: 80px;
        position: absolute;
        right: 0;
        top: 45px;
        border: 1px solid #fff;
        background-color: #efefef;
        z-index: 10000;
        padding: 15px;
        box-shadow: 2px 2px 2px #CCC;

        li {
          width: 100%;
          font-size: 12px;
          text-decoration: underline;
          text-align: left;
        }
      }
      .expand-conversation, .close-conversation {
        width: 50%;
        text-align: center;
        float: left;
        display: flex;
        justify-content: center;
        flex-flow: row;
        height: 40px;


        button {
          padding: 0;
          display: block;
          width: 100%;

          i {
            font-size: 14px;
          }
        }
      }
      .close-conversation {
        text-alig: center;
      }

      ul {
        padding-top: 2px;
        margin: 0;

        li {
          position: relative;
          width: 50px;
          text-align: center;

          &.m6_typing {
            .m6_letters {
              border: 2px solid #92d5ff;
            }
          }

          .is_typing {
            position: absolute;
            top: 0;
            right: 0;
            background: #92d5ff;
            width: 20px;
            height: 20px;
            text-align: center;
            border-radius: 50%;

            i {
              position: relative;
              color: #FFF;
              font-size: 10px;
            }
          }

          img {
            width: 35px;
            height: 35px;
            float: left;
            object-fit: cover;
          }

          .m6_letters {
            width: 35px;
            height: 35px;
            background-color: #EFEFEF;
            float: left;
            border: 2px solid #EFEFEF;
            line-height: 37px;
          }

          .m6_more_users {
            font-size: 12px;
            font-weight: 700;
            background-color: #DEDEDE;
          }

          i {
            position: absolute;
            right: 5px;
            bottom: 0;
          }
        }
      }
    }

    .no-display {
      display: none;
    }

    .emojionearea .emojionearea-editor {
      max-height: 8em;
    }

    .m6_messages {
      font-family: 'futura_bk_btbook';
      height: 492px;
      overflow: hidden;
      overflow-y: auto;

      .m6_day {

        .date {
          text-align: right;
          display: block;
        }

        .m6_message {
          display: flex;
          width: 100%;
          margin-bottom: 10px;

          &.found {
            .m6_message_text {
              background-color: yellow !important;
            }
          }

          div {
            width: 90%;
            float: left;

            &:last-child {
              width: 10%;
            }

            &.m6_type {
              width: 90%;

              button.m6_message_text {

                &:hover {
                  background-color: #cbe0e6;
                }
              }
              .m6_message_text {
                width: 80%;
                float: right;
                background-color: #e5f4f9;
                border-radius: 0 5px 5px 0;
                padding: 10px;
                font-size: 12px;
                text-align: left;

                &:focus {
                  outline: none;
                }
              }
              span.datetime {
                float: left;
                display: inline-block;
                width: 100%;
                text-align: right;
                font-size: 10px;
                color: #888;
              }
              .m6_close {
                width: 30px;
                background: #2cafca;
                color: #FFF;
                float: right;
                border-radius: 5px 0 0 5px;
                text-align: center;
                transition: background-color .2s ease-in-out;
                cursor: pointer;

                a {
                  display: block;
                  padding: 8px;
                  color: #FFF;
                }

                &:hover {
                  background-color: red;
                }
              }
            }

            &.type_other {
              width: 90%;
              float: right;
              order: 1;

              .m6_message_text {
                width: 80%;
                float: left;
                background-color: #EFEFEF;
                border-radius: 5px;
                padding: 10px;
                margin-right: 10px;
              }
              span.datetime {
                text-align: left;
              }
            }

            &.m6_profile{
              width: 35px;
              height: 35px;
              background-color: transparent;
              padding: 0;
              float: left;
              text-align: center;
              margin: 0 auto;

              img {
                border-radius: 50%;
                width: 30px;
                height: 30px;
                object-fit: cover;
              }
              .m6_letters {
                background-color: #EFEFEF;
                height: 35px;
                width: 35px;
                float: left;
                line-height: 38px;
                font-size: 12px;
                font-weight: 700;
              }
            }
          }
        }
      }
    }
    .window {
      .m6_messages {

            overflow-y: scroll;
            height: 230px;
      }
    }

    .no-padding {
      padding: 0;
    }


    .dropdown-menu {
      min-width: auto;
      right: 0;
      left: auto;
    }

    .vgt-table {
      margin-bottom: 50px;
    }

    .v-select .dropdown-toggle {
      border-radius: 0;
      margin-bottom: 10px;
      background-color: #FFF;
    }

    label {
      color: #aaa;
      font-family: 'futura_lt_btlight';
      font-weight: 200;

      &.error--text {
        color: red;
      }
    }

    .error--text {
      color: red;
    }

    textarea {
      box-shadow: none;
    }

    input,
    select,
    textarea,
    .v-select .selected-tag {
      color: #0f75bc;
      font-family: 'futura_md_btmedium', Helvetica, Arial, sans-serif;
    }

    .v-select .selected-tag {
      font-size: 11px;
      height: auto;
      line-height: 25px;
      background-color: #f8f8f8;
      color: #878a92;
      margin-bottom: 2px;

      .close {
        span {
          font-size: 10px;
        }
      }
    }
  }
  .vue-tel-input {
    border-radius: 0 !important;
    border: none !important;
    border-bottom: 1px solid #404040 !important;

    &:focus-within {
      -webkit-box-shadow: none !important;
      -moz-box-shadow: none !important;
      box-shadow: none !important;
    }

    ul {
      z-index: 1000;
    }
  }

  .right_content {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .main-content {
    padding: 10px 16px 0px 15px;
    background: #FFF;

    .btn-back {
      background: #f4f4f4;
      margin-left: 15px;
      margin-bottom: 5px;

      i {
        color: #404040;
      }
    }
  }

  .action-container {
    padding: 15px;
    text-align: right;
  }

  .new_thread {
    position: relative;
    padding: 0px 13px 2px;;

    button {
      padding: 12px;
    }
  }

  .nav_left_container {
    padding: 0 0 0 15px;
    overflow-y: auto;
    height: 493px;
  }

  .nav_left_bottom {
    border-top: 1px solid #efefef;
    border-bottom: 1px solid #efefef;

    ul {
      padding: 0 !important;
      margin: 0;
      max-width: 100%;

      li {
        padding: 0;
        width: 25%;

        button, a {
          padding: 15px;
          background-color: #FFF;

          img {
            width: 32px;
            height: 32px;
            object-fit: cover;
          }

          i {
            color: #cccccc;
            font-size:18px;
          }

          &:hover, &.active {
            background-color: #f0f0f0;

            i {
              color: #006fd2;
            }
          }
        }

        &.my_profile {
          position: relative;

          button {
            padding: 0;

            img {

            }
          }
        }
      }


    }
  }
  .only_connected {
    font-size: 12px;
    padding-right: 10px;

  }
  .edit-conversation {

    i {
      transition: .5s;
    }


    &:hover {

      i {
        transform: rotateZ(360deg);
      }
    }
  }
  .top {
    height: 46px;
    border-bottom: 1px solid #efefef;
    display: none;

    .edit-conversation {
      &:hover {
        background-color: #EEE;
      }
    }
  }

  .users_conversation {
    padding: 15px;
    border-bottom: 1px solid #efefef;

    h5 {
      color: #C9C9C9;
    }

    .shared_files {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      height: 172px;
      overflow-y: auto;

      li {
        text-align: center;
      }

      i {
        font-size: 40px;
        margin-bottom: 10px;
        margin-top: 10px;
        transition: .5s;

        &:hover {
          transform: scale(1.2);
        }
      }
      p {
        margin: 0;
        line-height: 14px;
        font-size: 12px;
        color: #888;
      }
      .fa-file-image-o {
        color: #265a7f;
      }
      .fa-file-pdf-o {
        color: #cd3807;
      }
      .fa-file-powerpoint-o {
        color: #ff9d0a;
      }
    }

    .box_users {
      height: 120px;
      overflow-y: auto;

      .user_actions_show {
        width: 200px;
        min-height: 80px;
        position: absolute;
        right: 42px;
        top: 0;
        border: 1px solid #fff;
        background-color: #efefef;
        z-index: 10000;
        padding: 15px;
        box-shadow: 2px 2px 2px #CCC;

        li {
          margin-bottom: 2px;

          button, a {
            font-size: 12px;
          }
        }
      }
    }
    .add_users {
      padding: 10px 0;
      position: relative;

      i {
        color: $color-primary;
        transition: .5s;
      }

      button {

        &:hover {
           i {
             transform: rotateZ(360deg);
           }
        }
      }

      .add_user_box {
        width: 300px;
        min-height: 100px;
        position: absolute;
        right: 0;
        top: 0;
        border: 1px solid #fff;
        background-color: #efefef;
        z-index: 10000;
        padding: 15px;
        box-shadow: 2px 2px 2px #CCC;

        h4 {
          font-size: 14px;
          color: $color-primary;
          text-align: center;
        }
      }
    }
    .user {
      display: grid;
      grid-template-columns: 1fr 6fr 1fr;
      position: relative;

      .image {
        height: 40px;
        display: flex;
        justify-content: center;
        flex-direction: column;
        position: relative;

        span.is_typing {
          position: absolute;
          top: 0;
          right: 0;
          background: #92d5ff;
          width: 20px;
          height: 20px;
          text-align: center;
          border-radius: 50%;

          i {
            position: relative;
            color: #FFF;
            font-size: 10px;
          }
        }

        span.img-circle, img {
          width: 35px;
          height: 35px;
          background-color: #EEE;
          text-align: center;
          line-height: 35px;
          font-size: 12px;
          font-weight: 700;
          transition: .5s;         ;

          &:hover {
            transform: rotateY(180deg);
          }


          &.active {
            border: 2px solid #03a9f4;
          }

        }
      }
      .name {
        display: flex;
        justify-content: center;
        flex-direction: column;
        font-size: 12px;
      }
      .user_actions {
        display: flex;
        justify-content: flex-end;
        padding-right: 0;

        button{
          width: 40px;

          i {
            transition: .5s;
          }

          &:hover {
            background-color: #EEE;

            i {
              transform: rotateZ(360deg);
            }
          }
        }
      }
    }
  }

  .router-anim-enter-active {
    animation: coming .2s;
    opacity: 0;
  }
  .router-anim-leave-active {
    animation: going .2s;
  }

  @keyframes going {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50px);
      opacity: 0;
    }
  }
  @keyframes coming {
    from {
      transform: translateX(-50px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

.emoji-invoker {
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}
.emoji-invoker:hover {
  transform: scale(1.1);
}
.emoji-invoker > svg {
  fill: #b1c6d0;
}

.emoji-picker {
  position: absolute;
  z-index: 1;
  font-family: Montserrat;
  border: 1px solid #ccc;
  width: 15rem;
  height: 20rem;
  overflow: scroll;
  padding: 1rem;
  box-sizing: border-box;
  border-radius: 0.5rem;
  background: #fff;
  box-shadow: 1px 1px 8px #c7dbe6;
  top: -283px !important;
  left: 0 !important;
  right: 0 !important;
}
.emoji-picker__search {
  display: flex;
}
.emoji-picker__search > input {
  flex: 1;
  border-radius: 10rem;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  outline: none;
}
.emoji-picker h5 {
  margin-bottom: 0;
  color: #b1b1b1;
  text-transform: uppercase;
  font-size: 0.8rem;
  cursor: default;
}
.emoji-picker .emojis {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.emoji-picker .emojis:after {
  content: "";
  flex: auto;
}
.emoji-picker .emojis span {
  padding: 0.2rem;
  cursor: pointer;
  border-radius: 5px;
}
.emoji-picker .emojis span:hover {
  background: #ececec;
  cursor: pointer;
}
	$color-primary: #0070d2;
	.expand {
		border-left: 1px solid #CCC;
		.m6_messages {
			height: 492px !important;
			padding: 10px;
		}

		.edit-conversation {
			width: 28px;
			line-height: 40px;
		}

		.expand-conversation {
			float: left;
			width: 30px;
			line-height: 40px;
		}

		.conversation_actions {
          width: 300px;
          height: 200px;
          background-color: #FFF;
          position: absolute;
          top: 46px;
          right: 0;
          border: 1px solid #fff;
          background-color: #efefef;
          z-index: 10000;
          padding: 15px;
          box-shadow: 2px 2px 2px #CCC;

          input {
            border-radius: 0;
          }
          .selected-tag {
            color: #000;
          }
        }


		.actions {
			border-right: 1px solid #efefef;
		}
	}
</style>
