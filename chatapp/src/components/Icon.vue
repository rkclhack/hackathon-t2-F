<template>
  <div class="user-icon" :class="{ 'icon-own': isOwnMessage, 'icon-other': !isOwnMessage }">
    <div class="avatar-container">
      <img 
        :src="avatarUrl" 
        :alt="`${username}のアバター`" 
        class="avatar-image"
        @error="handleImageError"
      />
      <div class="status-indicator" :class="statusClass"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  username: {
    type: String,
    required: true
  },
  isOwnMessage: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'online', // online, offline, away
    validator: (value) => ['online', 'offline', 'away'].includes(value)
  },
  customAvatar: {
    type: String,
    default: ''
  }
})

const imageError = ref(false)

const avatarUrl = computed(() => {
  if (props.customAvatar && !imageError.value) {
    return props.customAvatar
  }
  
  // デフォルトのダミー画像を生成（ユーザー名に基づく色とイニシャル）
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43'
  ]
  
  const colorIndex = props.username.charCodeAt(0) % colors.length
  const backgroundColor = colors[colorIndex]
  const initial = props.username.charAt(0).toUpperCase()
  
  // SVG Data URL を生成
  const svgContent = `
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="20" fill="${backgroundColor}"/>
      <text x="20" y="26" font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
            text-anchor="middle" fill="white">${initial}</text>
    </svg>
  `
  
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`
})

const statusClass = computed(() => {
  return {
    'status-online': props.status === 'online',
    'status-offline': props.status === 'offline',
    'status-away': props.status === 'away'
  }
})

const handleImageError = () => {
  imageError.value = true
}
</script>

<style scoped>
.user-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.icon-own .avatar-image {
  border-color: rgba(102, 126, 234, 0.8);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.icon-other .avatar-image {
  border-color: rgba(240, 147, 251, 0.8);
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3);
}

.avatar-image:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.status-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.status-online {
  background-color: #4CAF50;
  animation: pulse 2s infinite;
}

.status-offline {
  background-color: #9E9E9E;
}

.status-away {
  background-color: #FF9800;
  animation: pulse 3s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}

@media (max-width: 768px) {
  .avatar-image {
    width: 32px;
    height: 32px;
  }
  
  .status-indicator {
    width: 10px;
    height: 10px;
  }
}
</style>