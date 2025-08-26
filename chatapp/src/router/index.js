import { createRouter, createWebHistory } from "vue-router"
import Report from "../components/Report.vue"
import Chat from "../components/Chat.vue"
import Login from "../components/Login.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    },{
      path: "/chat/",
      name: "chat",
      component: Chat,
      beforeEnter: (to, from, next) => {
        if(from.name === "login"){
          next()
        } else {
          next({ name:"login" })
        }
      },
    },{
      path: "/report/",
      name: "report",
      component: Report
    }
  ],
})

export default router