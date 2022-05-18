<template>
  <div class="footer">
    <div class="toolbar">
      <ul>
        <li>
          <svg
            class="icon"
            width="22"
            height="22"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            data-v-4194ce60=""
          >
            <path
              fill="rgb(70, 70, 70)"
              d="M512 128a384 384 0 100 768 384 384 0 000-768zm0-64a448 448 0 110 896 448 448 0 010-896z"
            ></path>
            <path
              fill="rgb(70, 70, 70)"
              d="M640 288q64 0 64 64t-64 64q-64 0-64-64t64-64zM214.656 790.656l-45.312-45.312 185.664-185.6a96 96 0 01123.712-10.24l138.24 98.688a32 32 0 0039.872-2.176L906.688 422.4l42.624 47.744L699.52 693.696a96 96 0 01-119.808 6.592l-138.24-98.752a32 32 0 00-41.152 3.456l-185.664 185.6z"
            ></path>
          </svg>
        </li>
        <li>
          <svg
            class="icon"
            width="22"
            height="22"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            data-v-4194ce60=""
          >
            <path
              fill="rgb(100, 100, 100)"
              d="M96 896a32 32 0 01-32-32V160a32 32 0 0132-32h832a32 32 0 0132 32v704a32 32 0 01-32 32H96zm315.52-228.48l-68.928-68.928a32 32 0 00-45.248 0L128 768.064h778.688l-242.112-290.56a32 32 0 00-49.216 0L458.752 665.408a32 32 0 01-47.232 2.112zM256 384a96 96 0 10192.064-.064A96 96 0 00256 384z"
            ></path>
          </svg>
        </li>
      </ul>
    </div>
    <div class="input-send">
      <textarea
        placeholder="请输入内容"
        v-model="msg"
        @keydown.enter.prevent="sendTo"
        maxlength="2000"
      >
      </textarea>
    </div>
    <el-button color=" #409EFF" plain class="sendbtn" @click="sendTo"
      >发送</el-button
    >
  </div>
</template>

<script>
import axios from "axios";
import { ElNotification } from "element-plus";
import { ElMessage } from "element-plus";
import { ref } from "vue";
import store from "../store/index";
import { nanoid } from "nanoid";
//引入useWebsocket
import { useWebsocket } from "../hooks/index";
export default {
  name: "MessageInput",
  setup() {
    //websocket
    const ws = useWebsocket(handleMessage);
    //数据
    let msg = ref("");

    //方法
    function warnTip() {
      ElMessage({
        showClose: true,
        message: "不能发送空白消息哟",
        type: "error",
      });
    }
    function sendTo() {
      if (msg.value.trim() === "") {
        warnTip();
        return;
      } else if (store.state.currentFriend.currentObj === "") {
        ElMessage({
          showClose: true,
          message: "请选择一个朋友再发送消息",
          type: "warning",
        });
        return;
      }
      const msgObj = {
        local: nanoid(),
        msg: msg.value,
        // timer: new Date().getTime(),
        // fromwho: _username,
        to: store.state.currentFriend.currentObj,
      };

      //在把数据发送到服务器之前，先存在 sessionStorage 里面
      //在存之前要获取 已经存在的数据，然后来 拼接 ，再存(如果直接存的话会覆盖掉原有的字符串数据)
      let chatData = null;
      chatData = sessionStorage.getItem(store.state.currentFriend.currentObj);
      if (chatData === null) {
        chatData = JSON.stringify(msgObj) + "#$";
      } else {
        chatData += JSON.stringify(msgObj) + "#$";
      }
      sessionStorage.setItem(store.state.currentFriend.currentObj, chatData);
      //存sessionStorage完成以后，再把数据发送服务器
      ws.send("one|^$|" + JSON.stringify(msgObj));
      //就把会话存储里面的数据拿出来遍历
      // console.log(chatData.split("#$"));
      sendtovuex(chatData);
      //清空输入框
      msg.value = "";
    }

    function sendtovuex(chatData) {
      //先转化为数组，里面的元素是字符串
      const arr = chatData.split("#$");
      const a = [];
      //再把每一个元素从字符串变成对象，放进新的数组a
      arr.forEach((item) => {
        if (item) {
          a.push(JSON.parse(item));
        }
      });
      //现在要去渲染页面
      //把这个对象数组传给chattinfmain组件
      //利用vuex
      store.dispatch("msgAbout/messages", a);
      console.log(a);
    }

    //收到服务端传来的消息，应该存到 sessionStorage里面，而不是存到vuex里面
    //按照各自的键值，存到相应的sessionStorage里面，再进行渲染
    function handleMessage(e) {
      console.log("1111111111", e.data);

      // return;
      //服务端返回来的数据是字符串，存到相应的键值sessionStorage里面
      let msg_arr = e.data.split("|^$|");
      let status = msg_arr[0]; //状态
      let content = msg_arr[1]; //内容(是一个对象，但是是以字符串的形式)
      if (status === "one") {
        const _msgObj = JSON.parse(content);
        let chatData = null;
        chatData = sessionStorage.getItem(_msgObj.from);
        if (chatData === null) {
          chatData = content + "#$";
        } else {
          chatData += content + "#$";
        }
        //存进会话内存
        sessionStorage.setItem(_msgObj.from, chatData);
        if (JSON.parse(content).from === store.state.currentFriend.currentObj) {
          sendtovuex(chatData);
        }
      } else if (status === "resp") {
        //这是可撤回的消息,存到vuex
        let contentMsg = JSON.parse(content);
        store.dispatch("withdrawAbout/withdrawmsg", contentMsg);
      } else if (status === "push") {
        //这说明对方撤回消息了
        getHistoryMsg(store.state.currentFriend.currentObj);
        ElNotification({
          title: "通知消息",
          message: "对方撤回了一条消息",
          type: "info",
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
          sessionStorage.setItem(
            store.state.currentFriend.currentObj,
            chatData11
          );
          //先清空聊天界面
          store.dispatch("msgAbout/clearmsg");
          store.dispatch("msgAbout/messages", response.data);
        } else {
          return;
        }
      });
    }

    //返回值
    return {
      msg,
      sendTo,
      sendtovuex,
      warnTip,
      getHistoryMsg,
    };
  },
};
</script>

<style scoped>
.footer {
  position: relative;

  height: 186px;
  border-left: 1px solid #ccc;
  background-color: rgb(255, 255, 255);
}
.toolbar {
  height: 30px;
  padding: 8px 20px;
  margin-bottom: 10px;
  border-top: 1px solid #ccc;
}

.toolbar ul li {
  float: left;
  margin-right: 17px;
}
.input-send {
  float: left;
}
textarea {
  width: 637px;
  height: 100px;
  padding: 0px 20px;
  border: none;
  outline: none;
  resize: none;
  font-size: 18px;
  background-color: rgb(255, 255, 255);
}
.sendbtn {
  position: absolute;
  top: 145px;
  right: 20px;
}
</style>
