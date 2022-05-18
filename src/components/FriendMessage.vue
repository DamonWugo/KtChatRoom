<template>
  <div class="msg-box" @click="changeTo">
    <div id="head-portrait">
      <img :src="friendavatar" alt="" />
    </div>
    <div class="name-box">
      <p id="friend-name">{{ friendname }}</p>
      <p id="friend-message"></p>
    </div>
  </div>
</template>

<script>
import store from "../store";
import router from "../router";
import { computed } from "@vue/runtime-core";
import axios from "axios";
// import { ref } from "vue";

export default {
  name: "FriendMessage",
  props: ["friendname", "avatar"],
  setup(props) {
    let friendavatar = computed(() => {
      return props.avatar === ""
        ? "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        : props.avatar;
    });

    function changeTo() {
      //渲染页面
      router.push({
        name: "chattingmain",
        params: {
          friendname: props.friendname,
          friendavatar: friendavatar.value,
        },
      });
      //把当前对象传到vuex里面
      store.dispatch("currentFriend/currentObj", props.friendname);
      //当点击某一个朋友的时候,就去内存获取记录，传到vuex
      let chatData = sessionStorage.getItem(props.friendname);
      //先转化为数组，里面的元素是字符串
      //先清空聊天界面
      store.dispatch("msgAbout/clearmsg");
      if (chatData) {
        const arr = chatData.split("#$");
        const a = [];
        //再把每一个元素从字符串变成对象，放进新的数组a
        arr.forEach((item) => {
          if (item) {
            a.push(JSON.parse(item));
          }
        });
        //利用vuex

        //再把所有聊天记录放上去
        store.dispatch("msgAbout/messages", a);
      } else {
        getHistoryMsg(props.friendname);
      }
    }

    function getHistoryMsg(otherAccount) {
      axios({
        url: "chat/getHistoryMsg",
        method: "post",
        data: {
          otherAccount,
        },
        // success: (data) => {
        //   this.historyMsg[otherAccount] = data;
        //   this.userMsg = this.historyMsg[otherAccount];
        // },
      }).then((response) => {
        console.log(response.data);
        //获取了历史消息，放内存，毕竟每次点击一个朋友，都会清空vuex然后从会话内存获取，再存放到vuex
        //判断一个数组是否为空数组，就判断数组的length
        if (response.data.length !== 0) {
          let chatData11 = null;
          response.data.reverse();
          response.data.forEach((item) => {
            if (chatData11 === null) {
              chatData11 = JSON.stringify(item) + "#$";
            } else {
              chatData11 += JSON.stringify(item) + "#$";
            }
          });
          sessionStorage.setItem(props.friendname, chatData11);
          store.dispatch("msgAbout/messages", response.data);
        } else {
          return;
        }
      });
    }
    return {
      friendavatar,
      changeTo,
      getHistoryMsg,
    };
  },
};
</script>

<style scoped>
.msg-box {
  position: relative;
  height: 70px;
  width: 250px;
  padding: 15px;
  background-color: rgb(236, 234, 232);
  cursor: default;
}
.msg-box:hover {
  background-color: rgb(207, 207, 208);
}
#head-portrait {
  float: left;
  width: 39px;
  height: 39px;
  margin-right: 10px;
  background-color: #fff;
}
img {
  width: 100%;
  height: 100%;
}
.name-box {
  position: absolute;
  top: 16px;
  left: 65px;
}
#friend-name {
  width: 139px;
  height: 17px;
  line-height: 17px;
  font-size: 14px;
  margin-bottom: 5px;
}
#friend-message {
  width: 160px;
  height: 14px;
  line-height: 14px;
  font-size: 3px;
  color: rgb(136, 134, 134);
}
#friend-name,
#friend-message {
  /* 强制在一行显示文字 */
  white-space: nowrap;
  /* 溢出隐藏 */
  overflow: hidden;
  /* 用省略号替代剩余部分 */
  text-overflow: ellipsis;
}
</style>
