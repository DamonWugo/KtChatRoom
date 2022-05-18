<template>
  <div class="bubble-list">
    <div id="head-portrait" :class="isMe ? 'avatarfr' : 'avatarfl'">
      <img :src="isMe ? avatarURL : friendavatar" alt="" />
    </div>
    <el-popover
      ref="popover"
      trigger="contextmenu"
      placement="top"
      :width="150"
      :disabled="isMe ? false : true"
    >
      <template #reference>
        <div :class="isMe ? 'rbubble' : 'lbubble'" :local="local">
          {{ chatmsg.msg }}
        </div>
      </template>
      <div>
        <ul>
          <li @click="withdrawMessage(friendname)" style="cursor: pointer">
            &nbsp;&nbsp;&nbsp;点击撤回此消息
          </li>
        </ul>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import axios from "axios";
import { computed } from "@vue/runtime-core";
import { ref } from "vue";
import store from "@/store";
export default {
  name: "ChatMessage",
  props: ["chatmsg", "friendname", "friendavatar", "local"],
  setup(props) {
    let avatarURL = ref(
      store.state.myselfAbout.avatar === ""
        ? "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        : store.state.myselfAbout.avatar
    );
    //计算属性
    let isMe = computed(() => {
      if (props.chatmsg.from && props.chatmsg.to) {
        if (props.chatmsg.from === localStorage.getItem("account")) {
          return true; //是我发出的消息
        } else {
          return false;
        }
      } else if (props.chatmsg.local) {
        return true;
      } else return false;
    });

    function withdrawMessage(otherAccount) {
      //右键点击的时候就要获得属性local
      if (props.local) {
        let vuexWithdraw = store.state.withdrawAbout.withdrawMsg;
        console.log(vuexWithdraw);
        //会返回一个符合条件的新数组，不会改变原数组
        let newVuexWithdraw = vuexWithdraw.filter((item) => {
          if (item.local) {
            return item.local === props.local;
          }
        });
        console.log(newVuexWithdraw[0].id);
        console.log(props.local);
        axios({
          method: "POST",
          url: "chat/withdraw",
          data: {
            id: newVuexWithdraw[0].id,
            otherAccount,
          },
        }).then((response) => {
          console.log(response);
          //撤回成功！！！
          if (response.data === "ok") {
            getHistoryMsg(otherAccount);
            ElMessage({
              message: "撤回消息成功",
              type: "success",
            });
          }
        });
      } else {
        axios({
          method: "POST",
          url: "chat/withdraw",
          data: {
            id: props.chatmsg.id,
            otherAccount,
          },
        }).then((response) => {
          console.log(response);
          if (response.data === "消息必须在两分钟内撤回") {
            ElMessage({
              message: "消息发出已经超过两分钟,撤回失败",
              type: "error",
            });
          } else {
            ElMessage({
              message: "撤回消息成功",
              type: "success",
            });
            getHistoryMsg(otherAccount);
          }
        });
      }
    }
    function getHistoryMsg(otherAccount) {
      axios({
        url: "chat/getHistoryMsg",
        method: "post",
        data: {
          otherAccount,
        },
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
          //先清空聊天界面
          store.dispatch("msgAbout/clearmsg");
          store.dispatch("msgAbout/messages", response.data);
        } else {
          sessionStorage.removeItem(props.friendname);
          store.dispatch("msgAbout/clearmsg");
          store.dispatch("msgAbout/messages", response.data);
        }
      });
    }

    return {
      isMe,
      avatarURL,
      withdrawMessage,
      getHistoryMsg,
    };
  },
};
</script>

<style scoped>
.bubble-list {
  margin: 10px 20px;
}
/* 清除浮动 */
.bubble-list::after {
  content: "";
  display: block;
  clear: both;
}

/* 头像大小 */
.avatarfl {
  float: left;
  width: 39px;
  height: 39px;
}
.avatarfr {
  float: right;
  width: 39px;
  height: 39px;
}

img {
  width: 100%;
  height: 100%;
}
/* 左边聊天内容 */
.lbubble {
  position: relative;
  float: left;
  position: relative;
  background-color: #fff;
  margin-left: 15px;
  padding: 10px;
  max-width: 60%;
  border-radius: 10px;
  white-space: normal;
  word-wrap: break-word;
}
.rbubble {
  float: right;
  position: relative;
  background-color: rgb(158, 234, 106);
  margin-right: 15px;
  padding: 10px;
  max-width: 60%;
  border-radius: 10px;
  white-space: normal;
  word-wrap: break-word;
}

.lbubble:hover {
  background-color: rgb(235, 235, 235);
}

.rbubble:hover {
  background-color: rgb(137, 217, 97);
}

.contextmenuRight {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 110px;
  text-align: center;
  padding: 5px 30px;
  background-color: #fff;
}

/* 清除下方输入框浮动 */
/* .input-send::before {
  content: "";
  display: block;
  clear: both;
} */
</style>
