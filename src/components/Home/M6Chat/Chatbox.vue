<template>
  <v-card
    v-if="dataReady"
    class="chat-box d-flex flex-column"
    :class="{
      'fill-height ma-0 pa-0': isForMessenger,
      'mx-2 rounded-card rounded-lg': !isForMessenger,
      'chatbox-mobile': $vuetify.breakpoint.xs,
    }"
    elevation="3"
    :height="isForMessenger ? '' : chatHeight"
    :width="isForMessenger ? '' : chatWidth"
  >
    <M6Loading :loading="showLoading" />
    <v-dialog
      v-model="showImagesGallery"
      fullscreen
      @keydown.esc="() => (showImagesGallery = false)"
      @keydown.left="chatGallery.indexOf(currentGalleryItem--)"
      @keydown.right="chatGallery.indexOf(currentGalleryItem++)"
    >
      <v-card
        class="align-center d-flex gallery-container overflow-hidden px-5"
        :class="{ 'rounded-lg': !isForMessenger }"
      >
        <v-btn
          absolute
          class="mt-10"
          color="white"
          fab
          right
          top
          @click="showImagesGallery = false"
        >
          <v-icon color="black">
            mdi-close
          </v-icon>
        </v-btn>
        <v-row
          align="center"
          justify="center"
        >
          <v-carousel
            v-model="currentGalleryItem"
            class="w-full"
            height="100vh"
            hide-delimiter-background
          >
            <v-carousel-item
              v-for="(img, i) of chatGallery"
              :key="`gallery-item${i}`"
            >
              <div
                class="align-center d-flex justify-center v-image__image v-image__image--cover"
              >
                <img
                  alt=""
                  class="max-w-full"
                  :src="img.source"
                >
              </div>
            </v-carousel-item>
          </v-carousel>
        </v-row>
      </v-card>
    </v-dialog>
    <div
      class="align-center chat-title d-flex justify-space-between px-3"
      :class="[
        minimized ? 'blue lighten-2' : '',
        { 'rounded-lg': !isForMessenger, 'fixed-title-header': isForMessenger },
      ]"
      @click.self="minimizeChatBox"
    >
      <div
        v-if="channel.id.substr(14, 5) === 'group'"
        class="align-center d-flex max-w-half"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-avatar
              v-bind="attrs"
              class="mr-2"
              size="42"
              v-on="on"
              @click="editConfigurationDialog = true"
            >
              <img
                v-if="channel.data.image !== ''"
                :alt="channel.data.image"
                :src="channel.data.image"
              >
              <v-icon v-else>
                mdi-account-group-outline
              </v-icon>
            </v-avatar>
          </template>
          <div>{{ channel.data.member_count }} members</div>
        </v-tooltip>

        <div class="chat-name-wrapper">
          <p
            class="chat-name font-weight-medium ma-0 pa-0 text-body-2"
            :class="[minimized ? 'white--text' : '']"
            :title="channel.data.name"
          >
            {{ channel.data.name }}
          </p>
        </div>
      </div>
      <div
        v-else
        class="align-center d-flex max-w-half"
      >
        <v-badge
          bottom
          class="mr-2"
          :color="users[0].user.online ? 'green accent-3' : 'transparent'"
          dot
          offset-x="10"
          offset-y="10"
        >
          <v-avatar
            class="blue"
            size="42"
          >
            <img
              v-if="users[0].user.image"
              :alt="channel.name"
              class="img-cover"
              :src="users[0].user.image"
            >
            <template v-else>
              <span class="text-uppercase white--text">{{
                channel.membersInChannel.user.name.charAt(0)
              }}</span>
            </template>
          </v-avatar>
        </v-badge>
        <div class="chat-name-wrapper leading-0">
          <p
            class="chat-name font-weight-medium ma-0 pa-0"
            :class="[
              { 'white--text': minimized },
              isForMessenger && $vuetify.breakpoint.mdAndUp
                ? 'text-h6'
                : 'text-body-2',
            ]"
            :title="users[0].user.name"
          >
            {{ users[0].user.name }}
          </p>
          <v-spacer />
          <p
            v-if="!users[0].user.online"
            class="capitalize font-weight-medium ma-0 pa-0 text-caption"
            :class="[minimized ? 'white--text' : 'blue--text']"
          >
            {{ setDate(new Date(users[0].user.last_active)) }}
          </p>
        </div>
      </div>
      <div
        v-if="!showDeleteOptions"
        class="d-flex flex-fill flex-wrap justify-end"
      >
        <v-btn
          class="btn-chat-shadow ma-1"
          :color="callOngoing ? 'blue' : 'white'"
          :dark="callOngoing"
          fab
          x-small
          @click="openVideoCallingDialog"
        >
          <v-icon size="15">
            mdi-video
          </v-icon>
        </v-btn>
        <v-btn
          v-if="channel.id.substr(14, 5) === 'group'"
          class="btn-chat-shadow ma-1"
          color="white"
          fab
          x-small
          @click="editConfigurationDialog = true"
        >
          <v-icon size="15">
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn
          v-if="!isForMessenger"
          class="btn-chat-shadow ma-1"
          color="white"
          fab
          x-small
          @click="chatExpanded = !chatExpanded"
        >
          <v-icon size="15">
            {{ expandIcon }}
          </v-icon>
        </v-btn>
        <v-dialog
          v-if="channel.id.substr(14, 5) === 'group'"
          v-model="editConfigurationDialog"
          max-width="500"
        >
          <edit-configuration-dialog
            v-if="editConfigurationDialog"
            :channel="channel"
            :edit-mode="true"
            @close-dialog="() => (editConfigurationDialog = false)"
          />
        </v-dialog>
        <v-btn
          v-if="
            channel.id.substr(14, 5) === 'group' && owner.user.id === user.id
          "
          class="btn-chat-shadow ma-1"
          color="white"
          fab
          x-small
          @click="deleteAll"
        >
          <v-icon size="15">
            mdi-delete
          </v-icon>
        </v-btn>
        <v-btn
          v-if="channel.id.substr(14, 5) !== 'group'"
          class="btn-chat-shadow ma-1"
          color="white"
          fab
          x-small
          @click="deleteAll"
        >
          <v-icon size="15">
            mdi-delete
          </v-icon>
        </v-btn>
        <v-btn
          class="btn-chat-shadow ma-1"
          color="white"
          fab
          x-small
          @click="closeChat"
        >
          <v-icon size="15">
            mdi-close
          </v-icon>
        </v-btn>
      </div>
      <div
        v-else
        class="d-flex flex-wrap justify-end"
      >
        <v-tooltip
          bottom
          color="#7c7c7c"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="btn-chat-shadow ma-1"
              color="white"
              fab
              x-small
              v-on="on"
              @click="deleteMessages"
            >
              <v-icon size="15">
                mdi-delete
              </v-icon>
            </v-btn>
          </template>
          <span>Delete Selected</span>
        </v-tooltip>
        <v-tooltip
          bottom
          color="#7c7c7c"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              class="btn-chat-shadow ma-1"
              color="white"
              fab
              x-small
              v-on="on"
              @click="deleteAll"
            >
              Group
            </v-btn>
          </template>
          <span>Delete Group</span>
        </v-tooltip>

        <v-btn
          class="btn-chat-shadow ma-1"
          color="white"
          fab
          x-small
          @click="showDeleteOptions = false"
        >
          <v-icon size="15">
            mdi-arrow-left-circle
          </v-icon>
        </v-btn>
      </div>
    </div>
    <v-divider
      class="divider-chat"
      :class="[minimized ? 'd-none' : '']"
    />
    <!-- Messages Container -->
    <div
      ref="messagesRef"
      class="ml-2 pb-4 px-1 white"
      :class="[
        !isForMessenger ? 'ml-2 pb-4 px-1 white messages-container' : null,
        minimized ? 'd-none' : 'h-full',
      ]"
    >
      <div
        v-if="messages.length === 0"
        class="align-center d-flex flex-column grey--text h-full justify-center px-3 text-caption"
      >
        <div class="d-flex justify-center w-full">
          <v-icon
            class="grey--text text--lighten-1"
            size="40"
          >
            mdi-message-settings-outline
          </v-icon>
        </div>
        <div class="align-center d-flex mt-3 text-caption w-full">
          <v-divider class="blue-grey lighten-5" />
          <span class="grey--text mx-3 text--lighten-1">No messages yet</span>
          <v-divider class="blue-grey lighten-5" />
        </div>
      </div>
      <!-- Message Bubble -->
      <div v-if="!isForMessenger">
        <div
          v-for="(message, index) in messages"
          :key="'message-' + channel.userId + '-' + index"
        >
          <!-- Day Divider -->
          <div
            v-if="dayDivider(message.created_at, index).show"
            class="align-center d-flex grey--text my-2 text-caption"
          >
            <v-divider class="blue-grey lighten-5" />
            <span class="mx-3">{{
              dayDivider(message.created_at, index).value
            }}</span>
            <v-divider class="blue-grey lighten-5" />
          </div>
          <div
            class="d-flex message-container"
            :class="[
              message['panel'] && message['panel']['id']
                ? 'mx-0'
                : user.id === message.user.id
                  ? 'ml-auto'
                  : 'mr-auto',
            ]"
          >
            <template v-if="user.id === message.user.id">
              <div class="d-flex flex-column ml-auto mx-66">
                <div class="align-baseline d-flex justify-end">
                  <div
                    v-if="
                      dayDivider(message.created_at, index).show ||
                        !isMessageFromSameUser(index)
                    "
                    class="mr-2 mt-1 text-caption text-nowrap text-right"
                  >
                    {{
                      `${messageTime(message.created_at)} ${message.user.name}`
                    }}
                  </div>
                  <div
                    v-if="
                      dayDivider(message.created_at, index).show ||
                        !isMessageFromSameUser(index)
                    "
                    class="d-flex grey--text mt-1 text-caption text-nowrap"
                  >
                    <img
                      v-if="message.user.image"
                      :alt="channel.name"
                      class="img-cover mr-3 rounded-circle"
                      height="30"
                      :src="message.user.image"
                      width="30"
                    >
                    <div
                      v-else
                      class="align-center avatar blue d-flex justify-center mr-2 rounded-pill"
                    >
                      <span class="text-uppercase white--text">
                        {{ message.user.name.charAt(0) }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="d-flex flex-column">
                  <div
                    :id="message.id"
                    class="my-message-content"
                    :class="
                      message.latest_reactions.length > 0 ? 'mb-7' : 'mb-0'
                    "
                  >
                    <div class="my-actions">
                      <v-menu
                        bottom
                        left
                        open-on-hover
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            v-bind="attrs"
                            class="grey--text"
                            dark
                            icon
                            small
                            v-on="on"
                          >
                            mdi-dots-vertical
                          </v-icon>
                        </template>

                        <v-list dense>
                          <v-list-item-group>
                            <v-list-item>
                              <v-list-item-content @click="edit(message)">
                                <v-list-item-title>Edit</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content @click="quoteMessage(index)">
                                <v-list-item-title>Reply</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                              <v-list-item-content
                                @click="deleteMessages(message)"
                              >
                                <v-list-item-title>Delete</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-menu>
                      <delete-dialog
                        v-if="messageEdit === message.id + message.id"
                        :element="`message '${message.text}'`"
                        @closeDeleteModal="beforeDelete($event, message.id)"
                      />
                    </div>
                    <div class="align-end d-flex flex-column">
                      <div
                        class="arrow-up mb-1 message-arrow ml-1 mr-2 py-2 relative text-body-2 text-left w-fit"
                        :class="
                          message['panel'] && message['panel']['id']
                            ? 'px-2'
                            : 'px-3'
                        "
                      >
                        <template v-if="!message.images">
                          <v-skeleton-loader
                            v-if="
                              index === messages.length - 1 &&
                                (srcImageFiles.length !== 0 ||
                                  srcVideoFiles.length !== 0)
                            "
                            class="mx-auto"
                            height="100"
                            type="card"
                            width="100"
                          />
                        </template>
                        <div
                          v-else
                          class="d-flex flex-wrap ml-auto w-fit"
                        >
                          <div
                            v-for="(image, ind) in message.images"
                            :key="'imagemsg-' + ind"
                            class="mt-1 mx-1 relative w-fit"
                          >
                            <template v-if="image">
                              <img
                                v-if="
                                  image
                                    .split('/')
                                    .slice(-2)[0]
                                    .toUpperCase() === 'IMAGE'
                                "
                                class="image-preview"
                                :src="image"
                                @click="openChatGallery(image)"
                              >
                            </template>
                          </div>
                        </div>
                        <div
                          v-if="message.files"
                          class="d-flex flex-wrap ml-auto w-fit"
                        >
                          <v-row
                            v-if="
                              message['files'] && message['files'].length > 0
                            "
                            class="my-1 px-1"
                          >
                            <v-col
                              v-for="(file, messIndex) of message['files']"
                              :key="messIndex + '-file'"
                              class="align-start d-flex my-0 py-0"
                              cols="12"
                            >
                              <v-icon
                                color="white"
                                @click="redirect(file)"
                              >
                                {{ message["fileIcons"][file] }}
                              </v-icon>
                              <p
                                class="font-weight-bold leading-tight mx-1 my-0 pointer py-0 text-caption"
                                @click="redirect(file)"
                              >
                                {{
                                  file
                                    .substring(file.lastIndexOf("/") + 1)
                                    .replace(/%20/g, " ")
                                    .replace("%28", "(")
                                    .replace("%29", ")")
                                }}
                              </p>
                            </v-col>
                          </v-row>
                        </div>
                      </div>
                      <div
                        v-if="message.html"
                        class="arrow-up mb-1 message-arrow ml-1 mr-2 my-message py-2 relative text-body-2 text-left w-fit"
                        :class="
                          message['panel'] && message['panel']['id']
                            ? 'px-2'
                            : 'px-3'
                        "
                        @click="(e) => onClickMessage(e, message)"
                      >
                        <div v-if="message.quoted_message">
                          <message-quote
                            :in-message="true"
                            :message="message.quoted_message"
                            :own-message="true"
                          />
                        </div>
                        <p
                          class="ma-0 mb-0 pa-0"
                          v-html="message.html"
                        />
                        <div class="own-reaction-container">
                          <template
                            v-for="(reaction, idx) in message.latest_reactions"
                          >
                            <span
                              v-if="reaction.myCustomField"
                              :key="idx"
                              class="elevation-3 pa-1 rounded-pill white"
                            >
                              {{ reaction.myCustomField }}
                            </span>
                          </template>
                        </div>
                      </div>
                    </div>

                    <div class="align-end d-flex z-20">
                      <span>
                        {{ hasMessageBeenViewed(message) ? "R" : "S" }}
                      </span>
                      <v-checkbox
                        v-if="showDeleteOptions"
                        v-model="deleteIds"
                        dense
                        :value="message.id"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <div
              v-else
              class="d-flex received-message relative"
            >
              <div
                v-if="
                  dayDivider(message.created_at, index).show ||
                    !isMessageFromSameUser(index)
                "
                class="mt-1"
              >
                <img
                  v-if="message.user.image"
                  :alt="channel.name"
                  class="img-cover mr-3 rounded-circle"
                  height="30"
                  :src="message.user.image"
                  width="30"
                >
                <div
                  v-else
                  class="align-center avatar blue d-flex justify-center mr-2 rounded-pill"
                >
                  <span class="text-uppercase white--text">
                    {{ message.user.name.charAt(0) }}
                  </span>
                </div>
              </div>

              <v-card
                v-else
                class="mr-3 mt-1"
                elevation="0"
                height="30px"
                min-width="30px"
              />
              <div
                class="flex-grow-1 flex-shrink-1"
                :class="message.own_reactions.length > 0 ? 'mb-7' : 'mb-0'"
              >
                <div
                  v-if="
                    dayDivider(message.created_at, index).show ||
                      !isMessageFromSameUser(index)
                  "
                  class="align-center d-flex mr-auto mt-1 text-caption text-nowrap"
                >
                  {{
                    `${message.user.name} ${messageTime(message.created_at)}`
                  }}
                </div>
                <div
                  :id="message.id"
                  class="d-flex mx-66"
                >
                  <div class="d-flex flex-column">
                    <div
                      v-if="message.images || message.files"
                      class="arrow-down mb-1 message-arrow mr-1 mx-100 py-2 relative text-body-2 text-left"
                      :class="
                        message['panel'] && message['panel']['id']
                          ? 'px-2'
                          : 'px-3'
                      "
                    >
                      <template
                        v-if="message.images"
                        class=""
                      >
                        <div
                          v-for="(image, messIndex) in message.images"
                          :key="'imagemsg-' + messIndex"
                          class="d-flex mr-auto mt-2 mx-1"
                        >
                          <template v-if="image">
                            <v-img
                              v-if="
                                image
                                  .split('/')
                                  .slice(-2)[0]
                                  .toUpperCase() === 'IMAGE'
                              "
                              class="image-preview"
                              contain
                              :src="image"
                              @click="openChatGallery(image)"
                            />
                          </template>
                        </div>
                      </template>
                      <div
                        v-if="message.files"
                        class="d-flex flex-wrap ml-auto w-fit"
                      >
                        <v-row
                          v-if="message['files'] && message['files'].length > 0"
                          class="my-2 px-1"
                        >
                          <v-col
                            v-for="(file, messIndex) of message['files']"
                            :key="messIndex + '-file'"
                            class="my-0 py-0"
                            cols="12"
                          >
                            <v-icon @click="redirect(file)">
                              {{ message["fileIcons"][file] }}
                            </v-icon>
                            <p
                              class="mx-1 my-0 pointer py-0"
                              @click="redirect(file)"
                            >
                              {{
                                file
                                  .substring(file.lastIndexOf("/") + 1)
                                  .replace(/%20/g, " ")
                                  .replace("%28", "(")
                                  .replace("%29", ")")
                              }}
                            </p>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                    <div
                      v-if="message.html"
                      class="arrow-down mb-1 message-arrow mr-1 mx-100 other-message py-2 relative text-body-2 text-left"
                      :class="
                        message['panel'] && message['panel']['id']
                          ? 'px-2'
                          : 'px-3'
                      "
                    >
                      <div v-if="message.quoted_message">
                        <message-quote
                          :in-message="true"
                          :message="message.quoted_message"
                          :own-message="false"
                        />
                      </div>
                      <p
                        class="ma-0 mb-0 pa-0"
                        v-html="message.html"
                      />
                    </div>
                  </div>
                  <chat-reaction-box
                    @react-with-emoji="
                      (emoji) => handleReactWithEmoji(message, emoji)
                    "
                  />
                  <v-menu
                    bottom
                    left
                    open-on-hover
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        class="menu-button"
                        dark
                        icon
                        v-on="on"
                      >
                        <v-icon
                          class="grey--text"
                          small
                        >
                          mdi-dots-vertical
                        </v-icon>
                      </v-btn>
                    </template>

                    <v-list dense>
                      <v-list-item-group>
                        <v-list-item>
                          <v-list-item-content @click="quoteMessage(index)">
                            <v-list-item-title>Reply</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-menu>
                </div>
                <div class="reaction-container">
                  <template v-for="(reaction, idx) in message.own_reactions">
                    <span
                      v-if="reaction.myCustomField"
                      :key="idx"
                      class="elevation-3 pa-1 rounded-pill white"
                    >
                      {{ reaction.myCustomField }}
                    </span>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <record-url
            v-if="message['panel'] && message['panel']['id']"
            class="mb-2"
            :record-info="message['panel']"
            :type="'message'"
          />
          <external-url
            v-if="
              urlify(message.text)['urls'].length > 0 &&
                urlify(message.text)['youtubeUrls'].length === 0
            "
            class="mb-2"
            :urls="urlify(message.text)['urls']"
          />
          <youtube-video
            v-if="urlify(message.text)['youtubeUrls'].length > 0"
            class="mb-2"
            :urls="urlify(message.text)['youtubeUrls']"
          />
          <div
            v-for="(row, imageIndex) in message.images"
            :key="imageIndex"
            class="video-list__container"
          >
            <template v-if="row">
              <video
                v-if="
                  row
                    .split('/')
                    .slice(-2)[0]
                    .toUpperCase() === 'VIDEO'
                "
                controls
              >
                <source :src="row">
              </video>
            </template>
          </div>
        </div>
      </div>
      <div
        v-else
        class="fixed-message-content messages-container"
      >
        <div>
          <div
            v-for="(message, index) in messages"
            :key="'message-' + channel.userId + '-' + index"
          >
            <!-- Day Divider -->
            <div
              v-if="dayDivider(message.created_at, index).show"
              class="align-center d-flex grey--text my-2 text-caption"
            >
              <v-divider class="blue-grey lighten-5" />
              <span class="mx-3">{{
                dayDivider(message.created_at, index).value
              }}</span>
              <v-divider class="blue-grey lighten-5" />
            </div>
            <div
              class="d-flex message-container"
              :class="[
                message['panel'] && message['panel']['id']
                  ? 'mx-0'
                  : user.id === message.user.id
                    ? 'ml-auto'
                    : 'mr-auto',
              ]"
            >
              <template v-if="user.id === message.user.id">
                <div class="d-flex flex-column ml-auto mx-66">
                  <div class="align-baseline d-flex justify-end">
                    <div
                      v-if="
                        dayDivider(message.created_at, index).show ||
                          !isMessageFromSameUser(index)
                      "
                      class="mr-2 mt-1 text-caption text-nowrap text-right"
                    >
                      {{
                        `${messageTime(message.created_at)} ${
                          message.user.name
                        }`
                      }}
                    </div>
                    <div
                      v-if="
                        dayDivider(message.created_at, index).show ||
                          !isMessageFromSameUser(index)
                      "
                      class="d-flex grey--text mt-1 text-caption text-nowrap"
                    >
                      <img
                        v-if="message.user.image"
                        :alt="channel.name"
                        class="img-cover mr-3 rounded-circle"
                        height="30"
                        :src="message.user.image"
                        width="30"
                      >
                      <div
                        v-else
                        class="align-center avatar blue d-flex justify-center mr-2 rounded-pill"
                      >
                        <span class="text-uppercase white--text">
                          {{ message.user.name.charAt(0) }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="d-flex flex-column">
                    <div
                      :id="message.id"
                      class="my-message-content"
                      :class="
                        message.latest_reactions.length > 0 ? 'mb-7' : 'mb-0'
                      "
                    >
                      <div class="my-actions">
                        <v-menu
                          bottom
                          left
                          nudge-top="50"
                          open-on-hover
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon
                              v-bind="attrs"
                              class="grey--text"
                              dark
                              icon
                              small
                              v-on="on"
                            >
                              mdi-dots-vertical
                            </v-icon>
                          </template>

                          <v-list dense>
                            <v-list-item-group>
                              <v-list-item>
                                <v-list-item-content @click="edit(message)">
                                  <v-list-item-title>Edit</v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                              <v-list-item>
                                <v-list-item-content
                                  @click="quoteMessage(index)"
                                >
                                  <v-list-item-title>Reply</v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                              <v-list-item>
                                <v-list-item-content
                                  @click="deleteMessages(message)"
                                >
                                  <v-list-item-title>Delete</v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </v-menu>
                        <delete-dialog
                          v-if="messageEdit === message.id + message.id"
                          :element="`message '${message.text}'`"
                          @closeDeleteModal="beforeDelete($event, message.id)"
                        />
                      </div>
                      <div class="align-end d-flex flex-column">
                        <div
                          class="arrow-up mb-1 message-arrow ml-1 mr-2 py-2 relative text-body-2 text-left w-fit"
                          :class="
                            message['panel'] && message['panel']['id']
                              ? 'px-2'
                              : 'px-3'
                          "
                        >
                          <template v-if="!message.images">
                            <v-skeleton-loader
                              v-if="
                                index === messages.length - 1 &&
                                  (srcImageFiles.length !== 0 ||
                                    srcVideoFiles.length !== 0)
                              "
                              class="mx-auto"
                              height="100"
                              type="card"
                              width="100"
                            />
                          </template>
                          <div
                            v-else
                            class="d-flex flex-wrap ml-auto w-fit"
                          >
                            <div
                              v-for="(image, ind) in message.images"
                              :key="'imagemsg-' + ind"
                              class="mt-1 mx-1 relative w-fit"
                            >
                              <template v-if="image">
                                <img
                                  v-if="
                                    image
                                      .split('/')
                                      .slice(-2)[0]
                                      .toUpperCase() === 'IMAGE'
                                  "
                                  class="image-preview"
                                  :src="image"
                                  @click="openChatGallery(image)"
                                >
                              </template>
                            </div>
                          </div>
                          <div
                            v-if="message.files"
                            class="d-flex flex-wrap ml-auto w-fit"
                          >
                            <v-row
                              v-if="
                                message['files'] && message['files'].length > 0
                              "
                              class="my-1 px-1"
                            >
                              <v-col
                                v-for="(file, messIndex) of message['files']"
                                :key="messIndex + '-file'"
                                class="align-start d-flex my-0 py-0"
                                cols="12"
                              >
                                <v-icon
                                  color="white"
                                  @click="redirect(file)"
                                >
                                  {{ message["fileIcons"][file] }}
                                </v-icon>
                                <p
                                  class="font-weight-bold leading-tight mx-1 my-0 pointer py-0 text-caption"
                                  @click="redirect(file)"
                                >
                                  {{
                                    file
                                      .substring(file.lastIndexOf("/") + 1)
                                      .replace(/%20/g, " ")
                                      .replace("%28", "(")
                                      .replace("%29", ")")
                                  }}
                                </p>
                              </v-col>
                            </v-row>
                          </div>
                        </div>
                        <div
                          v-if="message.html"
                          class="arrow-up mb-1 message-arrow ml-1 mr-2 my-message py-2 relative text-body-2 text-left w-fit"
                          :class="
                            message['panel'] && message['panel']['id']
                              ? 'px-2'
                              : 'px-3'
                          "
                          @click="(e) => onClickMessage(e, message)"
                        >
                          <div v-if="message.quoted_message">
                            <message-quote
                              :in-message="true"
                              :message="message.quoted_message"
                              :own-message="true"
                            />
                          </div>
                          <p
                            class="ma-0 mb-0 pa-0"
                            v-html="message.html"
                          />
                          <div class="own-reaction-container">
                            <template
                              v-for="(reaction,
                                      idx) in message.latest_reactions"
                            >
                              <span
                                v-if="reaction.myCustomField"
                                :key="idx"
                                class="elevation-3 pa-1 rounded-pill white"
                              >
                                {{ reaction.myCustomField }}
                              </span>
                            </template>
                          </div>
                        </div>
                      </div>

                      <div class="align-end d-flex z-20">
                        <span>
                          {{ hasMessageBeenViewed(message) ? "R" : "S" }}
                        </span>
                        <v-checkbox
                          v-if="showDeleteOptions"
                          v-model="deleteIds"
                          dense
                          :value="message.id"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
              <div
                v-else
                class="d-flex received-message relative"
              >
                <div
                  v-if="
                    dayDivider(message.created_at, index).show ||
                      !isMessageFromSameUser(index)
                  "
                  class="mt-1"
                >
                  <img
                    v-if="message.user.image"
                    :alt="channel.name"
                    class="img-cover mr-3 rounded-circle"
                    height="30"
                    :src="message.user.image"
                    width="30"
                  >
                  <div
                    v-else
                    class="align-center avatar blue d-flex justify-center mr-2 rounded-pill"
                  >
                    <span class="text-uppercase white--text">
                      {{ message.user.name.charAt(0) }}
                    </span>
                  </div>
                </div>

                <v-card
                  v-else
                  class="mr-3 mt-1"
                  elevation="0"
                  height="30px"
                  min-width="30px"
                />
                <div
                  class="flex-grow-1 flex-shrink-1"
                  :class="message.own_reactions.length > 0 ? 'mb-7' : 'mb-0'"
                >
                  <div
                    v-if="
                      dayDivider(message.created_at, index).show ||
                        !isMessageFromSameUser(index)
                    "
                    class="align-center d-flex mr-auto mt-1 text-caption text-nowrap"
                  >
                    {{
                      `${message.user.name} ${messageTime(message.created_at)}`
                    }}
                  </div>
                  <div
                    :id="message.id"
                    class="d-flex mx-66"
                  >
                    <div class="d-flex flex-column">
                      <div
                        v-if="message.images || message.files"
                        class="arrow-down mb-1 message-arrow mr-1 mx-100 py-2 relative text-body-2 text-left"
                        :class="
                          message['panel'] && message['panel']['id']
                            ? 'px-2'
                            : 'px-3'
                        "
                      >
                        <template
                          v-if="message.images"
                          class=""
                        >
                          <div
                            v-for="(image, messIndex) in message.images"
                            :key="'imagemsg-' + messIndex"
                            class="d-flex mr-auto mt-2 mx-1"
                          >
                            <template v-if="image">
                              <v-img
                                v-if="
                                  image
                                    .split('/')
                                    .slice(-2)[0]
                                    .toUpperCase() === 'IMAGE'
                                "
                                class="image-preview"
                                contain
                                :src="image"
                                @click="openChatGallery(image)"
                              />
                            </template>
                          </div>
                        </template>
                        <div
                          v-if="message.files"
                          class="d-flex flex-wrap ml-auto w-fit"
                        >
                          <v-row
                            v-if="
                              message['files'] && message['files'].length > 0
                            "
                            class="my-2 px-1"
                          >
                            <v-col
                              v-for="(file, messIndex) of message['files']"
                              :key="messIndex + '-file'"
                              class="my-0 py-0"
                              cols="12"
                            >
                              <v-icon @click="redirect(file)">
                                {{ message["fileIcons"][file] }}
                              </v-icon>
                              <p
                                class="mx-1 my-0 pointer py-0"
                                @click="redirect(file)"
                              >
                                {{
                                  file
                                    .substring(file.lastIndexOf("/") + 1)
                                    .replace(/%20/g, " ")
                                    .replace("%28", "(")
                                    .replace("%29", ")")
                                }}
                              </p>
                            </v-col>
                          </v-row>
                        </div>
                      </div>
                      <div
                        v-if="message.html"
                        class="arrow-down mb-1 message-arrow mr-1 mx-100 other-message py-2 relative text-body-2 text-left"
                        :class="
                          message['panel'] && message['panel']['id']
                            ? 'px-2'
                            : 'px-3'
                        "
                      >
                        <div v-if="message.quoted_message">
                          <message-quote
                            :in-message="true"
                            :message="message.quoted_message"
                            :own-message="false"
                          />
                        </div>
                        <p
                          class="ma-0 mb-0 pa-0"
                          v-html="message.html"
                        />
                      </div>
                    </div>
                    <chat-reaction-box
                      @react-with-emoji="
                        (emoji) => handleReactWithEmoji(message, emoji)
                      "
                    />
                    <v-menu
                      bottom
                      left
                      open-on-hover
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          v-bind="attrs"
                          class="menu-button"
                          dark
                          icon
                          v-on="on"
                        >
                          <v-icon
                            class="grey--text"
                            small
                          >
                            mdi-dots-vertical
                          </v-icon>
                        </v-btn>
                      </template>

                      <v-list dense>
                        <v-list-item-group>
                          <v-list-item>
                            <v-list-item-content @click="quoteMessage(index)">
                              <v-list-item-title>Reply</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-menu>
                  </div>
                  <div class="reaction-container">
                    <template v-for="(reaction, idx) in message.own_reactions">
                      <span
                        v-if="reaction.myCustomField"
                        :key="idx"
                        class="elevation-3 pa-1 rounded-pill white"
                      >
                        {{ reaction.myCustomField }}
                      </span>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <record-url
              v-if="message['panel'] && message['panel']['id']"
              class="mb-2"
              :record-info="message['panel']"
              :type="'message'"
            />
            <external-url
              v-if="
                urlify(message.text)['urls'].length > 0 &&
                  urlify(message.text)['youtubeUrls'].length === 0
              "
              class="mb-2"
              :urls="urlify(message.text)['urls']"
            />
            <youtube-video
              v-if="urlify(message.text)['youtubeUrls'].length > 0"
              class="mb-2"
              :urls="urlify(message.text)['youtubeUrls']"
            />
            <div
              v-for="(row, imageIndex) in message.images"
              :key="imageIndex"
              class="video-list__container"
            >
              <template v-if="row">
                <video
                  v-if="
                    row
                      .split('/')
                      .slice(-2)[0]
                      .toUpperCase() === 'VIDEO'
                  "
                  controls
                >
                  <source :src="row">
                </video>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Emoji Picker -->
    <div
      class="relative"
      :class="[minimized ? 'd-none' : '']"
    >
      <v-emoji-picker
        v-show="showDialog"
        class="absolute bottom-0 card-custom-shadow emoji-component grey lighten-5"
        label-search="Search"
        lang="en"
        @select="onSelectEmoji"
      />
    </div>

    <v-divider
      class="blue-grey lighten-5"
      :class="[minimized ? 'd-none' : '']"
    />
    <!-- Files -->
    <template v-if="docFiles.length > 0 && !hideFilesPreview">
      <div class="d-flex docs images-container mx-1 px-0 py-1">
        <div
          v-for="(docFile, index) in docFiles"
          :key="'previewdoc-' + index"
          class="align-center blue d-flex justify-center mx-1 previewdoc px-2 rounded-pill"
        >
          <v-icon
            class="white--text"
            left
          >
            mdi-file-outline
          </v-icon>
          <span class="docfile-name text-caption white--text">{{
            docFile.name
          }}</span>

          <v-icon
            class="blue lighten-2 ml-2 pa-1 rounded-xl white--text"
            size="12"
            @click="removeDoc(index)"
          >
            mdi-close
          </v-icon>
        </div>
      </div>
    </template>
    <v-divider
      class="blue-grey lighten-5"
      :class="[minimized ? 'd-none' : '']"
    />
    <!-- Images -->
    <template v-if="srcImageFiles.length > 0 && !hideFilesPreview">
      <div class="d-flex images-container mx-1 px-0 py-3">
        <div
          v-for="(srcImageFile, index) in srcImageFiles"
          :key="'previewimage-' + index"
          class="mx-1 relative w-fit"
        >
          <img
            class="image-preview"
            :src="srcImageFile"
          >
          <v-btn
            class="absolute btn-chat-shadow ml-2 right-0 top-0 v-close-btn"
            color="grey lighten-2"
            fab
            @click="removeImage(index)"
          >
            <v-icon size="12">
              mdi-close
            </v-icon>
          </v-btn>
        </div>
      </div>
    </template>
    <!-- Videos -->
    <template v-if="srcVideoFiles.length > 0 && !hideFilesPreview">
      <div class="d-flex images-container mx-1 px-0 py-0">
        <div
          v-for="(srcVideo, index) in srcVideoFiles"
          :key="'previewimage-' + index"
          class="mx-1 relative w-fit"
        >
          <video
            controls
            height="100"
            width="100"
          >
            <source
              :src="srcVideo.url"
              :type="srcVideo.type"
            >
            Your browser does not support the video tag.
          </video>
          <v-btn
            class="absolute btn-chat-shadow ml-2 right-0 top-0 v-close-btn"
            color="grey lighten-2"
            fab
            @click="removeImage(index)"
          >
            <v-icon size="12">
              mdi-close
            </v-icon>
          </v-btn>
        </div>
      </div>
    </template>
    <p
      v-show="Object.keys(whoTyping).length > 0"
      class="font-italic mx-5 my-0 text-caption"
    >
      User {{ whoTyping.name }} is typing
    </p>
    <div
      class="align-center card-custom-shadow chat-send-section d-flex px-5 py-2"
      :class="{
        'fixed-message-input': isForMessenger,
        'w-full': !$vuetify.breakpoint.mdAndUp,
      }"
    >
      <v-menu
        :close-on-content-click="true"
        content-class="elevation-0"
        elevation="0"
        :offset-y="offset"
        top
      >
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            class="align-center btns-message d-flex justify-center white--text"
            elevation="0"
            fab
            height="25"
            width="25"
            x-small
            v-on="on"
          >
            <v-icon size="19">
              mdi-plus
            </v-icon>
          </v-btn>
        </template>

        <v-list
          class="mb-2 pa-0"
          color="transparent"
          elevation="0"
        >
          <v-list-item
            class="ma-0 pa-0 uploadfile-btn"
            elevation="20"
          >
            <v-tooltip
              class="tooltip-upload-file"
              left
            >
              <template #activator="{ on, attrs }">
                <div
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <span
                class="black--text blue lighten-2 pa-1 rounded text-caption white--text"
              >Record</span>
            </v-tooltip>
          </v-list-item>
          <v-list-item class="ma-0 pa-0 uploadfile-btn">
            <v-tooltip
              class="tooltip-upload-file"
              left
            >
              <template #activator="{ on, attrs }">
                <div
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-file-input
                    accept="image/*, image/heif, image/heic, video/*, video/mp4, video/x-m4v, video/x-matroska, .mkv"
                    class="align-center d-flex justify-center ma-0 pa-0 upload-icon white--text"
                    hide-input
                    multiple
                    prepend-icon="mdi-image"
                    @change="onImagesChange($event)"
                  />
                </div>
              </template>
              <span
                class="black--text blue lighten-2 pa-1 rounded text-caption white--text"
              >Image/Video</span>
            </v-tooltip>
          </v-list-item>
          <v-list-item class="ma-0 pa-0 uploadfile-btn">
            <v-tooltip
              class="tooltip-upload-file"
              left
            >
              <template #activator="{ on, attrs }">
                <div
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-file-input
                    class="align-center d-flex justify-center ma-0 pa-0 upload-icon white--text"
                    hide-input
                    multiple
                    prepend-icon="mdi-file-outline"
                    @change="onDocsChange($event)"
                  />
                </div>
              </template>
              <span
                class="black--text blue lighten-2 pa-1 rounded text-caption white--text"
              >Document</span>
            </v-tooltip>
          </v-list-item>
        </v-list>
      </v-menu>
      <div class="message-input-container">
        <template v-if="!minimized && messageQuote !== ''">
          <message-quote
            :message="messages[messageQuote]"
            @close="cancelSendMessage"
          />
        </template>
        <v-textarea
          id="message-post-textarea"
          ref="inputMessage"
          v-model.trim="valueInput"
          auto-grow
          class="h-full outline-none pa-0 px-2 text-body-1 w-full"
          placeholder="Type a message here..."
          rows="1"
          @keydown="onInputMessage"
          @keydown.enter.exact.prevent
          @keyup.enter.exact="sendMessage"
          @keyup.esc="cancelSendMessage"
          @keyup.esc.exact="cancelMessage"
          @paste="onPasteImage($event)"
        />
      </div>
      <v-btn
        class="btn-chat-shadow grey--text mr-2"
        fab
        height="23"
        width="23"
        x-small
        @click="toggleDialogEmoji"
      >
        <v-icon size="22">
          mdi-emoticon-happy-outline
        </v-icon>
      </v-btn>
      <v-btn
        class="btns-message white--text"
        fab
        height="25"
        icon
        width="25"
        x-small
        @click="sendMessage"
      >
        <v-icon
          class="-rotate-45"
          size="13"
        >
          mdi-send
        </v-icon>
      </v-btn>
    </div>
    <m6-confirm-delete
      message="Are you sure you want to delete these messages?"
      no-text="Cancel"
      :show="showChatMessageDelete"
      :theme="2"
      title="Delete Messages"
      yes-text="Remove"
      @cancel="cancelMessagesDelete"
      @confirm="confirmMessagesDelete"
    />

    <m6-confirm-delete
      message="Are you sure you want to delete this chat?"
      :show="showChatDeleteModal"
      title="Delete Chat"
      @cancel="cancelChatDelete"
      @confirm="confirmChatDelete"
    />
  </v-card>
</template>

<script>
/* eslint-disable camelcase */
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { VEmojiPicker } from 'v-emoji-picker'
import EditConfigurationDialog from '@/components/Dialogs/EditConfiguration'
import ExternalUrl from '@/components/Home/SocialMedia/ExternalUrl.vue'
import YoutubeVideo from '@/components/Home/SocialMedia/YoutubeVideo'
import RecordUrl from '@/components/Home/SocialMedia/RecordUrl.vue'
import ChatReactionBox from './ChatReactionBox'
import moment from 'moment'
import MessageQuote from './MessageQuote.vue'

export default {
  name: 'Chatbox',
  components: {
    EditConfigurationDialog,
    VEmojiPicker,
    ExternalUrl,
    RecordUrl,
    YoutubeVideo,
    ChatReactionBox,
    MessageQuote
  },
  props: {
    channel: {
      type: Object,
      default: () => {}
    },
    isForMessenger: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    deleteDialog: false,
    showLoading: false,
    showImagesGallery: false,
    currentGalleryItem: 0,
    hover: false,
    menu: false,
    input: '',
    display: true,
    whoTyping: {},
    chatGallery: [],
    // user id john doe
    currentUserId: 2,
    messageEdit: '',
    messageEditInput: '',
    messageQuote: '',
    editConfigurationDialog: false,
    dataReady: false,
    messages: [],
    state: {
      messages: [],
      members: [],
      channel: {}
    },
    valueInput: '',
    itemInfo: {
      application_id: null,
      record_id: null,
      panel: null
    },
    showDialog: false,
    imageFiles: [],
    docFiles: [],
    offset: true,
    minimized: false,
    urlInfo: {},
    options: {
      records: [],
      panles: [],
      type: []
    },
    availableApps: [],
    hideFilesPreview: false,
    chatExpanded: false,
    showDeleteOptions: false,
    deleteIds: [],
    showChatMessageDelete: false,
    showChatDeleteModal: false,
    callOngoing: false
  }),
  computed: {
    ...mapGetters('Auth', { user: 'getUser' }),
    ...mapGetters('GSChat', { client: 'client' }),
    expandIcon() {
      return this.chatExpanded ? 'mdi-arrow-collapse' : 'mdi-arrow-expand'
    },
    groupedMessages() {
      return this.messages.reduce(function (r, a) {
        r[a.date.day] = [...(r[a.date.day] || []), a]
        return r
      }, {})
    },
    owner: function () {
      return this.state.members.find(r => r.role === 'owner')
    },
    users: function () {
      const users = []
      Object.keys(this.channel.state.members).forEach(userKey => {
        if (userKey !== this.user.id) {
          users.push(this.channel.state.members[userKey])
        }
      })
      return users
    },
    srcImageFiles() {
      const srcImages = []
      this.imageFiles.forEach(imageFile => {
        if (
          imageFile['type'].substr(0, imageFile['type'].indexOf('/')) ===
          'image'
        ) {
          srcImages.push(URL.createObjectURL(imageFile))
        }
      })
      return srcImages
    },
    srcVideoFiles() {
      const srcVideo = []
      this.imageFiles.forEach(file => {
        if (file['type'].substr(0, file['type'].indexOf('/')) === 'video') {
          srcVideo.push({
            url: URL.createObjectURL(file),
            type: file['type']
          })
        }
      })
      return srcVideo
    },
    chatHeight() {
      return this.minimized
        ? document.querySelector('.chat-title')
          ? document.querySelector('.chat-title').clientHeight
          : '60'
        : this.chatExpanded
          ? '680'
          : '455'
    },
    chatWidth() {
      return this.chatExpanded && !this.minimized ? '500' : '335'
    }
  },
  watch: {
    messages: function () {
      this.messages.forEach((message, ind) => {
        if (message.files && message.files.length > 0) {
          message.fileIcons = {}
          message.files.map(file => {
            const fileName = file
              .substring(file.lastIndexOf('/') + 1)
              .replace(/%20/g, ' ')
              .replace('%28', '(')
              .replace('%29', ')')
            const fileExtension = fileName
              .substring(fileName.lastIndexOf('.') + 1)
              .toLowerCase()
              .trim()
            let fileIcon = 'mdi-file-document-outline'
            if (fileExtension.indexOf('doc') !== -1) {
              fileIcon = 'mdi-microsoft-word'
            } else if (fileExtension.indexOf('xls') !== -1) {
              fileIcon = 'mdi-microsoft-excel'
            } else if (fileExtension.indexOf('pdf') !== -1) {
              fileIcon = 'mdi-file-pdf'
            }

            message.fileIcons[file] = fileIcon
          })
        }
        if (message.type === 'deleted') {
          this.messages.splice(ind, 1)
        }
      })
      this.fetchChatGallery()
    }
  },
  updated() {
    this.moveToBottom()
  },
  async mounted() {
    this.state = await this.channel.watch()
    this.messages = this.state.messages
    this.fetchChatGallery()

    this.channel.on('message.new', this.addNewMessage)
    this.channel.on('message.deleted', this.deleteMessage)
    this.channel.on('message.updated', this.updateMsg)
    this.channel.on('user.watching.start', this.userLogsOn)
    this.channel.on('user.watching.stop', this.userLogsOff)
    this.channel.on('reaction.new', this.updateMsg)
    this.channel.on('reaction.deleted', this.updateMsg)

    this.getApps().then(response => {
      response.data.map(app => {
        this.availableApps.push({
          id: app.id,
          title: app.title
        })
      })
    })
    this.client.on('typing.start', r => {
      if (
        r.user.id !== this.user.id &&
        r['channel_id'] === this.channel['id']
      ) {
        this.whoTyping = r.user
      }
    })
    this.client.on('typing.stop', r => {
      if (
        r.user.id !== this.user.id &&
        r['channel_id'] === this.channel['id']
      ) {
        this.whoTyping = ''
      }
    })

    this.dataReady = true
    this.moveToBottom()
  },
  methods: {
    ...mapActions('GSChat', [
      'removeMessage',
      'updateMessage',
      'sendReaction',
      'deleteReaction'
    ]),
    ...mapActions('AppAttachments', {
      getFileUrl: 'get_message_file_url',
      setStreamFiles: 'set_stream_attachments'
    }),
    ...mapActions('AppBuilder', {
      getFieldValues: 'getFieldValuesPerPanel'
    }),
    ...mapActions('WorkOrderModule', {
      getApps: 'getAvailableApps',
      getActions: 'getActionsFeed'
    }),
    ...mapMutations('SnackBarNotif', {
      notifDanger: 'notifDanger',
      notifSuccess: 'notifSuccess'
    }),
    moveToBottom() {
      const messageContainer = this.$refs.messagesRef
      if (this.isForMessenger) {
        if (messageContainer) {
          messageContainer.scrollIntoView({
            block: 'end'
          })
          this.$refs.inputMessage.focus()
        }
      } else {
        if (messageContainer) {
          messageContainer.scrollTop = messageContainer.scrollHeight
        }
      }
    },
    userLogsOn(event) {
      if (!event) return
      const index = this.$h
        .dg(this, 'state.members', [])
        .map(m => m.user.id)
        .indexOf(event.user.id)
      this.state.members[
        index
      ].user.last_active = event.received_at.toISOString()
      this.state.members[index].user.online = true
    },
    userLogsOff(event) {
      const index = this.$h
        .dg(this.state, 'members', [])
        .map(m => m.user.id)
        .indexOf(event.user.id)
      this.state.members[
        index
      ].user.last_active = event.received_at.toISOString()
      this.state.members[index].user.online = false
    },
    hasMessageBeenViewed(message) {
      try {
        const index = this.$h
          .dg(this.state, 'members', [])
          .map(m => m.user.id)
          .indexOf(this.$h.dg(this.users, '0.user.id', ''))
        if (index !== -1) {
          return (
            new Date(message.created_at) <
              new Date(this.state.members[index].user.last_active) ||
            this.state.members[index].user.online
          )
        } else {
          return false
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    },
    isMessageFromSameUser(index) {
      if (index === 0) {
        return false
      }
      return (
        this.messages[index].user.id === this.messages[index - 1].user.id &&
        moment(this.messages[index].created_at).diff(
          moment(this.messages[index - 1].created_at),
          'minutes'
        ) <= 15
      )
    },
    cancelChatDelete() {
      this.showChatDeleteModal = false
      this.showDeleteOptions = false
    },
    async confirmChatDelete() {
      try {
        this.showloading = true
        await this.channel.delete()
        this.showloading = false
        if (this.isForMessenger) {
          this.$store.dispatch('GSChat/resetActiveMessengerChat')
        }
      } catch (e) {
        this.notifDanger('There was an error while deleting the chat')
        this.showloading = false
      }
    },
    deleteAll() {
      this.showChatDeleteModal = true
    },
    cancelMessagesDelete(deleted = false) {
      this.showChatMessageDelete = false

      if (deleted) {
        this.showDeleteOptions = false
        this.deleteIds = []
      }
    },
    async confirmMessagesDelete() {
      try {
        this.showLoading = true
        for (let x = 0; x < this.deleteIds.length; x++) {
          await this.removeMessage(this.deleteIds[x])
        }
        this.cancelMessagesDelete(true)
        this.notifSuccess('The messages were deleted')
        this.showLoading = false
      } catch (e) {
        this.notifDanger('There was an error while deleting the messages')
        this.showloading = false
      }
    },
    deleteMessages(message = false) {
      if (message) {
        this.deleteIds.push(message.id)
      }
      if (this.deleteIds.length) this.showChatMessageDelete = true
    },
    changeApp(event) {
      this.getActions(event).then(response => {
        this.options['records'] = response.data
      })
    },
    openChatGallery(item = false) {
      if (item) {
        this.currentGalleryItem = this.chatGallery.findIndex(
          i => i.source === item
        )
      }

      this.showImagesGallery = true
    },
    fetchChatGallery() {
      const images = []
      if (this.messages) {
        this.messages.forEach(msg => {
          if (
            typeof msg.images !== 'undefined' &&
            this.$h.dg(msg, 'images', []).length > 0
          ) {
            msg.images.forEach(entry => {
              const img = {
                message: msg.id,
                source: entry
              }
              images.push(img)
            })
          }
        })
      }
      this.chatGallery = images
    },
    async selectRecord($event) {
      this.itemInfo['panel'] = null
      this.options['panles'] = []

      const app = await this.$store.dispatch(
        'AppBuilder/getApp',
        $event['app']['id']
      )

      app['tabs'].forEach(tab => {
        tab.panels.forEach(panel => {
          this.options['panles'].push({
            id: $event['id'],
            recordTitle: $event.title,
            label: `${tab['title']} - ${panel['title']}`,
            panelTitle: panel['title'],
            fields: panel['fields'],
            panelId: panel['id'],
            subtitle: $event.app.title,
            image: $event.app.iconLink,
            description: $event.description
          })
        })
      })
    },
    async selectPanel($event) {
      const values = await this.getFieldValues({
        recordID: $event['id'],
        panelID: $event['panelId']
      })

      const panel = []

      $event['fields'].forEach(field => {
        panel.push({ name: field.label, value: values['values'][field.id] })
      })

      this.urlInfo = {
        url: `${new URL(location.href)['href']}record/${$event.id}`,
        id: $event.id,
        panel: panel,
        description: $event['description'],
        panel_title: $event['panelTitle'],
        subtitle: $event['subtitle'],
        title: $event['recordTitle'],
        image: $event['image']
      }
      this.menu = false
    },
    redirect(file) {
      window.open(file, '_blank')
    },
    closeModal() {
      this.deleteDialog = false
    },
    edit(message) {
      this.messageEdit = message.id
      this.messageEditInput = message.text
      this.valueInput = message.text
    },
    async addUser(event) {
      this.deleteDialog = false
      this.hover = false
      if (event.users.length > 0) {
        // We make the new conversation
        const res = []
        event.users.forEach(item => {
          if (Object.keys(this.channel.state.members).indexOf(item) < 0) {
            res.push(item)
          }
        })

        if (res.length > 0) {
          await this.channel.addMembers(res)
        }
      }
    },
    removeUser() {
      this.deleteDialog = false
      this.hover = false
    },
    async cleanChat(event) {
      this.deleteDialog = false
      this.hover = false
      if (event) {
        this.messages = []
        await this.channel.hide(null, true)
        await this.channel.show()
      }
    },
    onInputMessage() {
      this.typingThrottle()
      this.stopTypingDebounce()
    },
    // eslint-disable-next-line no-undef
    typingThrottle: _.throttle(function () {
      this.channel.keystroke()
    }, 500),
    // eslint-disable-next-line no-undef
    stopTypingDebounce: _.debounce(function () {
      this.channel.stopTyping()
    }, 1000),
    setDate(item) {
      // If the last session was more than 1 day ago it shows the date else it shows the time.
      return 86400000 - (new Date() - item) <= 0
        ? `Last Online: ${moment(item).format('MMM D, YYYY')}`
        : `Last Online: ${moment(item).format('hh:mm A')}`
    },
    urlify(text) {
      const urlRegex = /(https?:\/\/[^\s]+)/g
      const youtubeUrlRegex = /^(https?:\/\/)?((www\.)?youtube\.com|youtu\.?be)\/.+$/
      const textUrls = []
      let youtubeUrls = []

      const res = text.replace(urlRegex, function (url) {
        const path = new URL(url)
        textUrls.push(url)
        return (
          '<a href="' +
          url +
          '" target="_blank" class=" white--text pointer text-subtitle-1 font-weight-bold blue--text" >' +
          path.origin +
          '</a>'
        )
      })
      youtubeUrls = textUrls.filter(row => youtubeUrlRegex.test(row))
      return { text: res, urls: textUrls, youtubeUrls: youtubeUrls }
    },
    addNewMessage(event) {
      this.messages.push(event.message)
    },
    cancelMessage() {
      if (this.messageEdit || this.messageEditInput) {
        this.messageEdit = ''
        this.messageEditInput = ''
        this.valueInput = ''
      }
    },
    async editMessage() {
      if (this.messageEditInput !== '') {
        await this.updateMessage({
          id: this.messageEdit,
          text: this.valueInput
        })
        this.messageEdit = ''
        this.messageEditInput = ''
        this.valueInput = ''
      }
    },
    deleteMessage(event) {
      this.messages = this.messages.filter(
        message => message.id !== event.message.id
      )
    },
    quoteMessage(index) {
      this.messageQuote = index
    },
    updateMsg(event) {
      const index = this.messages.findIndex(
        message => message.id === event.message.id
      )
      this.messages[index] = Object.assign(this.messages[index], event.message)
    },
    async closeChat() {
      if (this.isForMessenger) {
        this.$store.dispatch('GSChat/setActiveMessengerChat', {})
        return
      }
      this.channel.off('message.new', this.addNewMessage)
      await this.$store.dispatch('GSChat/removeChat', this.state.channel.id)
      await this.channel.markRead()
    },
    dayDivider(messageTime, index) {
      const result = {
        show: false,
        value: ''
      }
      const currentMessageTime = new Date(messageTime)
      const dateNow = new Date()
      if (index !== 0) {
        const beforeMessageTime = new Date(this.messages[index - 1].created_at)
        if (currentMessageTime.getDate() !== beforeMessageTime.getDate()) {
          result.show = true
        }
      } else {
        result.show = true
      }
      if (result.show) {
        const dayCurrentWeekDifference = Math.floor(
          (dateNow.getTime() - currentMessageTime.getTime()) / 86400000
        )
        switch (dayCurrentWeekDifference) {
          case 0:
            result.value = 'Today'
            break
          case 1:
            result.value = 'Yesterday'
            break
          default:
            result.value =
              currentMessageTime.getMonth() +
              1 +
              '/' +
              currentMessageTime.getDate() +
              '/' +
              currentMessageTime.getFullYear()
        }
      }
      return result
    },
    toggleDialogEmoji() {
      this.showDialog = !this.showDialog
    },
    async handleReactWithEmoji(message, emoji) {
      const isExist = message.own_reactions.some(
        reaction => reaction.type === emoji.aliases[0]
      )
      if (!isExist) {
        await this.sendReaction({
          channel: this.channel,
          id: message.id,
          emoji
        })
      } else {
        await this.deleteReaction({
          channel: this.channel,
          id: message.id,
          emoji
        })
      }
    },
    onSelectEmoji(emoji) {
      if (this.messageEdit === '') {
        this.valueInput += emoji.data
        // Optional
        this.toggleDialogEmoji()
        this.$nextTick(() => this.$refs.inputMessage.focus())
      } else {
        this.messageEditInput += emoji.data
        this.toggleDialogEmoji()
      }
    },
    async sendMessage() {
      // if user didn't input any value, didn't choose image or doc file then return
      if (
        this.valueInput === '' &&
        !this.imageFiles.length &&
        !this.docFiles.length
      ) {
        return
      }
      try {
        this.showLoading = true
        let message

        if (this.messageQuote !== '') {
          message = await this.$store.dispatch('GSChat/quoteMessage', {
            channel: this.channel,
            quoteMessageId: this.messages[this.messageQuote].id,
            quoteMessage: this.valueInput
          })
          this.messageQuote = ''
        } else {
          if (this.messageEdit) {
            await this.editMessage()
          } else {
            message = await this.$store.dispatch('GSChat/sendMessage', {
              channel: this.channel,
              message: this.valueInput
            })
          }
        }
        if (this.imageFiles.length > 0) {
          const urls = []
          this.imageFiles.forEach(async (image, index) => {
            const url = await this.setStreamFiles({
              files: image,
              headers: {
                'Content-Type': image['type'],
                'Content-Name': image['name'],
                'Stream-Id': message['message']['id'],
                'Stream-type': 'message'
              }
            })

            urls.push(url['attachUrl'])
            if (index === this.imageFiles.length - 1) {
              await this.updateMessage({
                id: message['message']['id'],
                text: message['message']['text'],
                images: urls
              })
              this.imageFiles = []
            }
          })
        }

        if (this.itemInfo['panel']) {
          await this.updateMessage({
            id: message['message']['id'],
            text: message['message']['text'],
            panel: this.urlInfo
          })
        }

        if (this.docFiles.length > 0) {
          this.showLoading = true
          const urls = []
          this.docFiles.forEach(async (file, index) => {
            const url = await this.setStreamFiles({
              files: file,
              headers: {
                'Content-Type': file['type'],
                'Content-Name': file['name'],
                'Stream-Id': message['message']['id'],
                'Stream-type': 'message'
              }
            })

            urls.push(url['attachUrl'])
            if (this.docFiles.length - 1 === index) {
              this.updateMessage({
                id: message['message']['id'],
                text: message['message']['text'],
                files: urls
              }).then(() => {
                this.showLoading = false
                this.docFiles = []
              })
            }
          })
        }
        this.showLoading = false
        this.hideFilesPreview = true

        this.valueInput = ''
      } catch (e) {
        this.notifDanger('There was an error while sending the message')
      }
    },
    cancelSendMessage() {
      this.messageQuote = ''
    },
    onClickMessage(e, message) {
      if (message.quoted_message) {
        document.getElementById(message.quoted_message_id).scrollIntoView({
          behavior: 'smooth'
        })
      }
    },
    beforeDelete(decision, messageID) {
      this.messageEdit = ''
      this.deleteDialog = false
      this.hover = false
      if (decision) {
        this.removeMessage(messageID)
      }
    },
    minimizeChatBox() {
      this.minimized = !this.minimized
    },
    onImagesChange(e) {
      this.hideFilesPreview = false
      e.forEach(item => {
        this.imageFiles.push(item)
      })
      this.$refs.inputMessage.focus()
    },
    removeImage(index) {
      this.imageFiles.splice(index, 1)
    },
    onDocsChange(e) {
      this.hideFilesPreview = false
      this.docFiles = e
      this.$refs.inputMessage.focus()
    },
    removeDoc(index) {
      this.docFiles.splice(index, 1)
    },
    messageTime(time) {
      return moment(time).format('h:mm a')
    },
    onPasteImage(event) {
      this.hideFilesPreview = false
      const items = (event.clipboardData || event.originalEvent.clipboardData)
        .items
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.kind === 'file') {
          const blob = item.getAsFile()
          const reader = new FileReader()
          reader.readAsDataURL(blob)
          this.imageFiles.push(blob)
        }
      }
    },
    openVideoCallingDialog() {
      const _this = this
      const channelType =
        Object.keys(this.channel.state.members).length > 2 ? 'group' : 'single'
      let otherSingleUser = null
      if (channelType == 'single') {
        Object.keys(this.channel.state.members).forEach(member => {
          if (member.toString() != _this.user.id.toString()) {
            otherSingleUser = member
          }
        })
      }
      this.$emit('initiateVideoCall', {
        channelID: this.channel.id,
        channelType: channelType,
        otherSingleUser: otherSingleUser
      })
    }
  }
}
</script>

<style>
v-icon,
p {
  display: inline-block;
}
.chat-box {
  -moz-transition: height 0.5s;
  -ms-transition: height 0.5s;
  -o-transition: height 0.5s;
  -webkit-transition: height 0.5s;
  transition: height 0.5s;
}
.chat-title {
  /*min-height: 60px;*/
  padding: 5px 0;
  background: #f7fcff;
}
.chat-title .chat-name-wrapper {
  width: calc(100% - 50px);
}
.chat-title .chat-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100%);
}
.v-close-btn {
  height: 15px !important;
  width: 15px !important;
}
.-rotate-45 {
  transform: rotate(-45deg);
}
.gallery-container {
  background-color: #000000a8 !important;
}
.avatar {
  width: 35px;
  height: 35px;
}
.btn-chat-shadow {
  box-shadow: 0px 3px 13px -4px #b4b4ec !important;
}
.btns-message {
  background: #366af5 !important;
}
.divider-chat {
  border-color: rgba(165, 160, 160, 0.12) !important;
}
.messages-container::-webkit-scrollbar {
  width: 13px;
}
.messages-container::-webkit-scrollbar-thumb {
  background: #b4b1ca;
  border-radius: 2px;
  border: 5px solid #fff;
}
.messages-container::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 2px;
  border: 5px solid #fff;
}
.arrow-down {
  max-width: 240px;
  border-radius: 0 10px 10px 10px;
}
.arrow-up {
  border-radius: 10px 10px 0px 10px;
}
.my-message {
  background-color: #1877f2;
}
.my-message p {
  color: white;
  font-size: 15px;
  margin-bottom: 0;
  white-space: break-spaces;
  hyphens: none;
}
.other-message {
  background-color: #e3e6eb;
}
.other-message p {
  color: #050505;
  font-size: 15px;
  margin-bottom: 0;
  white-space: break-spaces;
  hyphens: none;
}
.message-arrow:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
}
.arrow-up:before {
  border-left: 2px solid #1877f2;
  border-right: 2px solid transparent;
  border-top: 2px solid transparent;
  border-bottom: 2px solid #1877f2;
  right: -4px;
  bottom: 0px;
}
.arrow-down:before {
  border-left: 2px solid transparent;
  border-right: 2px solid #e3e6eb;
  border-top: 2px solid #e3e6eb;
  border-bottom: 2px solid transparent;
  left: -4px;
  top: 0px;
}
.chat-send-section {
  min-height: 50px;
}
.container-emoji {
  height: 158px !important;
  margin-right: 5px;
}
.container-emoji::-webkit-scrollbar {
  width: 4px !important;
}
.container-emoji::-webkit-scrollbar-thumb {
  background: #b4b1ca;
  border-radius: 2px;
}
.container-emoji::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 2px;
}
.emoji-component {
  right: 6px;
}
.emoji-component div {
  background: #fff;
}
.emoji-component span {
  display: flex !important;
  padding: 7px 0px;
}
.reaction-container {
  position: absolute;
  left: 48px;
  bottom: 12px;
  width: 250px;
}
.reaction-container span {
  padding-left: 10px !important;
  margin-right: 3px;
}
.container-search {
  padding: 0 10px;
}
.container-search input {
  outline: none;
}
.v-list-item {
  min-height: 30px !important;
}
.v-tooltip__content {
  background: transparent !important;
  padding: 0;
}
.message-btns {
  margin-left: -130px;
  margin-top: -13px;
}
.mdi-file-outline::before,
.mdi-image::before {
  color: #fff;
  font-size: 15px;
}
.uploadfile-btn * {
  cursor: default;
}
.uploadfile-btn .upload-icon .v-icon--link {
  width: 25px;
  height: 25px;
  border-radius: 100%;
  cursor: pointer;
  box-shadow: 1px 1px 4px #000000;
  background: #366af5 !important;
}
.uploadfile-btn .v-input__prepend-outer {
  padding: 0;
  margin: 0;
}
.image-preview {
  height: 200px;
  width: 200px;
  object-fit: cover;
  border-radius: 6px;
}
.images-container {
  overflow-x: scroll;
  min-height: 60px;
}
.images-container::-webkit-scrollbar {
  height: 5px;
  width: 3px;
}
.images-container::-webkit-scrollbar-thumb {
  background: #b4b1ca;
  border-radius: 2px;
}
.images-container::-webkit-scrollbar-track {
  background: #fff;
  border-radius: 2px;
}
.docfile-name {
  white-space: nowrap;
}
.docs {
  min-height: 42px;
}
.preview-doc {
  height: 30px;
}
.rounded-card {
  border-radius: 8px !important;
}
.my-message-content {
  display: flex;
  justify-content: flex-end;
  margin-right: -3px;
  position: relative;
}
.message-container .my-actions {
  opacity: 0;
}
.message-container:hover .my-actions {
  opacity: 1;
}
.own-reaction-container {
  position: absolute;
  bottom: -16px;
  left: 12px;
}
.own-reaction-container span {
  padding-left: 10px !important;
  margin-right: 3px;
}
.menu-button {
  align-items: flex-start !important;
  width: 10px !important;
}
.message-input-container {
  flex: 1;
}
.fixed-title-header {
  position: fixed;
  top: 60px;
  width: 75%; /* Because our chat window is 75% of the total width */
  z-index: 30;
}
.fixed-message-content {
  margin-top: 60px;
  margin-bottom: 80px;
}
.fixed-message-input {
  position: fixed;
  bottom: 0px;
  width: 75%;
  z-index: 30;
  background: white;
  border-top: 2px solid #e3e6eb;
}
.mx-66 {
  max-width: 66%;
}
.mx-100 {
  max-width: 100%;
}
.received-message {
  min-width: 100% !important;
}
</style>

<style lang="scss">
#message-post-textarea {
  max-height: 70px;
  overflow-y: auto;
  line-height: 1.2rem;
  &::-webkit-scrollbar {
    width: 4px !important;
  }
  &::-webkit-scrollbar-thumb {
    background: #b4b1ca;
    border-radius: 2px;
  }
  &::-webkit-scrollbar-track {
    background: #fff;
    border-radius: 2px;
  }
}
.message-container {
  .message-arrow {
    &.my-message {
      p {
        a {
          color: white !important;
        }
      }
    }
    &.other-message {
      p {
        a {
          color: #050505 !important;
        }
      }
    }
  }
}
.hidden-messenger {
  transition: 0.4s;
  display: none;
}
.chatbox-mobile {
  height: calc(100vh - 65px) !important;
}
.max-w-half {
  max-width: 50%;
}
</style>
