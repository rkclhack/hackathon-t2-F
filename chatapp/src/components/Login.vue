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
  <div class="mx-auto my-5 px-4">
    <h1 class="text-h3 font-weight-medium">Vue.js Chat サンプル</h1>
    <div class="mt-10">
      <p>ユーザー名</p>
      <input type="text" v-model="inputUserName" class="user-name-text" />
      <!-- <input type="text" v-model="inputUserName" class="user-name-text" /> -->
    </div>
    <button type="button" @click="onEnter" class="button-normal">入室する</button>
  </div>
</template>

<style scoped>
.user-name-text {
  width: 200px;
  border: 1px solid #888;
  margin-bottom: 16px;
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
  margin-top: 16px;
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
</style>
