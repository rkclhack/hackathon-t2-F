<script setup>
import { inject, ref } from "vue"
import { useRouter } from "vue-router"
import socketManager from '../socketManager.js'

// #region global state
const userName = inject("userName")
// #endregion

// #region local variable
const router = useRouter()
const socket = socketManager.getInstance()
// #endregion

// #region reactive variable
const inputUserName = ref("")
// #endregion

// #region browser event handler
// 入室メッセージをクライアントに送信する
const onEnter = () => {
  // ユーザー名が入力されているかチェック
  if(!inputUserName.value){
    alert("ユーザ名が未記入ですTT")
    return
  }
  // 入室メッセージを送信
  socket.emit("enterEvent", {
    type: 'system',
    userName: inputUserName.value
  })
  // 全体で使用するnameに入力されたユーザー名を格納
  userName.value = String(inputUserName.value)
  // チャット画面へ遷移
  router.push({ name: "chat" })
}
// #endregion
</script>

<template>
  <div class="login-form-container">
    <div class="form-wrapper">
      <h1 class="form-title">StuFeed Chat</h1>
      
      <form @submit.prevent="onEnter" class="login-form">
        <!-- ユーザー名 -->
        <div class="form-group">
          <label for="userName" class="form-label">ユーザー名</label>
          <input 
            type="text" 
            id="userName"
            v-model="inputUserName" 
            class="form-input"
            placeholder="ユーザー名を入力してください"
            required
          />
        </div>

        <!-- 入室ボタン -->
        <button type="submit" class="submit-button">
          入室する
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-form-container {
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
  max-width: 400px;
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

.login-form {
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

.form-input {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #fafbfc;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
