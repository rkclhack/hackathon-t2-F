<script setup>
import { inject, ref, reactive, onMounted } from "vue"
import { useRoute } from "vue-router"

// #region global state
const userName = inject("userName")
const reportData = inject("reportData")
// #endregion

// #region local variable
const route = useRoute()
const reportId = ref(route.params.id)
// #endregion

// #region reactive variable
const feedbackList = reactive([])
const fb_good_num = ref(0)
const fb_bad_num = ref(0)
const loading = ref(false)
// #endregion

// #region lifecycle
onMounted(() => {
  loadFeedback()
})
// #endregion

// #region local methods
const loadFeedback = async () => {
  try {
    loading.value = true
    
    // サンプルフィードバックデータを使用
    const sampleFeedbacks = [
      {
        id: 1,
        fb_comment: "コードの構造が分かりやすく、変数名も適切です。継続して頑張ってください！",
        fb_eva: "good",
        fb_user: "岩崎",
        created_at: new Date('2025-01-15T10:30:00')
      },
      {
        id: 2,
        fb_comment: "ロジックは良いですが、エラーハンドリングが不十分です。もう少し考慮してみてください。",
        fb_eva: "bad",
        fb_user: "高木",
        created_at: new Date('2025-01-15T14:20:00')
      },
      {
        id: 3,
        fb_comment: "アルゴリズムの選択が適切で、効率的な実装になっています。",
        fb_eva: "good",
        fb_user: "長塩",
        created_at: new Date('2025-01-15T16:45:00')
      }
    ]
    
    // feedbackListを初期化してからデータを追加
    feedbackList.splice(0)
    feedbackList.push(...sampleFeedbacks)
    calculateStats()
    
  } catch (error) {
    console.error('フィードバック取得エラー:', error)
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  fb_good_num.value = feedbackList.filter(f => f.fb_eva === 'good').length
  fb_bad_num.value = feedbackList.filter(f => f.fb_eva === 'bad').length
}

const onRefresh = () => {
  loadFeedback()
}

const formatTime = (date) => {
  return new Intl.DateTimeFormat('ja-JP', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
// #endregion
</script>

<template>
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">フィードバック受信</h1>
    <div class="mt-10">
      <p>レポートID：{{ reportId }}</p>
      <!-- <p>投稿者：{{ reportData.userName }}さん</p> -->
      <p>ログインユーザー：{{ userName }}さん</p>
      
      <!-- レポート内容表示 -->
      <!-- <div class="report-content mt-5" v-if="reportData.report">
        <h3>レポート内容</h3>
        <div class="report-item">
          <strong>タスク:</strong> {{ reportData.task }}
        </div>
        <div class="report-item">
          <strong>URL:</strong> 
          <a :href="reportData.url" target="_blank" class="report-link">{{ reportData.url }}</a>
        </div>
        <div class="report-item">
          <strong>プロセス:</strong> {{ reportData.process }}
        </div>
        <div class="report-item" v-if="reportData.post_time">
          <strong>投稿時間:</strong> {{ formatTime(reportData.post_time) }}
        </div>
      </div> -->
      
      <!-- フィードバック統計 -->
      <div class="stats-container mt-5">
        <div class="stat-item good">
          <span class="stat-icon">👍</span>
          <span class="stat-label">Good:</span>
          <span class="stat-number">{{ fb_good_num }}</span>
        </div>
        <div class="stat-item bad">
          <span class="stat-icon">👎</span>
          <span class="stat-label">Bad:</span>
          <span class="stat-number">{{ fb_bad_num }}</span>
        </div>
      </div>
      
      <!-- 更新ボタン -->
      <div class="mt-5">

        <button @click="onRefresh" class="button-normal" :disabled="loading">
          <span v-if="loading">🔄</span>
          <span v-else>↻</span>
          更新
        </button>
        <router-link to="/chat" class="link">
          <button type="button" class="button-normal button-exit">チャットに戻る</button>
        </router-link>
      </div>
    </div>

    <!-- ユーザー情報 -->
    <div class="user-info">
      ログインユーザー：{{ userName }}さん | レポートID：{{ reportId }}
    </div>

    <!-- フィードバック統計 -->
    <div class="stats-container">
      <div class="stat-card good">
        <div class="stat-icon">👍</div>
        <div class="stat-content">
          <div class="stat-label">Good</div>
          <div class="stat-number">{{ fb_good_num }}</div>
        </div>
      </div>
      <div class="stat-card bad">
        <div class="stat-icon">👎</div>
        <div class="stat-content">
          <div class="stat-label">Bad</div>
          <div class="stat-number">{{ fb_bad_num }}</div>
        </div>
      </div>
    </div>

    <!-- フィードバック表示エリア -->
    <div class="feedback-display-container" v-if="feedbackList.length !== 0">
      <h3 class="feedback-title">📋 受信したフィードバック</h3>
      <div class="feedback-messages">
        <div 
          v-for="feedback in feedbackList" 
          :key="feedback.id"
          class="feedback-item"
        >
          <div class="feedback-header">
            <span class="feedback-user">{{ feedback.fb_user }}</span>
            <span class="feedback-eva" :class="{ 'eva-good': feedback.fb_eva === 'good', 'eva-bad': feedback.fb_eva === 'bad' }">
              <span v-if="feedback.fb_eva === 'good'">👍 Good</span>
              <span v-else>👎 Bad</span>
            </span>
            <!-- <span class="feedback-time">{{ formatTime(feedback.created_at) }}</span> -->
          </div>
          <div class="feedback-content">
            {{ feedback.fb_comment }}
          </div>
        </div>
      </div>
    </div>

    <div class="feedback-display-container empty-state" v-else-if="!loading">
      <p class="empty-message">まだフィードバックがありません。</p>
    </div>

    <!-- ローディング表示 -->
    <div class="feedback-display-container empty-state" v-if="loading">
      <p class="empty-message">🔄 フィードバックを読み込み中...</p>
    </div>
  </div>
</template>

<style scoped>
.receive-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 2px solid #e1e5e9;
  flex-shrink: 0;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.user-info {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stats-container {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid;
  flex: 1;
  max-width: 200px;
}

.stat-card.good {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #10b981;
  color: #065f46;
}

.stat-card.bad {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-color: #ef4444;
  color: #7f1d1d;
}

.stat-icon {
  font-size: 32px;
  opacity: 0.8;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 14px;
  font-weight: 600;
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
}

.feedback-display-container {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  min-height: 400px;
}

.feedback-display-container.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-message {
  color: #64748b;
  font-size: 18px;
  text-align: center;
  font-style: italic;
}

.feedback-title {
  font-size: 18px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feedback-messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

.feedback-messages::-webkit-scrollbar {
  width: 8px;
}

.feedback-messages::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.feedback-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.feedback-messages::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.feedback-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.feedback-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.feedback-header {
  display: flex;
  justify-content: space-between; /* 要素を両端に配置 */
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f1f5f9;
}

.feedback-user {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.feedback-eva {
  font-weight: 600;
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.eva-good {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #065f46;
  border: 1px solid #10b981;
}

.eva-bad {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #7f1d1d;
  border: 1px solid #ef4444;
}

.feedback-time {
  color: #64748b;
  font-size: 12px;
  font-style: italic;
}

.feedback-content {
  line-height: 1.6;
  color: #334155;
  font-size: 15px;
}

.link {
  text-decoration: none;
}

.button-normal {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.3);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.report-content {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  background-color: #f9f9f9;

.button-normal::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.button-normal:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.4);
  background: linear-gradient(135deg, #5b52f0 0%, #8b5cf6 100%);
}

.button-normal:hover::before {
  left: 100%;
}

.button-normal:active {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 5px 15px rgba(79, 70, 229, 0.3);
}

.button-normal:disabled {
  background: #cbd5e1;
  color: #64748b;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.button-normal:disabled:hover {
  transform: none;
  box-shadow: none;
}

.button-exit {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
}

.button-exit::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s;
}

.button-exit:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
}

.button-exit:hover::before {
  left: 100%;
}

.button-exit:active {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 5px 15px rgba(239, 68, 68, 0.3);
}
</style>