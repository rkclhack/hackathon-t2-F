<script>
import { ref, onMounted, inject } from 'vue'
import socketManager from '../socketManager.js'

// Reportクラスの定義
class Report {
  constructor(task, url, process, post_time, ID, username) {
    this.task = task
    this.url = url
    this.process = process
    this.post_time = post_time
    this.ID = ID
    this.username = username
  }
}

export default {
  name: 'ReportForm',
  props: {
  },
  setup(props) {
    const socket = socketManager.getInstance()

    // injectを使用してユーザー名を取得
    const username = inject("userName")

    // リアクティブな変数の定義
    const input_task = ref('')
    const input_url = ref('')
    const input_process = ref('')
    const post_time = ref('')
    const ID = ref('')
    const showDebugInfo = ref(true) // デバッグ情報表示フラグ

    // IDを生成する関数
    const generateID = () => {
      return 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    }

    // 投稿時間を生成する関数
    const generatePostTime = () => {
      return new Date().toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }

    // フォーム送信処理
    const submitReport = () => {
      // 入力値の検証
      if (!input_task.value.trim() || !input_url.value.trim() || !input_process.value.trim()) {
        alert('すべての項目を入力してください．')
        return
      }

      // 投稿時間とIDを設定
      post_time.value = generatePostTime()
      ID.value = generateID()

      // Reportクラスのインスタンスを作成
      const report = new Report(
        input_task.value,      // task
        input_url.value,       // url
        input_process.value,   // process
        post_time.value,       // post_time
        ID.value,              // ID
        username.value         // username
      )

      // Socket.IOでサーバーにデータを送信
      socket.value.emit('reportSubmit', report)
      console.log('レポートをサーバーに送信しました:', report)

      // コンソールにデータを出力（実際の処理では API に送信など）
      console.log('レポートが投稿されました:', report)

      // 成功メッセージを表示
      alert('レポートが正常に投稿されました！')

      // フォームをリセット（オプション）
      // resetForm()

      // 画面遷移（チャット画面へ）
      router.push({ name: "chat" })
    }

    // フォームリセット関数
    const resetForm = () => {
      input_task.value = ''
      input_url.value = ''
      input_process.value = ''
      post_time.value = ''
      ID.value = ''
    }

    // コンポーネント初期化時の処理
    onMounted(() => {
      // 初期IDを生成
      ID.value = generateID()
      
      // URLパラメータやルートからユーザー名を取得する場合の例
      // const urlParams = new URLSearchParams(window.location.search)
      // const usernameFromUrl = urlParams.get('username')
      // if (usernameFromUrl) {
      //   username.value = usernameFromUrl
      // }
    })

    return {
      input_task,
      input_url,
      input_process,
      post_time,
      ID,
      username,
      showDebugInfo,
      submitReport,
      resetForm
    }
  }
}
</script>

<template>
  <div class="report-form-container">
    <div class="form-wrapper">
      <h1 class="form-title">レポート作成</h1>
      
      <form @submit.prevent="submitReport" class="report-form">
        <!-- タスクタイトル -->
        <div class="form-group">
          <label for="taskTitle" class="form-label">タスクタイトル</label>
          <input 
            type="text" 
            id="taskTitle"
            v-model="input_task" 
            class="form-input"
            placeholder="タスクタイトルを入力してください"
            required
          />
        </div>

        <!-- GitHub URL -->
        <div class="form-group">
          <label for="githubUrl" class="form-label">GitHub URL</label>
          <input 
            type="url" 
            id="githubUrl"
            v-model="input_url" 
            class="form-input"
            placeholder="https://github.com/..."
            required
          />
        </div>

        <!-- 思考プロセス -->
        <div class="form-group">
          <label for="thinkingProcess" class="form-label">思考プロセス</label>
          <textarea 
            id="thinkingProcess"
            v-model="input_process" 
            class="form-textarea"
            placeholder="思考プロセスを詳しく記述してください"
            rows="8"
            required
          ></textarea>
        </div>

        <!-- 投稿ボタン -->
        <button type="submit" class="submit-button">
          投稿する
        </button>
      </form>

      <!-- デバッグ用：現在の値を表示 -->
      <div class="debug-info" v-if="showDebugInfo">
        <h3>現在の値（デバッグ用）</h3>
        <p><strong>ID:</strong> {{ ID }}</p>
        <p><strong>ユーザー名:</strong> {{ username }}</p>
        <p><strong>タスクタイトル:</strong> {{ input_task }}</p>
        <p><strong>GitHub URL:</strong> {{ input_url }}</p>
        <p><strong>思考プロセス:</strong> {{ input_process }}</p>
        <p><strong>投稿時間:</strong> {{ post_time }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.report-form-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.form-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 600px;
}

.form-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.report-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-input,
.form-textarea {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #fafbfc;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
}

.submit-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.submit-button:active {
  transform: translateY(0);
}

.debug-info {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.debug-info h3 {
  color: #333;
  margin-bottom: 15px;
}

.debug-info p {
  margin: 5px 0;
  color: #666;
  font-size: 14px;
}

.debug-info strong {
  color: #333;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .form-wrapper {
    padding: 20px;
    margin: 10px;
  }
  
  .form-title {
    font-size: 24px;
  }
}
</style>