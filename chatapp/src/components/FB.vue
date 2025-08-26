<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  githubUrl: {
    type: String,
    required: true
  },
  thinkingProcess: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    default: '田中さん'
  },
  timestamp: {
    type: Date,
    default: () => new Date()
  }
})

const fbData = computed(() => {
  return {
    title: props.title,
    githubUrl: props.githubUrl,
    thinkingProcess: props.thinkingProcess,
    userName: props.userName,
    timestamp: props.timestamp
  }
})

const router = useRouter()

const onFeedback = () => {
  router.push({ name: 'send' })
}

const onViewFeedback = () => {
  router.push({ name: 'receive', params: { id: 1 } })
}
</script>

<template>
  <div class="fb-message-container">
    <!-- ユーザー情報とタイムスタンプ -->
    <div class="fb-message-header">
      <div class="user-avatar">
        {{ fbData.userName.charAt(0) }}
      </div>
      <div class="user-info">
        <div class="user-name">{{ fbData.userName }}</div>
        <div class="message-time">{{ new Date(fbData.timestamp).toLocaleString() }}</div>
      </div>
    </div>
    
    <!-- タイトル -->
    <div class="fb-title-section">
      <h3 class="fb-project-title">{{ fbData.title }}</h3>
    </div>
    
    <!-- GitHub URL -->
    <div class="fb-github-section">
      <div class="section-label">📁 GitHub リポジトリ</div>
      <a :href="fbData.githubUrl" target="_blank" class="github-link">
        {{ fbData.githubUrl }}
      </a>
    </div>
    
    <!-- 思考プロセス -->
    <div class="fb-thinking-section">
      <div class="section-label">🤔 思考プロセス</div>
      <div class="thinking-content">
        {{ fbData.thinkingProcess }}
      </div>
    </div>
    
    <!-- 個別FBボタン -->
    <div class="fb-individual-actions">
      <button @click="onFeedback" class="fb-individual-btn fb-btn">FBする</button>
      <button @click="onViewFeedback" class="fb-individual-btn fb-view-btn">FB見る</button>
    </div>
  </div>
</template>

<style scoped>
.fb-message-container {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e4e6ea;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.fb-message-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1877f2 0%, #42a5f5 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
  margin-right: 12px;
  text-transform: uppercase;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 15px;
  color: #050505;
  margin-bottom: 2px;
}

.message-time {
  font-size: 13px;
  color: #65676b;
}

.fb-title-section {
  margin-bottom: 16px;
}

.fb-project-title {
  font-size: 20px;
  font-weight: 700;
  color: #050505;
  margin: 0;
  line-height: 1.3;
}

.fb-github-section,
.fb-thinking-section {
  margin-bottom: 16px;
}

.section-label {
  font-weight: 600;
  font-size: 14px;
  color: #65676b;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.github-link {
  color: #1877f2;
  text-decoration: none;
  font-size: 14px;
  word-break: break-all;
  padding: 8px 12px;
  background: #f0f2f5;
  border-radius: 8px;
  display: inline-block;
  transition: background-color 0.2s;
}

.github-link:hover {
  background: #e4e6ea;
}

.thinking-content {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #050505;
  border-left: 4px solid #1877f2;
}

.fb-individual-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e4e6ea;
  justify-content: flex-end;
}

.fb-individual-btn {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.fb-individual-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

.fb-individual-btn.fb-btn {
  background: linear-gradient(135deg, #1877f2 0%, #42a5f5 100%);
  box-shadow: 0 2px 8px rgba(24, 119, 242, 0.3);
}

.fb-individual-btn.fb-btn:hover {
  box-shadow: 0 4px 12px rgba(24, 119, 242, 0.4);
}

.fb-individual-btn.fb-view-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.fb-individual-btn.fb-view-btn:hover {
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}
</style>