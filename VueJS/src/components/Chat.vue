<template>
	<span>
		<v-dialog v-model="qrDialog" max-width="400">
			<v-card>
				<v-img src="/qr-code"></v-img>
				<v-card-text class="pt-0">
					<div class="title">Open camera app, scan here...</div><br>
					<div class="title">Or goto {{ uri }}</div><br>
				</v-card-text>
			</v-card>
		</v-dialog>
		<v-layout row>
			<v-container fluid>
				<v-toolbar>
					<v-icon medium :color="color">face</v-icon>
					<v-toolbar-title>
						{{ user }} @ Group Chat
					</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-btn flat icon  @click="qrDialog=true">
						  <v-icon>apps</v-icon>
					  </v-btn>
				  </v-toolbar>
			  </v-container>
		</v-layout>
		<v-layout row>
			<v-container fluid class="py-0">
				<v-timeline align-top class="py-0" id="messages" v-chat-scroll>
					<v-timeline-item
					  v-for="chat in chats"
					  :color="chat.color"
					  icon="face"
					  :key="chat.timestamp"
					>
					  <span slot="opposite">{{ chat.timestamp }}</span>
					  <v-card :color="chat.color" dark >
						<v-card-title class="text-no-wrap text-truncate subheading py-2">{{ chat.user }}</v-card-title>
						<v-card-text class="white text--primary">
						  {{ chat.message }}
						</v-card-text>
					  </v-card>
					</v-timeline-item>
				  </v-timeline>
			  </v-container>
		</v-layout>
		<v-footer app inset :style="{height: 100}">
		  <v-layout row align-center class="px-4 py-2">
			<v-flex xs11>
			  <v-text-field v-model="message" @keyup.enter="sendMessage()" single-line label="Type a message..."></v-text-field>
			</v-flex>
			<v-flex xs1 align-end style="min-width: 100px">
			  <v-btn color="blue lighten-2" @click="sendMessage()">send &nbsp; <v-icon>send</v-icon></v-btn>
			</v-flex>
		  </v-layout>
		</v-footer>
	</span>
</template>

<script>
export default {
	name: 'Chat',
	data() {
		return {
			uri: '',
			uid: '',
			user: '',
			color: '',
			message: '',
			qrDialog: false,
			chats: []
		}
	},
	sockets: {
		connect() {
			this.uid = sessionStorage.getItem('socket.id');
			let socket = this.$socket;
			if (!this.uid) {
				this.uid = socket.id;
				sessionStorage.setItem('socket.id', this.uid);
			}
			socket.emit('hello', this.uid);
			this.uri = socket.io.uri;
		},
		greetings(user) {
			this.user = user.name;
			this.color = user.color;
		},
		'chat message'(data) {
			this.chats.push({
				user: data.u,
				color: data.c,
				message: data.m,
				timestamp: data.t
			});
		}
	},
	methods: {
		sendMessage() {
			let socket = this.$socket;
			if (this.message.trim()) {
				socket.emit('chat message', {
					u: this.uid,
					m: this.message
				},
				function() {
					this.message = '';
				}.bind(this));
			}
		}
	}

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	#messages {
		overflow-y: auto;
		height: 80vh;
	}

	@media only screen
	and (min-device-width: 414px)
	and (max-device-width: 736px)
	and (-webkit-min-device-pixel-ratio: 3) {
		#messages {
			height: 75vh;
		}
	}

	@media only screen
	and (min-device-width : 375px)
	and (max-device-width : 667px) {
		#messages {
			height: 75vh;
		}
	}
	@media only screen
	and (min-device-width : 320px)
	and (max-device-width : 568px) {
		#messages {
			height: 70vh;
		}
	}
</style>
