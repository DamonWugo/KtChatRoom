// 这个文件用来创建整个应用的路由器

import { createRouter, createWebHashHistory } from "vue-router";
//引入路由组件
import ChattingMain from "../views/ChattingMain.vue";
import ChatRoom from "../views/ChatRoom.vue";
import UserLogin from "../views/UserLogin.vue";
import UserRegister from "../views/UserRegister.vue";

//创建一个路由器
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      name: "chatroom",
      path: "/chatroom",
      component: ChatRoom,
      children: [
        {
          name: "chattingmain",
          path: "chattingmain",
          component: ChattingMain,
          props($route) {
            return {
              friendname: $route.params.friendname,
              friendavatar: $route.params.friendavatar,
            };
          },
        },
      ],
    },
    { name: "denglu", path: "/", component: UserLogin },
    { name: "login", path: "/login", component: UserLogin },
    { name: "register", path: "/register", component: UserRegister },
  ],
});
//暴露路由
export default router;
