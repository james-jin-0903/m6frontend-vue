<template>
	<div>
	  <v-row justify="center">
	    <v-dialog
	      v-model="openCallDialog"
	      persistent
	      scrollable
	      content-class="video-calling-dialog"
	    >
	      <v-card
	        color="blue-grey darken-4"
	      >
	        <v-card-title class="pb-0" style="height: auto;">
	        	<div class="align-center d-flex flex-column w-full">
		          <div class="d-flex align-center flex-column" v-if="getChannel">
		          	<v-avatar
		          	  v-if="getChannel.id.substr(14, 5) === 'group'"
		          	  class="mb-2"
		          	  dark
		          	  size="100"
		          	>
		          	  <v-img
		          	    v-if="getChannel.data.image"
		          	    :src="getChannel.data.image"
		          	  />
		          	  <template v-else>
		          	    <span 
	          	      		class="text-uppercase white--text avatar-inside"
	          	    	><v-icon class="white--text">mdi-account-group-outline</v-icon></span>
		          	  </template>
		          	</v-avatar>
		          	<v-avatar
		          	  	v-else
		          	    dark
		          	    size="100"
		          	  	class="mb-2"
		          	>
		          	    <v-img
		          	      v-if="getChannel.membersInChannel.user.image"
		          	      :src="getChannel.membersInChannel.user.image"
		          	    />
		          	    <template v-else>
		          	      	<span 
		          	      		class="text-uppercase white--text avatar-inside"
		          	    	>{{ getChannel.membersInChannel.user.name.charAt(0) }}</span>
		          	    </template>
		          	</v-avatar>
		          	<b class="white--text text-center">{{chatName}}</b>
		          </div>
	      		</div>
	        </v-card-title>
	        <v-card-text style="height: auto;">
	          <div class="text-center grey--text"> 
	          	<template v-if="inComingCall">Incoming Call...</template> 
	          	<template v-if="outGoingCall">Outgoing Call...</template> 
	          </div>
	          <template v-if="(outGoingCallStat.notAvailable || outGoingCallStat.denied || outGoingCallStat.wait || outGoingCallStat.timeout) && !inComingCall">
	          	<div class="text-center grey--text mt-2" v-if="outGoingCallStat.notAvailable">Not available.</div>
	          	<div class="text-center grey--text mt-2" v-else-if="outGoingCallStat.denied">Denied your call.</div>
	          	<div class="text-center grey--text mt-2" v-else-if="outGoingCallStat.wait">Waiting for to recieve call.</div>
	          	<div class="text-center grey--text mt-2" v-else-if="outGoingCallStat.timeout">Call timeout.</div>
	          </template>
	        </v-card-text>
	        
	        <v-card-actions
	          class="justify-center py-3"
	           style="height: auto;"
	        >
		        <template v-if="inComingCall">
		          <v-btn
		            color="red"
		            fab
		            small
		            dark
		            @click="denyIncomingCall"
		            size="50"
		          >
		            <v-icon>mdi-close</v-icon>
		          </v-btn>
		          <v-btn
		            color="green"
		            fab
		            small
		            dark
		            class="ml-4"
		            @click="acceptIncomingCall"
		            size="50"
		          >
		            <v-icon>mdi-phone</v-icon>
		          </v-btn>
		      </template>
		      <template v-if="outGoingCall && !outGoingCallStat.timeout">
		          <v-btn
		            color="red"
		            fab
		            small
		            dark
		            @click="cancelOutgoingCall"
		          >
		            <v-icon>mdi-phone-hangup</v-icon>
		          </v-btn>
		      </template>
		      <template v-if="outGoingCallStat.timeout">
		          <v-btn
		            color="green"
		            fab
		            small
		            dark
		            @click="closeCallDialogAfterTimeout"
		          >
		            <v-icon>mdi-close</v-icon>
		          </v-btn>
		      </template>
	        </v-card-actions>
	      </v-card>
	    </v-dialog>
	  </v-row>
	  <audio id="incomingRingTone" src="@/assets/incoming-ringtone.mp3" loop></audio>
	</div>
</template>

<script>
import io from 'socket.io-client'
import { mapGetters } from 'vuex'
export default {
    name: 'VideoCallManagement',
	components: {
	},
    props: {
      	outgoingChannelId: {
            type: String,
            default: null
        },
      	callReceiverId: {
            type: String,
            default: null
        },
    },
    data: () => ({
      openCallDialogStatus: false,
      inComingCall: false,
      outGoingCall: false,
      outGoingCallStat: {
      	wait: false,
      	notAvailable: false,
      	denied: false,
      	timeout: false,
      },
      callOngoing: false,
      callInitiated: false,
      openVideoDialog: false,
      incomingChannelId: null,
      socket: null,
      userDeniedBusyInGroup: [],
      timeoutForCallTimeout: null,
      inComingRingTone: null
    }),
    watch: {
      getOutgoingChannelId: function(newVal){

      },
      channels: function(newVal){
     //  	this.channels.forEach((chnl, index) => {
	    //   	this.socket.emit('join-room', chnl.id, this.currentUser.id)
	    // })
      },
      outGoingCall: function(newVal){
      	const _this = this;

      	if(newVal == false) {
      		if(_this.timeoutForCallTimeout != null){
      			clearInterval(_this.timeoutForCallTimeout);
      			_this.timeoutForCallTimeout = null;
      		}
      	}
      }
    },
    mounted(){
      const _this = this;
      const node_server_url = window.location.protocol+'//soft-responsible-august.glitch.me/';
      this.socket = io(node_server_url);

      this.inComingRingTone = document.querySelector('#incomingRingTone');
      this.inComingRingTone.loop = true;
      
      this.socket.emit('join-room', 'm6-video-call', this.currentUser.id);

      this.socket.on('incoming-call', (room_id, user_id) => {
      	// room_id & channelId is same
      	if(_this.channels.find(chn => chn.id == room_id)){
	      	if(_this.callOngoing == false){
	      		if(_this.inComingRingTone){
		      		_this.inComingRingTone.currentTime = 0
		      		_this.inComingRingTone.play()
	      		}
		      	_this.initiateInComingVideoCall(room_id);
		      	_this.callingDialogOpen();
		    } else {
		    	_this.socket.emit('incoming-call-response', room_id, this.currentUser.id, 'busy')	
		    }
      	}
      	
      })
      this.socket.on('cancel-call', (room_id, user_id) => {
      	// room_id & channelId is same
      	if(_this.channels.find(chn => chn.id == room_id)){
	      	if(_this.callOngoing){
		      	_this.outgoingCall = false;
		      	_this.incomingCall = false;
		      	_this.callOngoing = false;
		    	_this.closeCallDialog();
		    }
		}
      })

      this.socket.on('outgoing-call-response', (room_id, user_id, response) => {
      	if(this.outGoingCall){
	      	let user = _this.getUser(user_id);
	      	let user_identifier = user?user.user.name:user_id;
	      	
	      	// room_id & channelId is same
	      	if(response == 'accept'){
	      		if((_this.getChannelType == 'single' || _this.outGoingCall) && !_this.callInitiated){
		      		_this.closeCallDialog()
		      		_this.openVideoCallDialog()
		      		_this.callInitiated = true
		      	} 
	      	} else if(response == 'deny' || response == 'busy'){

	      		let terminateCall = false;

	      		if(_this.getChannelType == 'single'){
		      		terminateCall = true;
		      		if(response == 'deny'){
			      		_this.$snotify.error(
			              user_identifier+' denied the call',
			              'Denied',{
			                timeout: 5000
			              }
			            )
			      	} else if (response == 'busy'){
		  				_this.$snotify.warning(
		  			        user_identifier+' busy with other call',
		  			        'Busy',{
		  		              timeout: 5000
		  		            }
		  			    )
			      	}
	      		} else if(_this.getChannelType == 'group'){
	      			
	      			if(_this.userDeniedBusyInGroup.find(id => id == user_id) == null){
	      				_this.userDeniedBusyInGroup.push(user_id)
	      			}
	      			let members = _this.getChannel.state.members;
	      			
	      			if(_this.userDeniedBusyInGroup.length >= (Object.keys(members).filter(member => members[member].user.online == true).length - 1)){
	      				terminateCall = true;

				     	_this.$snotify.warning(
		  			        'Members denied call or busy with other call',
		  			        'Not available',{
		  		              timeout: 5000
		  		            }
		  			    )
	      			}


	      		}

	      		if(terminateCall){
	      			_this.closeCallDialog();
	      			_this.outgoingCall = false;
	      			_this.incomingCall = false;
	      			_this.callOngoing = false;
					_this.outGoingCallStat.wait = false;
					_this.outGoingCallStat.timeout = false;
	      			_this.userDeniedBusyInGroup = [];
	      		}

	      	}
	    }
      })

      // this.socket.on('leave-from-video-call', (roomId, peerId, userId) => {
        
      //   if(_this.getChannelID == roomId && userId == _this.currentUser.id){
      //   	_this.videoDialogClosed();
      //   }
      // });
    },
    destroyed: function(){
    	this.socket.emit('leave-room', 'm6-video-call', this.currentUser.id);
    },
    computed: {
    	...mapGetters('GSChat', { 
    	  channels: 'connections'
    	}),
    	...mapGetters('Auth', {
    	  currentUser: 'getUser'
    	}),
    	openCallDialog: function(){
    		return this.openCallDialogStatus
    	},
    	getChannel: function(){
    		return this.channels.find((channel, index) => channel.id == this.getChannelID)
    	},
    	getChannelType: function(){
    		if(this.getChannel){
    			return (Object.keys(this.getChannel.state.members).length > 2)? 'group':'single';
    		} else {
    			return null
    		}
    	},
    	getChannelID: function(){
    		if(this.inComingCall){
    			return this.incomingChannelId?this.incomingChannelId:null;
    		} else if(this.outGoingCall){
    			return this.outgoingChannelId?this.outgoingChannelId:null;
    		} else {
    			return null
    		}
    	}, 
    	getOutgoingChannelId: function(){
    		return this.outgoingChannelId
    	},
    	getOutgoingChannelId: function(){
    		return this.outgoingChannelId
    	},
        chatName: function(){
        	const _this = this;
        	if(this.getChannel){
        		if(this.getChannel.data.name){
	        		return this.getChannel.data.name;
	        	} else {
	        		const users = []
    		      	Object.keys(this.getChannel.state.members).forEach(member_key => {
	    		        if (member_key !== _this.currentUser.id) {
	    		          users.push(_this.getChannel.state.members[member_key])
	    		        }
	    		    })
    		     	return (users.length>0)?users[0].user.name:'Name not found'
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
        }

    },
    methods: {
    	closeCallDialog: function (){
    		this.openCallDialogStatus = false;
    		if(this.inComingRingTone){
    			this.inComingRingTone.pause();
    		}
    	},
    	callingDialogOpen: function (){
    		this.openCallDialogStatus = true;
    	},
	    videoDialogClosed(){
	      this.openVideoDialog = false;
	      this.$emit('closedVideoCallDialog');
	      this.callOngoing = false;
	      this.outGoingCall = false;
	      this.callInitiated = false;
	    },
	    initiateOutgoingVideoCall(){
	    	const _this = this;
	    	this.outGoingCall = true;
	    	this.inComingCall = false;
	    	this.socket.emit('outgoing-call', this.outgoingChannelId, this.currentUser.id)
	    	this.callOngoing = true;
	    	this.outGoingCallStat.wait = true;
	    	this.outGoingCallStat.timeout = false;
	    	this.timeoutForCallTimeout = setTimeout(function(){
	    		_this.cancelCallForTimeout()
	    	}, 40000)
	    },
	    initiateInComingVideoCall(channel_id){
	    	if(channel_id){
		    	this.incomingChannelId = channel_id;
		    	this.inComingCall = true;
		    	this.outGoingCall = false;
		    	this.callOngoing = true;
	    		this.outGoingCallStat.timeout = false;
	    	}
	    },
	    openVideoCallDialog(){
	    	const _this = this;

	    	let screenSize = {
	    		width: 600,
	    		height: 600,
	    		topCenter: screen.height/2,
	    		leftCenter: screen.width/2,
	    	};

	    	screenSize.topCenter = screen.height/2 - screenSize.height/2;
	    	screenSize.leftCenter = screen.width/2 - screenSize.width/2;

	    	let myWindow = window.open(
	    		window.location.origin+"/video-call/"+this.getChannelID, 
	    		"_blank", 
	    		`width=${screenSize.width}, height=${screenSize.height}, top=${screenSize.topCenter}, left=${screenSize.leftCenter}`); 

	    	let checkWindowOpenStatus = setInterval(function(){
	    		if(myWindow.closed){
	    			if(_this.callInitiated){
	    			_this.videoDialogClosed();
	    			}
	    			clearInterval(checkWindowOpenStatus);
	    		}
	    	}, 1000)
	    },
	    acceptIncomingCall(){
	    	this.socket.emit('incoming-call-response', this.incomingChannelId, this.currentUser.id, 'accept')
	    	this.callInitiated = true
	    	this.closeCallDialog()
	    	this.openVideoCallDialog()
	    },
	    denyIncomingCall(){
	    	this.socket.emit('incoming-call-response', this.incomingChannelId, this.currentUser.id, 'deny')	

	    	this.closeCallDialog();
	    	this.incomingChannelId = null;
	    	this.inComingCall = false;
	    	this.outGoingCall = false;
	    	this.callOngoing = false;
	    },
	    getUser: function(user_id){
	        return this.users.find(user => user.user.id == user_id);
	    },
	    cancelCall: function(){
	    	this.socket.emit('cancel-call', this.getChannelID, this.currentUser.id);

	    	this.incomingChannelId = null;
	    	this.inComingCall = false;
	    	this.callOngoing = false;
	    	this.outGoingCallStat.wait = false;
	    },
	    cancelOutgoingCall: function(){
	    	this.cancelCall();
	    	this.outGoingCall = false;
	    	this.closeCallDialog();
	    },
	    closeCallDialogAfterTimeout: function(){
	    	this.closeCallDialog();
	    	this.outGoingCall = false;
	    	this.outGoingCallStat.timeout = false;
	    },
		cancelCallForTimeout: function(){
			if(this.outGoingCall == true && this.callInitiated == false){
				this.outGoingCallStat.timeout = true
				this.cancelCall()
			}
		}
    }
}
</script>

<style>
  .video-calling-dialog .v-card__text::-webkit-scrollbar {
      width: 8px;
      height: 8px;
      background-color: transparent;
  }
  .video-calling-dialog .v-card__text::-webkit-scrollbar-track {
      border-radius:0;
      background-color: transparent;
      z-index: 1111;
  }
  .video-calling-dialog .v-card__text::-webkit-scrollbar-track-piece {
    
  }
  .video-calling-dialog .v-card__text::-webkit-scrollbar-thumb { 
	  background: transparent;
	  transition: .3s;
	  cursor: pointer;
	  position: relative;
  }
  .video-calling-dialog .v-card__text:hover::-webkit-scrollbar-thumb { 
      background: #455A64;
  }

  .video-calling-dialog.v-dialog{
  	max-width: 250px;
  	border-radius: 10px
  }
  .video-calling-dialog .v-avatar{
  	border: 2px solid #9e9e9e;
  	padding: 3px;
  }
  .video-calling-dialog .v-avatar .v-image{
  	height: 100%;
  }
  .video-calling-dialog .v-avatar .avatar-inside{
  	width: 100%;
  	height: 100%;
  	border-radius: 100%;
  	font-size: 40px;
  	background-color: var(--v-info-base);
    display: flex;
    justify-content: center;
  	align-items: center;
  }
  .video-calling-dialog .v-avatar .avatar-inside i{
  	font-size: 40px;
  }
</style>