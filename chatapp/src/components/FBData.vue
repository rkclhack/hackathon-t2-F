<script setup>
import { computed } from 'vue'

const props = defineProps({
  userName: {
    type: String,
    default: '田中さん'
  },
  message: {
    type: String,
    default: 'チャットアプリのUIがとても使いやすいです！機能も充実していて素晴らしいと思います。'
  },
  timestamp: {
    type: Date,
    default: () => new Date()
  },
  reactions: {
    type: Array,
    default: () => ['👍', '❤️']
  },
  comments: {
    type: Array,
    default: () => [
      {
        userName: '佐藤',
        text: '私も同感です！'
      }
    ]
  }
})

const fbData = computed(() => ({
  type: 'message',
  userName: props.userName,
  message: props.message,
  timestamp: props.timestamp,
  reactions: props.reactions,
  isLiked: false,
  comments: props.comments
}))
</script>

<template>
  <div>
    {{ fbData }}
  </div>
</template>

<style scoped>
div {
  display: none;
}
</style>