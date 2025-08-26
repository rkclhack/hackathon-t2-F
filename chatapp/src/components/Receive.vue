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
    
    // 実際のAPIコール（現在はサンプルデータを使用）
    // const response = await fetch(`https://rks-intern.com:10079/api/reports/${reportId.value}/feedback`);
    // const data = await response.json();
    
    // サンプルフィードバックデータを使用
    const sampleFeedbacks = [
      {
        id: 1,
        fb_comment: "コードの構造が分かりやすく、変数名も適切です。継続して頑張ってください！",
        fb_eva: "good",
        created_at: new Date('2025-01-15T10:30:00')
      },
      {
        id: 2,
        fb_comment: "ロジックは良いですが、エラーハンドリングが不十分です。もう少し考慮してみてください。",
        fb_eva: "bad",
        created_at: new Date('2025-01-15T14:20:00')
      },
      {
        id: 3,
        fb_comment: "アルゴリズムの選択が適切で、効率的な実装になっています。",
        fb_eva: "good",
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
          フィードバックを更新
        </button>
      </div>
      
      <!-- フィードバック一覧 -->
      <div class="mt-5" v-if="feedbackList.length !== 0">
        <h2>受信したフィードバック</h2>
        <li class="feedback-item mt-4" v-for="feedback in feedbackList" :key="feedback.id">
          <div class="feedback-header">
            <span class="feedback-eva" :class="{ 'eva-good': feedback.fb_eva === 'good', 'eva-bad': feedback.fb_eva === 'bad' }">
              <span v-if="feedback.fb_eva === 'good'">👍 Good</span>
              <span v-else>👎 Bad</span>
            </span>
            <span class="feedback-time">{{ formatTime(feedback.created_at) }}</span>
          </div>
          <div class="feedback-content">
            {{ feedback.fb_comment }}
          </div>
        </li>
      </div>
      
      <!-- フィードバックがない場合 -->
      <div v-else-if="!loading" class="mt-5">
        <p>まだフィードバックがありません</p>
      </div>
    </div>
    
    <router-link to="/chat" class="link">
      <button type="button" class="button-normal button-exit">チャットに戻る</button>
    </router-link>
  </div>
</template>

<style scoped>
.link {
  text-decoration: none;
}

.stats-container {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.stat-item.good {
  border-color: #28a745;
  background-color: #f8fff9;
}

.stat-item.bad {
  border-color: #dc3545;
  background-color: #fff8f8;
}

.stat-icon {
  font-size: 18px;
}

.stat-label {
  font-weight: bold;
}

.stat-number {
  font-size: 18px;
  font-weight: bold;
}

.stat-item.good .stat-number {
  color: #28a745;
}

.stat-item.bad .stat-number {
  color: #dc3545;
}

.feedback-item {
  display: block;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  background-color: #f9f9f9;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.feedback-eva {
  font-weight: bold;
  font-size: 14px;
}

.eva-good {
  color: #28a745;
}

.eva-bad {
  color: #dc3545;
}

.feedback-time {
  color: #666;
  font-size: 12px;
}

.feedback-content {
  line-height: 1.6;
}

.button-exit {
  color: #000;
  margin-top: 8px;
}

.button-normal:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.report-content {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
  background-color: #f9f9f9;
}

.report-content h3 {
  margin: 0 0 12px 0;
  color: #333;
}

.report-item {
  margin-bottom: 8px;
  line-height: 1.6;
}

.report-link {
  color: #007bff;
  text-decoration: none;
}

.report-link:hover {
  text-decoration: underline;
}
</style>
