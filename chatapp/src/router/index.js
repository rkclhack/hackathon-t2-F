import { createRouter, createWebHistory } from "vue-router"
import Report from "../components/Report.vue"
import Chat from "../components/Chat.vue"
import Login from "../components/Login.vue"
import Send from "../components/Send.vue"
import Receive from "../components/Receive.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },
    { // Chatのルート設定
      path: "/chat/",
      name: "chat",
      component: Chat,
      // beforeEnter: (to, from, next) => {
      //   if (from.name === "login") {
      //     next()
      //   } else {
      //     next({ name: "login" })
      //   }
      // },
    },
    { // Sendのルート設定を独立したオブジェクトとして追加
      path: "/send/",
      name: "send",
      component: Send
    },
    {
      path: "/chat/receive/:id",
      name: "receive",
      component: Receive,
      // beforeEnter: (to, from, next) => {
      //   if(from.name === "login" || from.name === "chat"){
      //     next()
      //   } else {
      //     next({ name:"login" })
      //   }
      // },
    },
    {
    },{
      path: "/report/",
      name: "report",
      component: Report
    }
  ],
})

export default router