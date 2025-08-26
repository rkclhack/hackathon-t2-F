<script setup>
import { ref, inject, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import socketManager from '../socketManager.js';

// 親から投稿データを受け取る
const props = defineProps({
  report: {
    type: Object,
  }
});

// provide/injectを使ってユーザー情報を取得
const userName = inject("userName")

const socket = socketManager.getInstance();
const router = useRouter();
const route = useRoute();
const fb_eva = ref(""); // 評価を保持
const fb_comment = ref(""); // コメントを保持

// Send.vue側でもsocket状態をログ出力
console.log('Send.vue - socket ID:', socket.id)
console.log('Send.vue - socket connected:', socket.connected)

// ルートパラメータからreportデータを取得してパース
const reportData = computed(() => {
  console.log('Computing reportData...');
  console.log('props.report:', props.report);
  console.log('route.params:', route.params);
  
  if (props.report) {
    console.log('Using props.report');
    return props.report;
  }
  if (route.params.report) {
    try {
      const parsed = JSON.parse(route.params.report);
      console.log('Parsed route.params.report:', parsed);
      return parsed;
    } catch (e) {
      console.error('Failed to parse report data:', e);
      return null;
    }
  }
  console.log('No report data found');
  return null;
});

const onSendFeedback = () => {
  if (!fb_eva.value || !fb_comment.value.trim()) {
    alert("評価とコメントの両方を入力してください。");
    return;
  }
  
  // reportオブジェクトが存在するかを確認
  const postId = reportData.value ? reportData.value.ID : 'test-id';
  
  console.log('送信するpost_id:', postId);
  console.log('reportData:', reportData.value);

  // サーバーに送信するデータ
  const feedbackData = {
    fb_eva: fb_eva.value,
    fb_comment: fb_comment.value,
    post_id: postId,
    reviewer_username: userName.value
  };

  console.log("送信直前 - socket connected:", socket.connected);
  console.log("送信直前 - socket ID:", socket.id);
  
  socket.emit("sendFeedbackEvent", feedbackData); 

  console.log("送信されたフィードバック:", feedbackData);
  
  // 送信後にChat.vueに戻る
  fb_eva.value = "";
  fb_comment.value = "";
  router.push("/chat/");
};
</script>

<template>
  <div class="feedback-container">
    <h2 class="feedback-title">投稿へのフィードバック</h2>
    
    <div class="report-preview" v-if="reportData">
      <p><strong>投稿者:</strong> {{ reportData.username }}</p>
      <p><strong>タスク:</strong> {{ reportData.task }}</p>
      <p><strong>URL:</strong> {{ reportData.url }}</p>
    </div>
    <div v-else>
      <p>表示する投稿がありません。URLから直接アクセスしたため、データが渡されていません。</p>
    </div>

    <div class="feedback-section">
      <p class="section-label">評価：</p>
      <div class="button-group">
        <button @click="fb_eva = 'good'" :class="{ active: fb_eva === 'good' }">Good</button>
        <button @click="fb_eva = 'bad'" :class="{ active: fb_eva === 'bad' }">Bad</button>
      </div>
    </div>

    <div class="feedback-section">
      <p class="section-label">コメント：</p>
      <textarea v-model="fb_comment" placeholder="フィードバックコメントを入力してください" class="comment-textarea"></textarea>
    </div>
  
    <button @click="onSendFeedback" class="send-button">送信</button>

  </div>
</template>

<style scoped>
.feedback-container {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.feedback-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.report-preview {
  background-color: #eee;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.feedback-section {
  margin-bottom: 15px;
}

.section-label {
  font-weight: 500;
  margin-bottom: 5px;
}

.button-group button {
  padding: 8px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  background-color: #fff;
  transition: background-color 0.2s, border-color 0.2s;
}

.button-group button:hover {
  background-color: #e9e9e9;
}

.button-group button.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.comment-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: vertical;
  min-height: 80px;
}

.send-button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #218838;
}
</style>