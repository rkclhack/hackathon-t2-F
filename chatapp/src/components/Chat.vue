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
const feedbackList = inject("feedbackList")
const chatMessages = ref(null)
const isFullscreenChat = ref(false)
const isFullscreenFB = ref(false)
const isMobile = ref(false)
const showReportModal = ref(false)
const reportForm = ref({
  task: '',
  url: '',
  process: ''
})
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
  checkMobile()
  window.addEventListener('resize', checkMobile)
  // Report.vueからのメッセージを受信
  window.addEventListener('message', handleMessage)
})

const handleMessage = (event) => {
  if (event.data.type === 'closeReportModal') {
    closeReportModal()
  }
}

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}
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

// レポートモーダルを開く
const onReport = () => {
  showReportModal.value = true
}

const closeReportModal = () => {
  showReportModal.value = false
  // フォームをリセット
  reportForm.value = {
    task: '',
    url: '',
    process: ''
  }
}

const submitReport = () => {
  if (!reportForm.value.task || !reportForm.value.url || !reportForm.value.process) {
    alert("すべてのフィールドを入力してください")
    return
  }

  // レポートデータをサーバーに送信
  socket.emit("reportSubmit", {
    username: userName.value,
    task: reportForm.value.task,
    url: reportForm.value.url,
    process: reportForm.value.process,
    post_time: new Date().toISOString(),
    ID: 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  })

  alert("レポートが投稿されました！")
  closeReportModal()
}

const toggleChatFullscreen = () => {
  isFullscreenChat.value = !isFullscreenChat.value
  if (isFullscreenChat.value) {
    isFullscreenFB.value = false
  }
  nextTick(() => {
    scrollToBottom()
  })
}

const toggleFBFullscreen = () => {
  isFullscreenFB.value = !isFullscreenFB.value
  if (isFullscreenFB.value) {
    isFullscreenChat.value = false
  }
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

const onFeedbackReceived = (data) => {
  console.log('=== onFeedbackReceived関数が呼ばれました ===')
  // console.log('フィードバック受信:', data)
  // console.log('現在のレポートID:', reportId.value)
  // console.log('受信したpost_id:', data.post_id)

  feedbackList.push({
    fb_eva: data.fb_eva,
    fb_comment: data.fb_comment,
    post_id: data.post_id,
    reviewer_username: data.reviewer_username
  })
  console.log(feedbackList);
  console.log("Report received:", data)
}
// #endregion

// #region local methods
// イベント登録をまとめる
const registerSocketEvent = () => {
  socket.on("enterEvent", onReceiveEnter)
  socket.on("exitEvent", onReceiveExit)
  socket.on("publishEvent", onReceivePublish)
  socket.on("reportSubmit", onReceiveReport)
  socket.on("sendFeedbackEvent", onFeedbackReceived)
}

onBeforeUnmount(() => {
  // コンポーネントがアンマウントされる際にソケットのリスナーを解除
  socket.off("enterEvent", onReceiveEnter)
  socket.off("exitEvent", onReceiveExit)
  socket.off("publishEvent", onReceivePublish)
  socket.off("reportSubmit", onReceiveReport)
  socket.off("sendFeedbackEvent", onFeedbackReceived)
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('message', handleMessage)
})
// #endregion
</script>

<template>
  <div class="chat-container" :class="{ 
    'fullscreen-mode': isFullscreenChat || isFullscreenFB,
    'chat-fullscreen': isFullscreenChat,
    'fb-fullscreen': isFullscreenFB
  }">
    <div class="chat-header" v-show="!isFullscreenChat && !isFullscreenFB">
      <h1 class="app-title">StuFeed Chat</h1>
      <div class="header-actions">
        <HowUse />
        <router-link to="/" class="link">
          <button type="button" class="button-normal button-exit" @click="onExit">ログアウト</button>
        </router-link>
      </div>
    </div>
    
    <div class="user-info" v-show="!isFullscreenChat && !isFullscreenFB">
      <div class="user-avatar">👤</div>
      <span class="user-name">{{ userName }}さん</span>
      <div class="online-status"></div>
    </div>
    
    <!-- チャットメッセージ表示エリア -->
    <div class="chat-messages-container" 
         v-if="chatList.length !== 0" 
         :class="{ 'fullscreen': isFullscreenChat, 'hidden': isFullscreenFB }"
         v-show="!isFullscreenFB">
      <div class="section-header">
        <h3 class="messages-title">💬 チャット</h3>
        <button class="zoom-button" @click="toggleChatFullscreen" v-show="isMobile">
          {{ isFullscreenChat ? '🔙' : '🔍' }}
        </button>
      </div>
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
      
      <!-- チャット内部の入力欄 -->
      <div class="chat-input-section" v-show="!isFullscreenFB">
        <div class="input-with-buttons">
          <textarea 
            v-model="chatContent" 
            placeholder="チャット内容を入力してください" 
            rows="2" 
            class="chat-input-inline"
            @keydown.enter.prevent="onPublish"
          ></textarea>
          <div class="chat-action-buttons">
            <button @click="onPublish" class="send-button">📤</button>
            <button @click="onMemo" class="memo-button">📝</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chat-messages-container empty-state" v-else v-show="!isFullscreenFB">
      <div class="section-header">
        <h3 class="messages-title">💬 チャット</h3>
        <button class="zoom-button" @click="toggleChatFullscreen" v-show="isMobile">
          {{ isFullscreenChat ? '🔙' : '🔍' }}
        </button>
      </div>
      <p class="empty-message">まだメッセージがありません。最初のメッセージを送信してみましょう！</p>
      
      <!-- チャット内部の入力欄（空の場合） -->
      <div class="chat-input-section" v-show="!isFullscreenFB">
        <div class="input-with-buttons">
          <textarea 
            v-model="chatContent" 
            placeholder="チャット内容を入力してください" 
            rows="2" 
            class="chat-input-inline"
            @keydown.enter.prevent="onPublish"
          ></textarea>
          <div class="chat-action-buttons">
            <button @click="onPublish" class="send-button">📤</button>
            <button @click="onMemo" class="memo-button">📝</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- FB表示エリア -->
    <div class="fb-display-container" 
         v-if="fbList.length !== 0" 
         :class="{ 'fullscreen': isFullscreenFB, 'hidden': isFullscreenChat }"
         v-show="!isFullscreenChat">
      <div class="section-header">
        <h3 class="fb-title">📘 FB</h3>
        <button class="zoom-button" @click="toggleFBFullscreen" v-show="isMobile">
          {{ isFullscreenFB ? '🔙' : '🔍' }}
        </button>
      </div>
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
    
    <div class="fb-display-container empty-state" v-else v-show="!isFullscreenChat">
      <div class="section-header">
        <h3 class="fb-title">📘 FB内容</h3>
        <button class="zoom-button" @click="toggleFBFullscreen" v-show="isMobile">
          {{ isFullscreenFB ? '🔙' : '🔍' }}
        </button>
      </div>
      <p class="empty-message">まだフィードバックがありません。</p>
    </div>
    
    
    <!-- アクションボタンを画面下部中央に配置 -->
    <div class="action-buttons-container" v-show="!isFullscreenFB && !isFullscreenChat">
      <div class="input-buttons">
        <button @click="onReport" class="button-normal">レポート</button>
      </div>
    </div>

    <!-- レポートモーダル -->
    <div class="modal-overlay" v-show="showReportModal" @click="closeReportModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>レポート作成</h2>
          <button class="modal-close" @click="closeReportModal">×</button>
        </div>
        <div class="modal-body">
          <div class="report-form">
            <div class="form-group">
              <label for="task">課題・タスク内容</label>
              <input 
                type="text" 
                id="task" 
                v-model="reportForm.task" 
                placeholder="今回取り組んだ課題やタスクを入力してください"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="url">GitHubのURL</label>
              <input 
                type="url" 
                id="url" 
                v-model="reportForm.url" 
                placeholder="https://github.com/username/repository"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="process">取り組み方・思考プロセス</label>
              <textarea 
                id="process" 
                v-model="reportForm.process" 
                placeholder="どのように問題にアプローチしたか、どんなことを考えながら取り組んだかを詳しく書いてください"
                rows="8"
                class="form-textarea"
              ></textarea>
            </div>
            
            <div class="form-actions">
              <button @click="submitReport" class="submit-button">投稿する</button>
              <button @click="closeReportModal" class="cancel-button">キャンセル</button>
            </div>
          </div>
        </div>
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

/* スマートフォン向け（768px以下） */
@media (max-width: 768px) {
  .chat-container {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 0 16px 100px 16px;
    grid-template-rows: auto auto 1fr 1fr;
    min-height: 100vh;
    overflow-y: auto;
  }
  
  .chat-messages-container,
  .fb-display-container {
    min-height: 1200px;
    max-height: 110vh;
    overflow-y: auto;
  }
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

/* スマートフォン向けヘッダー */
@media (max-width: 768px) {
  .chat-header {
    flex-direction: column;
    gap: 12px;
    text-align: center;
    padding: 16px 0;
  }
  
  .chat-header h1 {
    font-size: 1.5rem !important;
    margin: 0;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .app-title {
    font-size: 1.8rem !important;
  }
}

.app-title {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Inter', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin: 0;
  position: relative;
  text-shadow: 0 0 30px rgba(102, 126, 234, 0.3);
}

.app-title::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  border-radius: 2px;
  opacity: 0.7;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border: 1px solid #cbd5e1;
  border-radius: 24px;
  padding: 8px 16px;
  font-weight: 600;
  color: #475569;
  margin: 12px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  max-width: fit-content;
  transition: all 0.2s ease;
}

.user-info:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 50%;
  font-size: 16px;
  color: white;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);
}

.user-name {
  font-size: 15px;
  font-weight: 700;
  color: #334155;
  letter-spacing: 0.3px;
}

.online-status {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  border: 2px solid #f8fafc;
  box-shadow: 0 0 0 1px #10b981, 0 0 6px rgba(16, 185, 129, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
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

/* スマートフォン向けメッセージコンテナ */
@media (max-width: 768px) {
  .chat-messages-container {
    padding: 16px;
    border-radius: 12px;
  }
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

/* スマートフォン向けFBコンテナ */
@media (max-width: 768px) {
  .fb-display-container {
    padding: 16px;
    border-radius: 12px;
  }
}

.fb-title {
  font-size: 18px;
  font-weight: 700;
  color: #1877f2;
  margin: 0;
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

.chat-input-section {
  border-top: 1px solid #e2e8f0;
  padding: 16px;
  margin-top: 16px;
  background: #f8fafc;
  border-radius: 0 0 16px 16px;
}

.input-with-buttons {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.chat-action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-input-inline {
  flex: 1;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.4;
  resize: vertical;
  min-height: 40px;
  transition: all 0.3s ease;
  background: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.chat-input-inline:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
  background: #ffffff;
}

.chat-input-inline::placeholder {
  color: #94a3b8;
  font-style: italic;
}

.send-button {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
  height: fit-content;
  min-width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

.send-button:active {
  transform: translateY(0);
}

.memo-button {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
  height: fit-content;
  min-width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.memo-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.memo-button:active {
  transform: translateY(0);
}

.action-buttons-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: white;
  padding: 16px;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
}

/* スマートフォン向け入力コンテナ */
@media (max-width: 768px) {
  .chat-input-container {
    margin: 0;
    padding: 12px 16px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10;
    flex-shrink: 0;
    background: white;
    border-top: 1px solid #e2e8f0;
  }
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

/* スマートフォン向け入力欄 */
@media (max-width: 768px) {
  .chat-input {
    font-size: 16px;
    padding: 12px;
    min-height: 40px;
  }
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
  justify-content: center;
  align-items: center;
}

/* スマートフォン向けレイアウト */
@media (max-width: 768px) {
  .action-buttons-container {
    bottom: 10px;
    padding: 12px;
  }
  
  .input-buttons {
    gap: 8px;
  }
  
  .input-buttons button {
    padding: 10px 16px;
    font-size: 14px;
    min-width: 80px;
  }
  
  .chat-input-section {
    padding: 12px;
    margin-top: 12px;
  }
  
  .input-with-buttons {
    gap: 8px;
  }
  
  .chat-action-buttons {
    gap: 6px;
  }
  
  .chat-input-inline {
    padding: 10px 14px;
    font-size: 16px;
  }
  
  .send-button,
  .memo-button {
    padding: 10px 12px;
    font-size: 16px;
    min-width: 40px;
  }
}

.messages-title {
  font-size: 18px;
  font-weight: 700;
  color: #334155;
  margin: 0;
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

/* スマートフォン向けメッセージバブル */
@media (max-width: 768px) {
  .message-bubble {
    max-width: 85%;
    padding: 10px 14px;
    font-size: 16px;
  }
  
  .system-message {
    max-width: 90%;
    padding: 6px 12px;
  }
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

/* フルスクリーン機能のスタイル */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e2e8f0;
}

.zoom-button {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
}

.zoom-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(99, 102, 241, 0.4);
}

.chat-container.fullscreen-mode.chat-fullscreen {
  grid-template-rows: 1fr auto;
  grid-template-columns: 1fr;
}

.chat-container.fullscreen-mode.fb-fullscreen {
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
}

.fullscreen {
  grid-column: 1 / -1;
  max-height: 100vh !important;
  height: 100vh !important;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  margin: 0;
  border-radius: 0;
}

.fullscreen.chat-messages-container {
  grid-row: 1 / 2;
}

.fullscreen .section-header {
  position: sticky;
  top: 0;
  background: inherit;
  z-index: 10;
  margin: 0;
  padding: 16px 24px 12px;
}

.fullscreen .chat-messages {
  height: calc(100vh - 200px);
  padding: 0 24px 24px;
}

.fullscreen .fb-messages {
  height: calc(100vh - 80px);
  padding: 0 24px 24px;
}

.hidden {
  display: none !important;
}

/* スマートフォンでのみズームボタンを表示 */
@media (min-width: 769px) {
  .zoom-button {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .user-info {
    margin: 8px 0;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
  }
  
  .user-avatar {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
  
  .user-name {
    font-size: 14px;
  }
  
  .online-status {
    width: 6px;
    height: 6px;
  }
  
  .section-header {
    margin-bottom: 16px;
    padding-bottom: 8px;
  }
  
  .fullscreen .section-header {
    padding: 12px 16px 8px;
  }
  
  .fullscreen .chat-messages {
    height: calc(100vh - 180px);
    padding: 0 16px 16px;
  }
  
  .fullscreen .fb-messages {
    height: calc(100vh - 60px);
    padding: 0 16px 16px;
  }
  
  .fullscreen-input {
    position: fixed !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 1001 !important;
    grid-row: 2 / 3 !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }
}

/* モーダルのスタイル */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 90vw;
  height: 85vh;
  max-width: 1000px;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #334155;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  transform: scale(1.1);
}

.modal-body {
  height: calc(85vh - 80px);
  padding: 0;
}

.report-form {
  padding: 24px;
  height: 100%;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-weight: 600;
  font-size: 16px;
  color: #334155;
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 14px;
  line-height: 1.5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #94a3b8;
  font-style: italic;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.submit-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.submit-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.cancel-button {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button:hover {
  background: #e2e8f0;
  color: #475569;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (max-width: 768px) {
  .modal-content {
    width: 95vw;
    height: 90vh;
    border-radius: 12px;
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-header h2 {
    font-size: 20px;
  }
  
  .modal-body {
    height: calc(90vh - 70px);
  }
  
  .report-form {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .submit-button,
  .cancel-button {
    width: 100%;
    padding: 14px;
    font-size: 16px;
  }
}
</style>