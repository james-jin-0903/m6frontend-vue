<template>
  <div
    class="align-end bottom-0 chat-wrapper d-flex fixed mx-2 pa-0 right-0 z-20"
  >
    <chatbox
      v-for="(chatData, index) in chats"
      :key="`${index}-chatbox-user-${chatData.id}`"
      :channel="chatData"
      @initiateVideoCall="initVideoCall"
    />



    <video-call-management :outgoingChannelId="outgoingChannelId" :callReceiverId="callReceiverId" @closedVideoCallDialog="closedVideoCallDialog" ref="videoCallManagement"></video-call-management>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Chatbox from '@/components/Home/M6Chat/Chatbox'
import VideoCallManagement from './VideoCallManagement'

export default {
  name: 'ChatWrapper',
  components: {
    Chatbox,
    VideoCallManagement
  },
  data: () => ({
    outgoingChannelId: null,
    callReceiverId: null
  }),
  computed: {
    ...mapGetters('GSChat', [
      'chats'
    ])
  },
  methods: {
    initVideoCall(event){
      const _this = this;

      this.outgoingChannelId = event.channelID
      this.callReceiverId = event.otherSingleUser

      setTimeout(function(){
        _this.$refs.videoCallManagement.initiateOutgoingVideoCall();
        _this.$refs.videoCallManagement.callingDialogOpen();
      }, 1000)
    },
    closedVideoCallDialog(){
      this.outgoingChannelId = null
      this.callReceiverId = null
    }
  }
}
</script>
<style>
  .chat-wrapper {
    height: 455px;
  }
</style>