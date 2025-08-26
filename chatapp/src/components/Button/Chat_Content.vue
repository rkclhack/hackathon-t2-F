<template>
  <div class="chat-content-container">
    <div class="chat-message" :class="{ 'message-sent': isOwnMessage, 'message-received': !isOwnMessage }">
      <div class="message-header">
        <Icon :username="userName" :isOwnMessage="isOwnMessage" />
        <div class="message-info">
          <span class="username">{{ userName }}</span>
          <span class="timestamp">{{ formattedTime }}</span>
        </div>
      </div>
      
      <div class="message-content">
        <p class="message-text">{{ message }}</p>
        
        <div class="feedback-actions" v-if="showFeedbackButtons">
          <Report-Add :messageId="messageId" />
          <Watch :messageId="messageId" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Icon from '../Icon.vue'
import ReportAdd from './Report-Add.vue'
import Watch from './Watch.vue'

const props = defineProps({
  userName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: [String, Date],
    default: () => new Date()
  },
  isOwnMessage: {
    type: Boolean,
    default: false
  },
  messageId: {
    type: String,
    default: () => Math.random().toString(36).substr(2, 9)
  },
  showFeedbackButtons: {
    type: Boolean,
    default: true
  }
})

const formattedTime = computed(() => {
  if (typeof props.timestamp === 'string') {
    return props.timestamp
  }
  const now = new Date(props.timestamp)
  return now.toLocaleTimeString('ja-JP', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
})
</script>

<style scoped>
.chat-content-container {
  margin: 16px 0;
  animation: slideIn 0.3s ease-out;
}

.chat-message {
  max-width: 80%;
  border-radius: 20px;
  padding: 16px 20px;
  margin: 8px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  backdrop-filter: blur(10px);
}

.chat-message:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.message-sent {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 8px;
  align-self: flex-end;
}

.message-received {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  margin-right: auto;
  border-bottom-left-radius: 8px;
  align-self: flex-start;
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.message-info {
  display: flex;
  flex-direction: column;
  margin-left: 12px;
}

.username {
  font-weight: 700;
  font-size: 14px;
  opacity: 0.9;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.timestamp {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 2px;
  font-weight: 400;
}

.message-content {
  margin-left: 50px;
}

.message-text {
  font-size: 16px;
  line-height: 1.5;
  margin: 0 0 12px 0;
  word-wrap: break-word;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.feedback-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  opacity: 0.8;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .chat-message {
    max-width: 90%;
    padding: 12px 16px;
  }
  
  .message-content {
    margin-left: 40px;
  }
  
  .message-text {
    font-size: 14px;
  }
}
</style>