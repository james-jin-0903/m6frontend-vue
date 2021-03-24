<template>
  <div class="px-2">
    <div class="quote-message-container">
      <v-icon
        :class="{
          'white--text': inMessage && ownMessage,
          'darkgray--text': inMessage && !ownMessage,
        }"
        small
      >
        mdi-format-quote-open
      </v-icon>
      <div class="quote-message-content">
        <div
          class="quote-message"
          :class="{
            'white--text': inMessage && ownMessage,
            'darkgray--text': inMessage && !ownMessage,
          }"
          v-html="urlify(message.text)"
        />
        <div
          class="message-author"
          :class="{
            'white--text': inMessage && ownMessage,
            'light-darkgray--text': inMessage && !ownMessage,
          }"
        >
          {{ `${message.user.name} at ${messageTime(message.created_at)}` }}
        </div>
      </div>
      <v-icon
        v-if="!inMessage"
        class="close-button"
        small
        @click="$emit('close')"
      >
        mdi-close
      </v-icon>
    </div>
    <v-divider class="my-3" />
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "MessageQuote",
  components: {},
  props: {
    message: {
      type: Object,
      default: () => {},
    },
    inMessage: {
      type: Boolean,
      default: false,
    },
    ownMessage: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({}),
  methods: {
    messageTime(time) {
      return moment(time).format("h:mm a MM/DD/YYYY");
    },
    urlify(text) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;

      const res = text.replace(urlRegex, function(url) {
        const path = new URL(url);
        return (
          '<p><a href="' +
          url +
          '" target="_blank" class=" white--text pointer text-subtitle-1 font-weight-bold blue--text" >' +
          path.origin +
          "</a></p>"
        );
      });
      return res;
    },
  },
};
</script>

<style scoped>
.quote-message-container {
  display: flex;
  align-items: flex-start;
}
.quote-message-content {
  padding-left: 10px;
  padding-right: 10px;
}
.quote-message {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  font-style: italic;
}
.message-author {
  color: grey;
  font-size: 12px;
}
.close-button {
  margin-left: auto;
}
.darkgray--text {
  color: #050505;
}
.light-darkgray--text {
  color: #414141;
}
</style>
