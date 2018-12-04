<template>
	<v-app>
		<!--<img alt="Vue logo" src="./assets/logo.png">-->
		<Chat />
	</v-app>
</template>

<script>
import Chat from './components/Chat.vue'

export default {
  name: 'app',
  components: {
    Chat
  }
}
</script>

