<template>
  <div class="userlogin">
    <div class="box-title">登录账号</div>

    <div id="user-name">
      用户名:
      <input
        type="text"
        v-model="loginParam.account"
        placeholder="请输入用户名"
        @blur="accountBlur"
        @keydown.enter.prevent="login"
      />
      <div class="accountTip" v-if="accountIsTrue">请输入6-18位的用户名</div>
    </div>

    <div id="user-password">
      密&nbsp;&nbsp;&nbsp;码:
      <input
        type="password"
        v-model="loginParam.password"
        placeholder="请输入密码"
        @blur="passwordBlur"
        @keydown.enter.prevent="login"
      />
      <div class="passwordTip" v-if="passwordIsTrue">
        请输入6-18位密码(字母,数字以及_.)
      </div>
    </div>

    <el-button type="primary" @click="login">登&nbsp;&nbsp;&nbsp;录</el-button>
  </div>
</template>

<script>
// import { nanoid } from "nanoid";
// import store from "../store";
import router from "../router/index";
import { reactive, ref, onMounted } from "vue";
import axios from "axios";

// import axios from "axios";
export default {
  name: "UserLogin",
  setup() {
    //数据
    let loginParam = reactive({
      account: "",
      password: "",
    });
    let accountIsTrue = ref(false);
    let passwordIsTrue = ref(false);
    onMounted(() => {
      loginParam.account = localStorage.getItem("account");
      // console.log(loginParam.account);
      if (loginParam.account) {
        router.push("/chatroom");
        return;
      }
    });
    //方法
    //用户名验证
    function accountBlur() {
      let accountTest = /^[a-zA-Z0-9._]{6,18}$/;
      if (accountTest.test(loginParam.account)) {
        console.log("符合验证规则");
        accountIsTrue.value = false;
      } else {
        console.log("不符合验证规则");
        accountIsTrue.value = true;
      }
    }

    //密码验证
    function passwordBlur() {
      let passwordTest = /^[a-zA-Z0-9._]{6,18}$/;
      if (passwordTest.test(loginParam.password)) {
        console.log("符合验证规则");
        passwordIsTrue.value = false;
      } else {
        console.log("不符合验证规则");
        passwordIsTrue.value = true;
      }
    }
    function login() {
      if (
        loginParam.account.trim() === "" ||
        loginParam.password.trim() === ""
      ) {
        alert("请把注册信息全部填写");
      } else if (accountIsTrue.value) {
        alert("请输入正确的用户名");
      } else if (passwordIsTrue.value) {
        alert("请输入正确的密码");
      } else {
        axios({
          method: "POST",
          url: "blog/login",
          data: {
            account: loginParam.account,
            password: loginParam.password,
          },
        })
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              //成功登录，就把用户名存到本地
              const _account = loginParam.account;
              localStorage.setItem("account", _account);
              localStorage.removeItem("re1fresh");
              //清空输入框
              loginParam.account = "";
              loginParam.password = "";
              //然后跳转到聊天室页面
              router.push("/chatroom");
            } else if (response.status === 203) {
              alert("账号或密码错误");
              return;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }

    return {
      accountIsTrue,
      passwordIsTrue,
      loginParam,
      accountBlur,
      passwordBlur,
      login,
    };
  },
};
</script>

<style scoped>
.userlogin {
  margin: 5% auto;
  padding: 27px 60px;
  width: 500px;
  height: 300px;
  border-radius: 30px;
  box-shadow: 1px 1px 11px rgb(150, 150, 150);

  background-color: #fff;
}
.box-title {
  font-size: 20px;
  color: #000000;
  line-height: 28px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}
#user-name,
#user-password {
  /* width: 200px; */
  height: 50px;
  margin-left: 20px;
  margin-bottom: 20px;
  color: rgb(126, 126, 126);
  font-size: 18px;
}
input {
  width: 260px;
  height: 39px;
  padding: 0 10px;
  border: 1px solid #ccc;
  font-size: 16px;
  outline: none;
}
.el-button {
  width: 150px;
  height: 40px;
  margin-left: 115px;
  font-size: 18px;
}
.accountTip,
.passwordTip {
  margin-left: 73px;
  font-size: 12px;
  color: #f5483b;
  height: 20px;
  line-height: 20px;
}
</style>
