<template>
  <div class="bor">
    <div class="common-layout">
      <el-container>
        <!-- 左边侧边栏消息列表 -->
        <el-aside width="250px"><MessageList></MessageList></el-aside>
        <!-- 右 -->
        <el-container>
          <!-- 右边上方的聊天展示区 ChattingMain -->

          <!-- 聊天内容区 -->
          <el-main><router-view></router-view> </el-main>

          <el-footer>
            <MessageInput></MessageInput>
          </el-footer>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import { onBeforeUnmount, onMounted } from "vue";
import router from "../router";

//引入MessageList组件
import MessageList from "../components/MessageList.vue";
import MessageInput from "../components/MessageInput.vue";
export default {
  name: "ChatRoom",
  components: {
    MessageList,
    MessageInput,
  },
  setup() {
    onMounted(() => {
      let account = localStorage.getItem("account");
      // console.log(loginParam.username);
      if (!account) {
        router.push("/login");
        return;
      }
      //解决不断刷新的问题，也就是刷新死循环
      if (!localStorage.getItem("refresh")) {
        localStorage.setItem("refresh", 1);
        location.reload(true);
      }
    });
    onBeforeUnmount(() => {
      if (!localStorage.getItem("re1fresh")) {
        localStorage.setItem("re1fresh", 1);
        location.reload(true);
      }
    });
  },
};
</script>

<style scoped>
.common-layout {
  background: rgb(245, 245, 245);
}
.bor {
  width: 888px;
  height: 607px;
  margin: auto;
  box-shadow: 2px 3px 7px rgb(202, 202, 202);
}
.el-container.is-vertical {
  flex-direction: column;
}
.el-header {
  --el-header-height: 50px;
  --el-header-padding: 0 0px;
}
.el-main {
  height: 370px;
  border-left: 1px solid #ccc;
  --el-main-padding: 0px;
}
.el-footer {
  height: 186px;
  --el-footer-padding: 0px;
}
</style>
