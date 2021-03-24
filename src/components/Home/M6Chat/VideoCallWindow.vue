<template>
  <div
    class="blue-grey darken-4"
    style="height: 100%"
  >
    <v-card
      v-if="!settingsDialogOpenStatus"
      color="transparent"
    >
      <v-card-title>
        <span class="headline-6 white--text">{{chatName}}</span>
        <span class="caption white--text ml-5">{{talkTime}}</span>
      </v-card-title>
      <v-card-text
        style="height: calc(100vh - 144px);padding-bottom: 0"
      >
        <div class="video-list"></div>
      </v-card-text>
      <v-card-actions
        class="justify-center py-5"
      >
        <div class="own-video"></div>
        <v-btn
          :color="videoMute?'red':'green'"
          fab
          small
          dark
          @click="toggleVideo"
        >
          <v-icon>mdi-video{{videoMute?'-off':''}}</v-icon>
        </v-btn>
        <v-btn
          :color="audioMute?'red':'green'"
          fab
          small
          dark
          @click="toggleAudio"
        >
          <v-icon>mdi-microphone{{audioMute?'-off':''}}</v-icon>
        </v-btn>
        
        <v-tooltip top color="black" dark>
          <template v-slot:activator="{ on, attrs }">
            <div 
              v-bind="attrs"
              v-on="on"
              style="margin-left: 8px" 
            >
              <v-btn
                :color="screenMute?'red':'green'"
                fab
                small
                dark
                @click="toggleScreenShare"
                :disabled="otherUserScreenSharing"
                style="margin-left: 0"
              >
                <v-icon>mdi-monitor{{screenMute?'-off':''}}</v-icon>
              </v-btn>
            </div>
          </template>
          <span>{{otherUserScreenSharing?'To share your screen, Other user must stop sharing their screen':((screenMute)?'Share your screen':'Stop screen share')}}</span>
        </v-tooltip>
        <v-btn
          color="red"
          fab
          small
          dark
          @click="close"
        >
          <v-icon>mdi-phone-hangup</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
      <v-dialog
        v-model="settingsDialogOpenStatus"
        persistent
        max-width="500px"
        scrollable
      >
        <v-card
          color="blue-grey darken-2"
        >
          <v-card-title>
            <span class="headline-6 white--text mx-auto">Settings</span>
          </v-card-title>
          <v-card-text
            style="max-height: calc(100vh);padding-bottom: 0"
          >
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <v-switch
                    v-model="settings.audioStatus"
                    label="Audio"
                    color="success"
                    dark
                    hide-details
                    class="mt-3"
                  ></v-switch>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                  class="d-flex"
                >
                  <canvas class="setting-audio-graph mt-3" height="30" width="200" style="background-color: rgba(0,0,0,.3)"></canvas>
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <v-switch
                    v-model="settings.videoStatus"
                    label="Video"
                    color="success"
                    dark
                    hide-details
                    class="mt-3"
                  ></v-switch>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                  class="d-flex"
                >
                  <video class="setting-video-preview mt-3" muted autoplay style="height: 200px; width: 200px;object-fit: cover;background-color: rgba(0,0,0,1)"></video>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions
            class="justify-center py-5"
          >
              <v-btn
                tile
                color="success"
                @click="joinCall"
              >
                JOIN
              </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  </div>
</template>

<script>
import Peer from 'peerjs'
import io from 'socket.io-client'
import { mapGetters } from 'vuex'
export default {
    name: 'VideoCallWindow',
    props: {
    },
    data: () => ({
      audioMute: false,
      videoMute: true,
      screenMute: true,
      talkTime: '00:00:00',
      timeInterval: '',
      ownVideoStream: null,
      ownScreenStream: null,
      peers: [],
      screenStreamPeers: [],
      roomID: null,
      myPeer: null,
      mySocket: null,
      channelID: null,
      otherUserScreenSharing: false,

      openDialog: false,
      callInitiator: false,
      settingsDialogOpenStatus: true,
      settings: {
        audioStatus: true,
        videoStatus: false
      }
    }),
    watch: {
      dialogOpenStatus: function(newVal){
        
      },
      'settings.audioStatus': function(newVal){
        this.ownVideoStream.getAudioTracks()[0].enabled = newVal;
      },
      'settings.videoStatus': function(newVal){
        this.ownVideoStream.getVideoTracks()[0].enabled = newVal;
      },
      audioMute: function(newVal){
        this.settings.audioStatus = !newVal;
      },
      videoMute: function(newVal){
        this.settings.videoStatus = !newVal;
      }
    },
    mounted(){
      this.channelID = this.$route.params.channel;

      if(this.getChannel == null){
        alert('channel id is not valid');
        window.close();
      } else {
        this.settingsPopupInit();
      }
    },
    computed: {
        ...mapGetters('GSChat', { 
          channels: 'connections'
        }),
        ...mapGetters('Auth', {
          currentUser: 'getUser'
        }),

        getChannel: function(){
          return this.channels.find((channel, index) => channel.id == this.channelID)
        },
        dialogOpenStatus: function(){
          return this.openDialog
        },
        chatTotalMember: function(){
          return this.getChannel.data.member_count
        },
        chatName: function(){
          const _this = this;
          if(this.getChannel){
            if(this.getChannel.data.name){
              return this.getChannel.data.name;
            } else {
              return (this.users.length>0)?this.users[0].user.name:'Name not found'
            }

          } else {
            return 'Name not found'
          }
          
        },
        users: function(){
          const _this = this;
          const users = []
          if(this.getChannel){
            Object.keys(this.getChannel.state.members).forEach(member_key => {
              if (member_key !== _this.currentUser.id) {
                users.push(_this.getChannel.state.members[member_key])
              }
            })
          }
          return users;
        },

        myPeerID: function(){
          let id = null;
          if(this.myPeer != null){
            if(this.myPeer._lastServerId){
              id = this.myPeer._lastServerId;
            } else if(this.myPeer._id){
              id = this.myPeer._id;
            }
          }
          return id;
        },
    },
    methods: {
      init: function(){

        
        const _this = this;
        
        if(typeof this.getChannel.id != null){

          this.roomID = this.getChannel.id;
          
          
          const node_server_url = window.location.protocol+'//soft-responsible-august.glitch.me/';
          this.mySocket = io(node_server_url);
          this.mySocket.emit('join-room', this.roomID, this.currentUser.id)


          this.myPeer = new Peer(`${_this.currentUser.id}peer${Math.random()}`.replaceAll('.','-'),{
            host: 'webrtcpeerjs.m6connect.com',
            port: (window.location.protocol.search('https') == 0)?443:9000,
            path: 'peerjs-server',
            config: {
              'iceServers': [
                { 
                  url: 'turn:35.160.94.66:3478', 
                  credential: 'password',
                  username: 'admin'
                }
              ]
            }
          });
          
          _this.myPeer.on('error', function(err){
          })
          _this.myPeer.on('open', id => {
            _this.mySocket.emit('enter-to-video-call', _this.roomID, _this.myPeerID, _this.currentUser.id)
          })
          _this.myPeer.on('close', () => {
            
            _this.mySocket.emit('leave-from-video-call', _this.roomID, _this.myPeerID, _this.currentUser.id)

            if(_this.screenMute == false){
              _this.mySocket.emit('stop-screen-share', _this.roomID, _this.myPeerID, _this.currentUser.id)
            }
          })

          this.countTalkTime();
          this.getOwnVideoStream(function(){
            if(_this.ownVideoStream != null) {

              _this.ownVideoStream.getAudioTracks()[0].enabled = !_this.audioMute;
              _this.ownVideoStream.getVideoTracks()[0].enabled = !_this.videoMute;

              _this.addOwnVideo();  

              if(!_this.callInitiator){
                  _this.myPeer.on('call', call => {
                    if(_this.peers.findIndex((per) => per == call.peer) == -1){
                      
                      call.answer(_this.ownVideoStream)
                    
                      _this.peers.push(call)

                      const video = document.createElement('video')

                      call.on('stream', userVideoStream => {
                        _this.addOtherStream(call, userVideoStream, video, _this)
                      })

                      call.on('close', () => {
                        
                        let screen_sharing = false
                        if(call.metadata.streamType && call.metadata.streamType == 'screen'){
                          screen_sharing = true;
                        }
                        if(document.querySelector(`${screen_sharing?'.screen-sharing':''}[data-peer-id="${call.peer}"]`)){
                          document.querySelector(`${screen_sharing?'.screen-sharing':''}[data-peer-id="${call.peer}"]`).remove()
                        }

                        
                        if(document.querySelectorAll('.video-list .video-item').length == 1){
                          document.querySelector('.video-list .video-item').classList.add('main')
                        } else if (document.querySelectorAll('.video-list .video-item').length == 0){
                           _this.$snotify.success('Call ended', 'Call', {timeout: 3000})
                           _this.close();
                        }
                      })
                    
                    }
                  })
              }

              _this.mySocket.on('enter-to-video-call', (roomId, peerId, userId) => {
                if(userId != _this.currentUser.id){
                  _this.connectToNewUser(peerId, _this.ownVideoStream, userId)
                }
              });

              _this.mySocket.on('leave-from-video-call', (roomId, peerId, userId) => {
                
                if(_this.peers.find(peer => peer.peer.indexOf(userId) == 0)){
                  _this.peers.find(peer => peer.peer.indexOf(userId) == 0).close()
                  _this.peers.splice(_this.peers.findIndex(peer => peer.peer.indexOf(userId) == 0), 1);
                }
              });

              _this.mySocket.on('started-screen-share', (roomId, peerId, userId) => {
                _this.otherUserScreenSharing = true;
              });
              _this.mySocket.on('stopped-screen-share', (roomId, peerId, userId) => {
                if(_this.peers.find(peer => peer.peer == peerId && peer.metadata.streamType && peer.metadata.streamType == 'screen')){
                  _this.peers.find(peer => peer.peer == peerId && peer.metadata.streamType && peer.metadata.streamType == 'screen').close()
                  _this.otherUserScreenSharing = false;
                  _this.peers.splice(_this.peers.findIndex(peer => peer.peer == peerId && peer.metadata.streamType && peer.metadata.streamType == 'screen'), 1);
                }
              });


              _this.mySocket.on('muted-status', (roomId, peerId, status) => {
                if(document.querySelectorAll(`[data-peer-id="${peerId}"]`).length > 0){
                  document.querySelectorAll(`[data-peer-id="${peerId}"]`).forEach((dom, i) => {
                    if(dom.querySelector('.mute-status')){
                      dom.querySelector('.mute-status').innerHTML = (!status)?'<i class="mdi mdi-microphone"></i>':'<i class="mdi mdi-microphone-off"></i>';
                    }
                  })
                }
              });

              _this.mySocket.on('video-status', (roomId, peerId, status) => {
                if(document.querySelectorAll(`[data-peer-id="${peerId}"]`).length > 0){
                  document.querySelectorAll(`[data-peer-id="${peerId}"]`).forEach((dom, i) => {
                    if(!status){
                      dom.classList.remove('no-video');
                    } else {
                      dom.classList.add('no-video');
                    }
                  })
                }
              });
              if(_this.users.length > 0){
                
              }

            }
          });
          
        }
      },
      connectToNewUser: function(peerId, stream, userId) {
        
        const _this = this;
        
        const call = _this.myPeer.call(peerId, stream, {
            metadata: { "userId": _this.currentUser.id }
        })
        const video = document.createElement('video')
        


        if(_this.peers.findIndex((per) => per.peer == peerId) == -1){
          _this.peers.push(call)

          
          call.on('stream', userVideoStream => {
            _this.addOtherStream(call, userVideoStream, video, _this)
          })
          call.on('close', () => {
            
            let screen_sharing = false
            if(call.metadata.streamType && call.metadata.streamType == 'screen'){
              screen_sharing = true;
            }
            if(document.querySelector(`${screen_sharing?'.screen-sharing':''}[data-peer-id="${call.peer}"]`)){
              document.querySelector(`${screen_sharing?'.screen-sharing':''}[data-peer-id="${call.peer}"]`).remove()
            }
            if(document.querySelectorAll('.video-list .video-item').length == 1){
              document.querySelector('.video-list .video-item').classList.add('main')
            } else if (document.querySelectorAll('.video-list .video-item').length == 0){
              _this.$snotify.success('Call ended', 'Call', {timeout: 3000})
              _this.close();
            }
          })
        }
        
      },
      addOtherStream: function(call, userVideoStream, videoElement, _this){
        let screen_sharing = false
        if(call.metadata.streamType && call.metadata.streamType == 'screen'){
          screen_sharing = true;
        }
        if(document.querySelectorAll(`${screen_sharing?'.screen-sharing':''}[data-peer-id="${call.peer}"]`).length == 0){
          
          const videoGrid = document.querySelector('.video-list')
          

          const videoItem = document.createElement('div');
          videoItem.classList.add('video-item')
          videoItem.setAttribute("data-peer-id", call.peer);

          if(screen_sharing){
            videoItem.classList.add('main')
            videoItem.classList.add('screen-sharing')
          }
          
          const canvas = document.createElement('canvas')
          let ctx = canvas.getContext("2d");

          canvas.setAttribute('width', 30);
          canvas.setAttribute('height', 20);
          videoItem.append(canvas)

          const userInfo = document.createElement('div');
          userInfo.classList.add('user-info')
          

          let userID = '';
          if(call.peer.split('peer').length > 0){
            userID = call.peer.split('peer')[0]
          }
          
          if(userID == ''){
            userID = (call.metadata.userId)?call.metadata.userId:''
          }
          
          if(_this.getUser(userID)){

            const userAvatar = document.createElement('div');
            userAvatar.classList.add('user-avatar')
            userAvatar.innerHTML = _this.getUser(userID).user.image?`<img src="${_this.getUser(userID).user.image}">`:`<div class="avatar-inside">${_this.getUser(userID).user.name.charAt(0)}</div>`
            userInfo.append(userAvatar);
          }

          /* Muted status start*/
          if(screen_sharing == false){
            let muted = 0;
            userVideoStream.getAudioTracks().forEach(audio => {
              if(audio.muted){
                muted++;
              }
            });

            var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            var analyser = audioCtx.createAnalyser();

            let source = audioCtx.createMediaStreamSource(userVideoStream);
            source.connect(analyser);
            // source.connect(audioCtx.destination);

            analyser.fftSize = 2048;

            var dataArray = new Uint8Array(analyser.frequencyBinCount);

            function loopingFunction(){
                analyser.getByteFrequencyData(dataArray); //passing our Uint data array

                _this.draw(dataArray, canvas, ctx);
                
                let sum_audio = dataArray.reduce((a, b) => a + b, 0);

                let this_peer = _this.peers.find(peer => peer.peer == call.peer);
                if(this_peer){
                  this_peer['audio-number'] = sum_audio;
                }


                if(document.querySelectorAll('.screen-sharing').length == 0){
                  if(sum_audio != 0 &&(_this.peers.filter(peer => sum_audio < peer['audio-number']) == 0)){
                    document.querySelectorAll(`.video-item.focus`).forEach(dom => {
                      dom.classList.remove('focus')
                    })
                    if(
                      document.querySelector(`.video-item[data-peer-id="${call.peer}"]`) &&
                      !document.querySelector(`.video-item[data-peer-id="${call.peer}"]`).classList.contains('focus')
                      ){
                      document.querySelector(`.video-item[data-peer-id="${call.peer}"]`).classList.add('focus')
                    }
                  } else {
                    if(document.querySelector(`.video-item.focus[data-peer-id="${call.peer}"]`)){
                      document.querySelector(`.video-item.focus[data-peer-id="${call.peer}"]`).classList.remove('focus')
                    }
                  }
                }

                requestAnimationFrame(loopingFunction);
            }
            loopingFunction();

            

            const muteStatus = document.createElement('div');
            muteStatus.classList.add('mute-status')

            muteStatus.innerHTML = (muted == 0)?'<i class="mdi mdi-microphone"></i>':'<i class="mdi mdi-microphone-off"></i>';

            videoItem.append(muteStatus)
          }
          /* Muted status end*/


          videoItem.append(userInfo)

                                     
          if(document.querySelectorAll('.video-list .video-item').length == 0){
            videoItem.classList.add('main')
          } else {
            if(document.querySelector('.video-list .video-item.main') && !document.querySelector('.video-list .video-item.main').classList.contains('screen-sharing')){
              document.querySelector('.video-list .video-item.main').classList.remove('main')
            }
          }

          videoElement.srcObject = userVideoStream;
          videoElement.addEventListener('loadedmetadata', () => {
            videoElement.play()

            let total_child = videoGrid.children.length;
            videoGrid.children.forEach((vid_item, index) => {
              if(vid_item.querySelectorAll('video').length == 0){
                vid_item.remove()
              }
            })
          })
          videoItem.append(videoElement);          
          videoGrid.append(videoItem);

        }
      },
      draw: function(data, canvas, ctx){
          data = [...data];
          ctx.clearRect(0,0,canvas.width,canvas.height);
          ctx.strokeStyle = 'green';
          let space = canvas.width / data.length;
          data.forEach((value,i)=>{
            let convertedValue = (value/255)*canvas.height;
            ctx.beginPath();
            ctx.moveTo(space*i,canvas.height); //x,y
            ctx.lineTo(space*i,canvas.height - convertedValue); //x,y
            ctx.stroke();
          })
      },
      close: function(){
        this.stopOwnStream('video');
        
        if(this.myPeer._open){
          this.myPeer.destroy();
        }

        this.$emit('close');

        window.close();


      },
      toggleVideo: function(){
        this.videoMute = !this.videoMute
        this.ownVideoStream.getVideoTracks()[0].enabled = !this.videoMute;
        this.mySocket.emit('video-status', this.roomID, this.myPeerID, this.videoMute)
      },

      toggleAudio: function(){
        this.audioMute = !this.audioMute
        this.ownVideoStream.getAudioTracks()[0].enabled = !this.audioMute;
        this.mySocket.emit('muted-status', this.roomID, this.myPeerID, this.audioMute)
      },

      toggleScreenShare: function(){
        const _this = this;

        if(this.screenMute == true){
          this.getOwnScreenStream(function(){
            if(_this.ownScreenStream != null){
              _this.peers.forEach((peer) => {
                let callScreen = _this.myPeer.call(peer.peer, _this.ownScreenStream, {
                    metadata: { 
                      "userId": _this.currentUser.id,
                      "streamType": "screen"
                    }
                });
                _this.mySocket.emit('start-screen-share', _this.roomID, _this.myPeerID, _this.currentUser.id)
                _this.screenStreamPeers.push(callScreen)
                _this.screenMute = false
              });
              
            }
          })
        } else {
          this.screenStreamPeers.forEach((scrPeer, index) => {
            scrPeer.close();
            if(_this.screenStreamPeers.length == (index + 1)){
              _this.screenStreamPeers = [];
              _this.mySocket.emit('stop-screen-share', _this.roomID, _this.myPeerID, _this.currentUser.id)
              _this.stopOwnStream('screen');
              _this.screenMute = true
            }
          })
        }
      }, 

      countTalkTime: function(){
        const _this = this;

        this.talkTime = '00:00:00';

        clearInterval(this.timeInterval);

        let seconds = 0;
        this.timeInterval = setInterval(function(){
          seconds++;
          _this.talkTime = _this.secondsToStringTime(seconds)
        }, 1000)
      },
      secondsToStringTime: function(secs){
        let hours = parseInt(secs/3600);
        let minutes = parseInt((secs%3600)/60);
        let seconds = parseInt((secs%3600)%60);
        return `${hours>9? hours:'0'+hours}:${minutes>9?minutes:'0'+minutes}:${seconds>9?seconds:'0'+seconds}`
      },
      getOwnVideoStream: function(callback){
        const _this = this;
        if(navigator.mediaDevices){
          /* 
            video resolutions in px
            240p = 352 x 240
            360p = 480 x 360
            480p = 858 x 480 — also known as SD
            720p = 1280 x 720 — the old TVs of this resolution were marked HDready
            1080p = 1920 x 1080 — FullHD
            2160p = 3860 x 2160
          */
          navigator.mediaDevices.getUserMedia({
            video: { 
              width: {
                min: 352,
                max: 858
              }, 
              height: {
                min: 240,
                max: 480
              }, 
              frameRate: { 
                min: 8, 
                max:60 
              }
            },
            audio: true
          }).then(stream => {
              this.ownVideoStream = stream;
              callback();
          }).catch(function(err) {
            _this.$snotify.error(
              err.name + ": " + err.message,
              'Error',{
                timeout: 10000
              }
            )
            callback()
          });
        } else {
          _this.$snotify.error(
              'Must need HTTPS to access camera or microphone, For development run app in localhost',
              'Error',{
                timeout: 10000
              }
            )
          callback();
        }
      },
      stopOwnStream: function(type) {
        if(type == 'video'){
          if(this.ownVideoStream){
            this.ownVideoStream.getTracks().forEach(function(track) {
              track.stop();
            });
          }
        } else if (type == 'screen'){
          if(this.ownScreenStream){
            this.ownScreenStream.getTracks().forEach(function(track) {
              track.stop();
            });
          }
        }
      },
      getOwnScreenStream: async function(callback){
        const _this = this;
        try{

          let screenStream = null;

          screenStream = await navigator.mediaDevices.getDisplayMedia();

          if(screenStream != null){
            _this.ownScreenStream = screenStream
          } else {
            _this.ownScreenStream = null;
          }

          callback()
        } catch(err){
          _this.$snotify.error(
              err,
              'Error',{
                timeout: 500
              }
            )
          callback()
        }
      },
      addOwnVideo: function(){
        const _this = this;

        if(_this.ownVideoStream != null){
          setTimeout(function(){
            const ownVideo = document.querySelector('.own-video')
            const video = document.createElement('video')
            video.muted = true;
            video.srcObject = _this.ownVideoStream;
            video.addEventListener('loadedmetadata', () => {
              video.play()
            })
            ownVideo.innerHTML = '';
            ownVideo.append(video)
            
            
          }, 1000)
        }
      },
      addOthersVideo: function(){
        const _this = this;

        setTimeout(function(){
          const videoGrid = document.querySelector('.video-list')
          videoGrid.innerHTML = '';


          for (var i = 1; i < _this.chatTotalMember; i++) {
            const videoItem = document.createElement('div');
            videoItem.classList.add('video-item')
            if(_this.chatTotalMember == 2){
              videoItem.classList.add('main')
            }

            const video = document.createElement('video')
            video.muted = true;
            video.autoplay = true;
            video.src = 'https://www.sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4';
            video.addEventListener('loadedmetadata', () => {
              video.play()
            })

            videoItem.append(video);          
            videoGrid.append(videoItem)
          }
          
        }, 1000)

      },
      getUser: function(user_id){
        return this.users.find(user => user.user.id == user_id);
      },
      settingsPopupInit: function(){
        const _this = this;
        this.settingsDialogOpenStatus = true;
        this.getOwnVideoStream(function(){

          if(_this.ownVideoStream != null) {
            _this.ownVideoStream.getAudioTracks()[0].enabled = _this.settings.audioStatus;
            _this.ownVideoStream.getVideoTracks()[0].enabled = _this.settings.videoStatus;

            const videoElement = document.querySelector('.setting-video-preview')
            videoElement.srcObject = _this.ownVideoStream;
            videoElement.addEventListener('loadedmetadata', () => {
              videoElement.play()
            })

            const canvas = document.querySelector('.setting-audio-graph')

            if(canvas){
              let ctx = canvas.getContext("2d");

              var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
              var analyser = audioCtx.createAnalyser();

              let source = audioCtx.createMediaStreamSource(_this.ownVideoStream);
              source.connect(analyser);
              // source.connect(audioCtx.destination);

              analyser.fftSize = 2048;

              var dataArray = new Uint8Array(analyser.frequencyBinCount);

              function loopingFunction(){
                  analyser.getByteFrequencyData(dataArray); //passing our Uint data array

                  _this.draw(dataArray, canvas, ctx);

                  requestAnimationFrame(loopingFunction);
              }
              loopingFunction();
            }
          } else {
            alert('Camera or Microphone permission is missing. Please provide the permission and re-try.');
            window.close();
          }
          
        })
      },
      joinCall: function(){
        this.audioMute = !this.settings.audioStatus;
        this.videoMute = !this.settings.videoStatus;
        this.settingsDialogOpenStatus = false;
        this.init();
      }
    }
}
</script>

<style>
  .v-application--is-ltr .v-card__actions > .v-btn {
      margin-left: 8px;
  }
  .v-card__text::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      background-color: transparent;
  }
  .v-card__text::-webkit-scrollbar-track {
      border-radius:0;
      background-color: transparent;
      z-index: 1111;
  }
  .v-card__text::-webkit-scrollbar-track-piece {
    
  }
  .v-card__text::-webkit-scrollbar-thumb { 
      background: transparent;
      transition: .3s;
      cursor: pointer;
      position: relative;
  }
  .v-card__text:hover::-webkit-scrollbar-thumb { 
      background: #455A64;
  }

  .video-list{
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    height: 100%;
    overflow: auto;
  }
  .video-list .video-item{
    width: 400px;
    height: 400px;
    max-width: 100%;
    position: relative;
    padding: 10px;
    order: 2;
    border: 2px solid transparent;
    min-width: 40%;
  }
  .video-list .video-item video{
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #000;
  }
  .video-list .video-item.main{
    width: 100%;
    height: calc(100vh - 200px);
    order: 1;
  }
  .video-list .video-item.main video{
    object-fit: contain;
  }
  .video-list .video-item.screen-sharing{
    order: 0;
  }
  .video-list .video-item.focus{
    border-color: green;
  }
  .video-list .video-item .user-info{
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: calc(100% - (2*10px));
    height: calc(100% - (2*10px));
    z-index: 10;
    color: #fff;
    align-items: center;
    justify-content: center;
    display: none;
  }
  .video-list .video-item:not(.screen-sharing).no-video .user-info{
    display: flex;
  }
  .video-list .video-item .user-info .user-name{
    color: #fff
  }
  .video-list .video-item .user-info .user-avatar{
    width: 100px;
    height: 100px;
    border: 2px solid #9e9e9e;
    padding: 3px;
    border-radius: 100%;
    overflow: hidden;
  }
  .video-list .video-item .user-info .user-avatar img{
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 100%;
  }
  .video-list .video-item .user-info .user-avatar .avatar-inside{
    width: 100%;
    height: 100%;
    border-radius: 100%;
    font-size: 40px;
    background-color: var(--v-info-base);
    display: flex;
    justify-content: center;
    align-items: center;
   }
  .video-list .video-item canvas{
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: rgba(0,0,0,.3);
  }
  .video-list .video-item:not(.focus) canvas{
    display: none;
  }
  .video-list .video-item .mute-status{
    position: absolute;
    color: #fff;
    top: 20px;
    right: 20px;
  }
  .video-list .video-item .mute-status i{
    color: #fff;
    font-size: 25px;
    text-shadow: 0 0 2px black;
  }
  .video-list .video-item:after{
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    height: calc(100% - (2*10px));
    width: calc(100% - (2*10px));
    z-index: 9
  }
  .video-list .video-item:hover:after{
    background: rgba(0,0,0,.4);
  }

  .v-card__actions{
    position: relative;
    z-index: 999999
  }
  .v-card__actions .own-video{
    position: absolute;
    left: 24px;
    bottom: 16px;
    height: 100px;
    width: 100px;
    border-radius: 100%;
    overflow: hidden;
    background: #000;
  }
  .v-card__actions .own-video video{
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #000;
    transform: scaleX(-1);
  }
  .v-card__actions .own-video:after{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 9
  }
</style>