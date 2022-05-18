<template>
  <div>
    <div id="contact-name">{{ friendname }}</div>

    <div id="main-chat">
      <el-scrollbar height="370px" ref="scrollbar">
        <!-- 这里有个问题的，为什么chatmsg有些是没有id的，但是:key="chatmsg.id" 的时候不报错呢？ -->
        <ChatMessage
          v-for="chatmsg in $store.state.msgAbout.messages"
          :key="chatmsg.id"
          :chatmsg="chatmsg"
          :friendavatar="friendavatar"
          :local="chatmsg.local"
          :friendname="friendname"
        ></ChatMessage>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
//这里要引入store才可以使用 store
import store from "../store";
import ChatMessage from "../components/ChatMessage.vue";
import { ref, watch, computed, nextTick } from "vue";
export default {
  name: "ChattingMain",
  components: {
    ChatMessage,
  },
  //这里的friendname,friendavatar是路由参数传过来的
  props: ["friendname", "friendavatar"],
  setup() {
    let scrollbar = ref("");
    let main = ref("");
    let vuexMessages = computed(() => {
      return store.state.msgAbout.messages;
    });
    //watch监视响应式数据
    watch(
      vuexMessages,
      () => {
        nextTick(() => {
          scrollbar.value.setScrollTop(100000000000000);
        });
      },
      { deep: true }
    );

    return { scrollbar, main, vuexMessages };
  },
};
</script>

<style scoped>
#contact-name {
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
  background-color: rgb(255, 255, 255);
  border-left: 1px solid #ccc;
}
#main-chat {
  /* border-left: 1px solid #ccc; */
  height: 370px;
  background-color: rgb(245, 245, 245);
}
</style>
