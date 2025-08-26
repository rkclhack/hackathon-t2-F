<script setup>
import { inject, ref,  onMounted, onBeforeUnmount, nextTick } from "vue"
import { useRouter } from "vue-router"
import socketManager from '../socketManager.js'
import FB from './FB.vue'
import HowUse from './Button/How-Use.vue'

// #region global state
const userName = inject("userName")
// #endregion

// #region local variable
const router = useRouter()
const socket = socketManager.getInstance()
// #endregion

// #region reactive variable
const chatContent = ref("")
const chatList = inject("chatList")
const clearChatHistory = inject("clearChatHistory")
const fbList = inject("fbList")
const chatMessages = ref(null)
// #endregion

// #region helper functions
const scrollToBottom = () => {
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight
      // さらに確実にスクロールするために少し遅延を追加
      setTimeout(() => {
        if (chatMessages.value) {
          chatMessages.value.scrollTop = chatMessages.value.scrollHeight
        }
      }, 100)
    }
  })
}

const formatTimestamp = (timestamp) => {
  if (!timestamp) return ''
  
  const now = new Date()
  const messageTime = new Date(timestamp)
  
  // 今日の日付かチェック
  const isToday = now.toDateString() === messageTime.toDateString()
  
  if (isToday) {
    // 今日なら時間のみ表示
    return messageTime.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } else {
    // 今日以外なら日付と時間を表示
    return messageTime.toLocaleString('ja-JP', { 
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }
}

const isOwnMessage = (chat) => {
  // 自分のメッセージかどうかを判定
  // チャットの userName から「さん」を除いた名前で比較
  const chatUserName = chat.userName.replace('さん', '')
  return chatUserName === userName.value
}
// #endregion

// #region lifecycle

onMounted(() => {
  registerSocketEvent()

})
// #endregion

const onPublish = () => {
  if (chatContent.value.trim() === "") return
  
  // チャット履歴に自分の投稿を即座に追加
  const myMessage = {
    type: 'message',
    userName: userName.value + 'さん',
    message: chatContent.value,
    timestamp: new Date()
  }
  
  chatList.push(myMessage)
  scrollToBottom()

  // サーバーに送信
  socket.emit("publishEvent", {
    type: 'message',
    userName: userName.value,
    message: chatContent.value,
  })
  chatContent.value = ""
}

// 退室メッセージをサーバに送信する
const onExit = () => {
  socket.emit("exitEvent", {
    type: 'system',
    userName: userName.value
  })
}

// メモを画面上に表示する
const onMemo = () => {
  if (!chatContent.value.trim()) return//もし、入力欄が空文字やスペースだけだった場合は 何もしないで終了。
  // メモの内容を表示
  chatList.push({
    type: 'memo',
    userName: userName.value + 'さんのメモ',
    message: chatContent.value,
    timestamp: new Date()
  })
  scrollToBottom()
  // 入力欄を初期化
  chatContent.value = ""
}

// レポート画面へ遷移
const onReport = () => {
  router.push({ name: "report" })
}


// #endregion

// #region socket event handler
// サーバから受信した入室メッセージ画面上に表示する
const onReceiveEnter = (data) => {
    chatList.push({
    type: 'system',
    userName: '',
    message: data.userName + 'さんが入室しました',
    timestamp: new Date()
  })
  scrollToBottom()
}


// サーバから受信した退室メッセージを受け取り画面上に表示する
const onReceiveExit = (data) => {
    chatList.push({
    type: 'system',
    userName: '',
    message: data.userName + 'さんが退室しました',
    timestamp: new Date()
  })
  scrollToBottom()
}

// サーバから受信した投稿メッセージをチャット履歴のみに追加
const onReceivePublish = (data) => {
  // 自分以外のユーザーからのメッセージをチャット履歴に追加
  if (data.userName !== userName.value) {
    // チャット履歴にのみ追加（FB表示には追加しない）
    chatList.push({
      type: 'message',
      userName: data.userName + 'さん',
      message: data.message,
      timestamp: new Date()
    })
    scrollToBottom()
  }
}

const onReceiveReport = (data) => {
  // 受信したレポートデータをFBリストに追加
  fbList.push({
    title: data.task,
    githubUrl: data.url,
    thinkingProcess: data.process,
    userName: data.username + 'さん',
    timestamp: new Date(data.post_time),
    ID: data.ID
  })
  console.log("Report received:", data)
  scrollToBottom()
}
// #endregion

// #region local methods
// イベント登録をまとめる
const registerSocketEvent = () => {
  socket.on("enterEvent", onReceiveEnter)
  socket.on("exitEvent", onReceiveExit)
  socket.on("publishEvent", onReceivePublish)
  socket.on("reportSubmit", onReceiveReport)
}

onBeforeUnmount(() => {
  // コンポーネントがアンマウントされる際にソケットのリスナーを解除
  socket.off("enterEvent", onReceiveEnter)
  socket.off("exitEvent", onReceiveExit)
  socket.off("publishEvent", onReceivePublish)
  socket.off("reportSubmit", onReceiveReport)
})
// #endregion
</script>

<template>
  <div class="chat-container">
    <div class="chat-header">
      <h1 class="text-h3 font-weight-medium">FB特化型チャットアプリ</h1>
      <div class="header-actions">
        <HowUse />
        <router-link to="/" class="link">
          <button type="button" class="button-normal button-exit" @click="onExit">退室する</button>
        </router-link>
      </div>
    </div>
    
    <div class="user-info">ログインユーザ：{{ userName }}さん</div>
    
    <!-- チャットメッセージ表示エリア -->
    <div class="chat-messages-container" v-if="chatList.length !== 0">
      <h3 class="messages-title">💬 チャット履歴</h3>
      <div class="chat-messages" ref="chatMessages">
        <div class="message-item" v-for="(chat, i) in chatList" :key="i">
          <!-- システムメッセージ（入退室など）は中央配置 -->
          <div v-if="chat.type === 'system'" class="system-message">
            <span class="message-text">{{ chat.message }}</span>
            <span class="message-timestamp">{{ formatTimestamp(chat.timestamp) }}</span>
          </div>
          <!-- メモメッセージは自分のメッセージとして右配置 -->
          <div v-else-if="chat.type === 'memo'" class="message-bubble own-message">
            <div class="message-content">
              <strong>{{ chat.userName }}:</strong> {{ chat.message }}
            </div>
            <div class="message-timestamp">{{ formatTimestamp(chat.timestamp) }}</div>
          </div>
          <!-- 通常のメッセージは送信者によって左右配置 -->
          <div v-else class="message-bubble" :class="{ 'own-message': isOwnMessage(chat), 'other-message': !isOwnMessage(chat) }">
            <div class="message-content">
              <strong>{{ chat.userName }}:</strong> {{ chat.message }}
            </div>
            <div class="message-timestamp">{{ formatTimestamp(chat.timestamp) }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chat-messages-container empty-state" v-else>
      <p class="empty-message">まだメッセージがありません。最初のメッセージを送信してみましょう！</p>
    </div>
    
    <!-- FB表示エリア -->
    <div class="fb-display-container" v-if="fbList.length !== 0">
      <h3 class="fb-title">📘 Facebook風フィードバック</h3>
      <div class="fb-messages">
        <FB 
          v-for="(item, i) in fbList" 
          :key="'fb-' + i" 
          :title="item.title"
          :github-url="item.githubUrl"
          :thinking-process="item.thinkingProcess"
          :user-name="item.userName"
          :timestamp="item.timestamp"
          :report-id="item.ID"
        />
      </div>
    </div>
    
    <div class="fb-display-container empty-state" v-else>
      <p class="empty-message">まだフィードバックがありません。</p>
    </div>
    
    
    <!-- 入力欄を最下部に配置 -->
    <div class="chat-input-container">
      <textarea 
        v-model="chatContent" 
        placeholder="投稿文を入力してください" 
        rows="3" 
        class="chat-input"
        @keydown.enter.prevent="onPublish"
      ></textarea>
      <div class="input-buttons">
        <button @click="onPublish" class="button-normal">投稿</button>
        <button @click="onMemo" class="button-normal util-ml-8px">メモ</button>
        <button @click="onReport" class="button-normal util-ml-8px">レポート</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.chat-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: 100vh;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
  grid-template-rows: auto auto 1fr 120px;
}

.chat-header {
  grid-column: 1 / -1;
}

.user-info {
  grid-column: 1 / -1;
}

.chat-input-container {
  grid-column: 1 / -1;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 2px solid #e1e5e9;
  flex-shrink: 0;
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
  margin: 16px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.chat-messages-container {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.fb-display-container {
  background: linear-gradient(135deg, #f0f2f5 0%, #e4e6ea 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #d1d5db;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.fb-title {
  font-size: 18px;
  font-weight: 700;
  color: #1877f2;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  gap: 8px;
}

.fb-messages {
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fb-messages::-webkit-scrollbar {
  width: 8px;
}

.fb-messages::-webkit-scrollbar-track {
  background: #f0f2f5;
  border-radius: 4px;
}

.fb-messages::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.fb-messages::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

.chat-messages-container.empty-state {
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

.chat-input-container {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0 40px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chat-input {
  width: 100%;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.9);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin-bottom: 12px;
}

.chat-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #ffffff;
}

.chat-input::placeholder {
  color: #94a3b8;
  font-style: italic;
}

.input-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.messages-title {
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

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  min-height: 0;
  scroll-behavior: smooth;
  /* 新しいメッセージが追加されたときに自動的に下にスクロール */
  overflow-anchor: none;
}

.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.link {
  text-decoration: none;
}


.item {
  display: block;
}

.message-item {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* システムメッセージ（入退室など）は中央配置 */
.system-message {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(100, 116, 139, 0.1);
  border-radius: 20px;
  margin: 4px auto;
  max-width: 300px;
}

.system-message .message-text {
  color: #64748b;
  font-style: italic;
  font-size: 14px;
  text-align: center;
}

.system-message .message-timestamp {
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
  opacity: 1;
  background: rgba(100, 116, 139, 0.15);
  padding: 2px 6px;
  border-radius: 6px;
}

/* メッセージバブル */
.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  margin: 4px 0;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease-out;
}

/* 自分のメッセージ（右配置） */
.own-message {
  align-self: flex-end;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border-bottom-right-radius: 6px;
  margin-left: auto;
}

.own-message .message-content {
  color: white;
}

.own-message .message-timestamp {
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
}

/* 他のユーザーのメッセージ（左配置） */
.other-message {
  align-self: flex-start;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #334155;
  border-bottom-left-radius: 6px;
  margin-right: auto;
}

.other-message .message-content {
  color: #334155;
}

.other-message .message-timestamp {
  color: #64748b;
  background: rgba(100, 116, 139, 0.1);
}

/* メッセージ内容のレイアウト */
.message-content {
  margin-bottom: 6px;
  word-wrap: break-word;
  line-height: 1.4;
}

.message-timestamp {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 8px;
  text-align: right;
  opacity: 1;
}

/* アニメーション */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* メッセージバブルのホバー効果 */
.message-bubble:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.util-ml-8px {
  margin-left: 8px;
}

.button-normal {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.3);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

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

.button-normal:nth-child(2) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.3);
}

.button-normal:nth-child(2):hover {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
}

.fb-btn {
  background: linear-gradient(135deg, #1877f2 0%, #42a5f5 100%);
  box-shadow: 0 6px 20px rgba(24, 119, 242, 0.3);
}

.fb-btn:hover {
  background: linear-gradient(135deg, #42a5f5 0%, #1877f2 100%);
  box-shadow: 0 10px 30px rgba(24, 119, 242, 0.4);
}

.fb-view-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
}

.fb-view-btn:hover {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
}

.button-exit {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: none;
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