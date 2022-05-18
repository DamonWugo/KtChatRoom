<template>
  <div class="recent-msg">
    <span>近期消息</span>
    <el-button type="text" class="addFriend" @click="dialogFormVisible = true"
      >添加好友</el-button
    >
    <span>|</span>
    <el-badge
      :value="applyList.applyListArr && applyList.applyListArr.length"
      :max="99"
    >
    </el-badge>
    <el-button
      type="text"
      style="margin-left: 5px"
      @click="
        getInitMessage();
        drawer = true;
      "
    >
      新的朋友
    </el-button>

    <!-- 新朋友的添加消息 -->
    <el-drawer v-model="drawer" title="新的朋友" :direction="direction">
      <ul class="newFriendNews">
        <div v-show="!applyList.applyListArr">暂无新朋友哟,快去叫人加你吧!</div>
        <li v-for="(apply, index) in applyList.applyListArr" :key="index">
          <span class="newfriend">{{ apply.name }}</span
          ><span>请求添加你为好友</span>
          <el-button
            type="success"
            plain
            class="agree"
            @click="agreeFriend(apply.account)"
            >同意</el-button
          >
          <el-button type="danger" plain class="refuse">拒绝</el-button>
        </li>
      </ul>
    </el-drawer>
  </div>

  <ul>
    <el-scrollbar height="557px">
      <FriendMessage
        v-for="friend in friendList.friendListArr"
        :key="friend.id"
        :friendname="friend.name"
        :avatar="friend.avatar"
      ></FriendMessage>
    </el-scrollbar>
  </ul>
  <!-- 添加好友对话框 -->
  <el-dialog v-model="dialogFormVisible" title="请输入好友的用户名" width="24%">
    <el-form :model="form">
      <el-input
        v-model="form.name"
        placeholder="请输入好友用户名"
        @keydown.enter.prevent="
          applyFriend(form.name);
          dialogFormVisible = false;
        "
      />
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消添加</el-button>
        <el-button
          type="primary"
          @click="
            applyFriend(form.name);
            dialogFormVisible = false;
          "
          >确认添加</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ElNotification } from "element-plus";
// import router from "../router";
import axios from "axios";
import FriendMessage from "./FriendMessage.vue";
import { ref, reactive, onMounted, watch } from "vue";
// import store from "@/store";
export default {
  name: "MessageList",
  components: { FriendMessage },
  setup() {
    const dialogTableVisible = ref(false);
    const dialogFormVisible = ref(false);
    const formLabelWidth = "140px";
    const form = reactive({ name: "" });

    let otherAccount = ref("");
    let isShow = ref(false);
    let applyList = reactive({
      applyListArr: [],
    });
    let friendList = reactive({
      friendListArr: [],
    });
    let myself = reactive({});

    const drawer = ref(false);
    const direction = ref("rtl");

    function openDialog() {
      isShow.value = true;
    }
    function closeDialog() {
      isShow.value = false;
    }
    function applyFriend(otherAccount) {
      axios({
        method: "POST",
        url: "chat/applyFriend",
        data: {
          otherAccount,
        },
      }).then((response) => {
        if (response.status === 200) {
          ElNotification({
            title: "Success",
            message: "发送好友请求成功",
            type: "success",
          });
          console.log(response);
          getInitMessage();
        } else if (response.data === "已经发送过请求，请等待对方同意") {
          console.log(response);
          getInitMessage();

          alert("已经发送过请求，请等待对方同意");
        } else if (
          response.data === "不存在的账号" ||
          response.data === "警告，提交信息未能通过格式校验"
        ) {
          console.log(response);
          alert("用户不存在");
        } else if (response.data === "对方已经向您发起申请请求了") {
          alert("对方已经向您发起申请请求了");
        } else {
          console.log(response);
        }
      });
    }
    function agreeFriend(otherAccount) {
      axios({
        method: "POST",
        url: "chat/agreeFriend",
        data: {
          otherAccount,
        },
      })
        .then((response) => {
          console.log(response);
          if (response.data === "ok") {
            getInitMessage();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function getInitMessage() {
      axios({
        method: "GET",
        url: "chat/getInitMessage",
      }).then((response) => {
        console.log(response);

        applyList.applyListArr = response.data.applyList;
        friendList.friendListArr = response.data.friendList;
      });
    }
    function getHistoryMsg(otherAccount) {
      axios({
        method: "POST",
        url: "chat/getHistoryMsg",
        data: {
          otherAccount,
        },
      }).then((response) => {
        console.log(response);
      });
    }

    watch(
      applyList,
      () => {
        console.log(222222222222222222222222);
      },
      { deep: true }
    );
    onMounted(() => {
      getInitMessage();
    });

    return {
      isShow,
      otherAccount,
      dialogTableVisible,
      dialogFormVisible,
      formLabelWidth,
      form,
      drawer,
      direction,
      applyList,
      friendList,
      myself,
      applyFriend,
      openDialog,
      closeDialog,
      agreeFriend,
      getInitMessage,
      getHistoryMsg,
    };
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}
.recent-msg {
  position: relative;
  background-color: rgb(255, 255, 255);
  height: 50px;
  line-height: 45px;
  padding-left: 10px;
}
.addFriend {
  margin-left: 20px;
}
.el-badge {
  position: absolute;
  right: 20px;
}
.el-badge__content {
  border: 1px solid var(--el-color-white);
}
.el-badge__content.is-fixed {
  position: absolute;
  top: 20px;
  right: calc(5px + var(--el-badge-size) / 2);
}
.el-badge[data-v-7218dcc5] {
  position: absolute;
  right: 10px;
}
.el-dialog {
  padding-top: 15px;
  padding-left: 30px;
  width: 390px;
}

.el-dialog__header {
  padding-bottom: 0px;
}
.el-dialog__body {
  padding: 20px;
}
.el-button--text {
  margin-right: 5px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
.el-drawer__header {
  margin-bottom: 0;
}
.newFriendNews li {
  position: relative;
  height: 60px;
  line-height: 60px;
  border-radius: 15px;
  box-shadow: 1px 1px 11px rgb(150, 150, 150);
  /* border: 1px solid rgb(64, 158, 255); */
  background-color: #79bbff;
  margin-bottom: 15px;
  padding-left: 15px;
}
.newfriend {
  margin-right: 5px;
}

.agree {
  position: absolute;
  top: 15px;
  right: 80px;
  width: 60px;
}
.refuse {
  position: absolute;
  top: 15px;
  right: 15px;

  width: 60px;
}
</style>
