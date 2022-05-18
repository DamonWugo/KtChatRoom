<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <span class="chat">
          <router-link to="/chatroom">聊天区</router-link>
          <svg
            class="icon"
            width="30"
            height="30"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            data-v-ba633cb8=""
          >
            <path
              fill="currentColor"
              d="M160 826.88 273.536 736H800a64 64 0 0 0 64-64V256a64 64 0 0 0-64-64H224a64 64 0 0 0-64 64v570.88zM296 800 147.968 918.4A32 32 0 0 1 96 893.44V256a128 128 0 0 1 128-128h576a128 128 0 0 1 128 128v416a128 128 0 0 1-128 128H296z"
            ></path>
            <path
              fill="currentColor"
              d="M352 512h320q32 0 32 32t-32 32H352q-32 0-32-32t32-32zm0-192h320q32 0 32 32t-32 32H352q-32 0-32-32t32-32z"
            ></path>
          </svg>
        </span>
        <!-- 头像 -->
        <span class="userHome" v-if="islogined">
          <el-avatar
            :size="50"
            :src="circleUrl"
            style="--el-avatar-size: 39px"
            @mouseenter="showUserIndex"
            @mouseleave="hiddenUserIndex"
          />

          <transition name="userIndex" :appear="true">
            <div
              z-index="100;"
              class="userIndex"
              v-if="showit === true ? true : false"
              @mouseenter="showUserIndex"
              @mouseleave="hiddenUserIndex"
            >
              <el-avatar
                :size="70"
                :src="circleUrl"
                style="--el-avatar-size: 55px"
                class="bigAvatar"
              />
              <div class="accountName">hello,{{ accountName }}</div>
              <div class="changeavatar" @click="dialogVisible = true">
                更换头像
              </div>

              <div class="loginout" @click="loginout">退出登录</div>
            </div>
          </transition>
        </span>
        <div class="denglu" v-else>
          <span class="login">
            <router-link to="/login">登录</router-link>
          </span>
          <span class="register">
            <router-link to="/register">注册/</router-link>
          </span>
        </div>
      </el-header>
      <el-main><router-view></router-view></el-main>
    </el-container>
    <el-dialog v-model="dialogVisible" title="点击方框上传头像" width="24%">
      <div class="limitTip">上传头像的格式只能是jpg,且大小不能超过500kb!</div>
      <el-upload
        action="#"
        list-type="picture-card"
        :auto-upload="false"
        limit="1"
        :on-remove="handleRemove"
      >
        <template #file="{ file }">
          <div>
            <img
              class="el-upload-list__item-thumbnail"
              :src="file.url"
              alt=""
            />
          </div>
        </template>
      </el-upload>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="
              dialogVisible = false;
              uploadAvatar();
            "
            >确认</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import store from "../store/index";
import { ref, onMounted } from "vue";
import { ElMessage, ElNotification } from "element-plus";
import router from "../router";
import axios from "axios";
export default {
  name: "NavigationBar",
  setup() {
    const upload = ref(null);
    let islogined = store.state.loginAbout.islogined;
    let circleUrl = ref(
      "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    );
    let showit = ref(false);
    let accountName = localStorage.getItem("account");

    const dialogVisible = ref(false);

    //上传头像

    function showUserIndex() {
      showit.value = true;
    }
    function hiddenUserIndex() {
      showit.value = false;
    }

    function uploadAvatar() {
      let a = document.querySelector(".el-upload__input");

      let avatar = a.files[0];

      console.log(a.files[0]);
      if (avatar === undefined) {
        ElMessage({
          message: "你还没上传头像哟",
          type: "warning",
        });
        return;
      }
      let formdata = new FormData();
      formdata.append("avatar", avatar);

      axios({
        method: "POST",
        url: "blog/uploadAvatar",
        data: formdata, //问题在这里，一开始写成了对象的形式。。。
      }).then((response) => {
        console.log(response);
        circleUrl.value = response.data;
        a.files[0] = null;
        ElNotification({
          title: "Success",
          message: "你已经成功上传头像",
          type: "success",
        });
      });
    }

    function loginout() {
      axios({
        method: "GET",
        url: "blog/logout",
      }).then((response) => {
        console.log(response);
        if (response.data === "ok") {
          localStorage.removeItem("account");
          localStorage.removeItem("refresh");
          sessionStorage.clear();

          router.replace("/login");
        }
      });
    }
    function getInitMessage() {
      axios({
        method: "GET",
        url: "chat/getInitMessage",
      }).then((response) => {
        console.log(response);
        if (response.data === "请先登陆") {
          loginout(); //退出登录
        } else {
          if (response.data.self.avatar !== "") {
            circleUrl.value = response.data.self.avatar;
            console.log(response.data.self.avatar);
          }
          store.dispatch("myselfAbout/myself", response.data.self.avatar);
        }
      });
    }
    onMounted(() => {
      getInitMessage();
    });

    return {
      circleUrl,
      islogined,
      showit,
      showUserIndex,
      hiddenUserIndex,
      accountName,
      dialogVisible,
      uploadAvatar,
      upload,
      loginout,
      getInitMessage,
    };
  },
};
</script>

<style>
.el-header {
  position: relative;
  line-height: 60px;
  background-color: #409eff;
}
.chat {
  float: left;
  margin-left: 50px;
  font-size: 20px;
  font-weight: 700;
}
.chat a {
  color: rgb(255, 255, 255);
}
.chat .icon {
  position: absolute;
  margin-top: 15px;
  margin-left: 5px;
  color: rgb(255, 255, 255);
}
.login,
.register {
  float: right;
  font-size: 20px;
  font-weight: 700;
}

.login a,
.register a {
  color: rgb(255, 255, 255);
}

.userHome {
  position: absolute;
  top: 10px;
  right: 213px;
}
.userIndex {
  position: absolute;
  top: 35px;
  left: -58px;
  width: 153px;
  background-color: #fff;
  box-shadow: 1px 1px 11px rgb(211, 211, 211);
  border-radius: 10px;
}
.bigAvatar {
  position: absolute;
  top: -35px;
  left: 50px;
}
.accountName {
  height: 50px;
  line-height: 50px;
  text-align: center;
  margin-top: 30px;
  border-bottom: 1px solid rgb(233, 233, 233);
}
.changeavatar {
  height: 39px;
  line-height: 39px;
  text-align: center;
  border-bottom: 1px solid rgb(233, 233, 233);
}
.loginout {
  height: 39px;
  line-height: 39px;
  text-align: center;
  border-bottom: 1px solid rgb(233, 233, 233);
}
.changeavatar:hover,
.loginout:hover {
  background-color: rgb(240, 240, 245);
  cursor: pointer;
}

.denglu {
  float: right;
  margin-right: 90px;
}
.el-dialog .limitTip {
  margin-bottom: 20px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
/* userIndex过渡 */
.userIndex-enter-from,
.userIndex-leave-to {
  opacity: 0;
}
.userIndex-enter-active,
.userIndex-leave-active {
  transition: 0.39s cubic-bezier(0.8, 0.8, 0.8, 0.8);
}
.userIndex-leave-from,
.userIndex-enter-to {
  opacity: 1;
}

.el-upload-list__item-thumbnail {
  position: relative;
}

.closeIt {
  position: absolute;
  right: 5px;
  top: 5px;
  font-size: 12px;
  display: block;
  cursor: pointer;
}
</style>
