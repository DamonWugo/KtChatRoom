<template>
  <el-form>
    <div class="userregister">
      <div class="box-title">注册账号</div>
      <!-- 用户名 -->
      <div id="user-name">
        <span>用户名:</span>
        <input
          type="text"
          v-model="registeParam.account"
          placeholder="请输入用户名"
          @blur="accountBlur"
          @keydown.enter.prevent="register"
        />
        <div class="accountTip" v-if="accountIsTrue">请输入6-18位的用户名</div>
      </div>
      <!-- 密码 -->
      <div id="user-password">
        <span>密&nbsp;&nbsp;&nbsp;码:</span>

        <input
          type="password"
          v-model="registeParam.password"
          placeholder="请输入密码"
          @blur="passwordBlur"
          @keydown.enter.prevent="register"
        />
        <div class="passwordTip" v-if="passwordIsTrue">
          请输入6-18位密码(字母,数字以及_.)
        </div>
      </div>
      <!-- 验证码 -->
      <div id="captcha">
        <span>验证码:</span>
        <input
          type="text"
          v-model="captcha"
          placeholder="验证码"
          @keydown.enter.prevent="register"
        />
        <el-button type="warning" round class="getcaptcha" @click="getCaptcha()"
          >获取验证码</el-button
        >
        <div class="yanzhengma">
          <img :src="captchaURL" alt="" />
        </div>
        <span class="changeyzm" @click="getCaptcha">看不清换一张</span>
      </div>
      <!-- 注册按钮 -->
      <el-button type="primary" class="register" @click="register"
        >注&nbsp;&nbsp;&nbsp;册</el-button
      >
    </div>
  </el-form>
</template>

<script>
import { ElMessage } from "element-plus";

import router from "../router/index";
import { onMounted, reactive, ref } from "vue";
import axios from "axios";
// import { response } from "express";
export default {
  name: "UserRegister",
  setup() {
    //数据***********************************************************************************************************************************
    let registeParam = reactive({
      account: "",
      password: "",
    });
    let captcha = ref("");
    //验证码路径
    let captchaURL = ref("");
    let accountIsTrue = ref(false);
    let passwordIsTrue = ref(false);
    //方法************************************************************************************************************************************

    //获取验证码
    function getCaptcha() {
      axios({
        method: "GET",
        url: "blog/getCaptcha",
      })
        .then((response) => {
          console.log(response);
          captchaURL.value = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    }
    //注册
    function register() {
      //判断是否有空格为空，如果有，提示无法注册
      if (
        registeParam.account.trim() === "" ||
        registeParam.password.trim() === "" ||
        captcha.value.trim() === ""
      ) {
        alert("请把注册信息全部填写");
      } else if (accountIsTrue.value) {
        alert("请输入正确的用户名");
      } else if (passwordIsTrue.value) {
        alert("请输入正确的密码");
      } else {
        axios({
          method: "POST",
          url: `blog/regist/${captcha.value}`,

          //请求体参数
          data: {
            account: registeParam.account,
            password: registeParam.password,
          },
          credentials: "include",
        }).then((response) => {
          console.log(response);
          if (response.status === 200) {
            if (response.data === "ok") {
              //登陆成功
              router.push("/login");
            }
          } else if (response.data === "验证码错误") {
            ElMessage({
              message: "验证码错误",
              type: "error",
            });
            return;
          }
        });
      }
    }
    //用户名验证
    function accountBlur() {
      let accountTest = /^[a-zA-Z0-9._]{6,18}$/;
      if (accountTest.test(registeParam.account)) {
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
      if (passwordTest.test(registeParam.password)) {
        console.log("符合验证规则");
        passwordIsTrue.value = false;
      } else {
        console.log("不符合验证规则");
        passwordIsTrue.value = true;
      }
    }

    onMounted(() => {
      getCaptcha();
    });

    return {
      registeParam,
      captcha,
      captchaURL,
      accountIsTrue,
      passwordIsTrue,
      register,
      getCaptcha,
      accountBlur,
      passwordBlur,
    };
  },
};
</script>

<style scoped>
.userregister {
  margin: 5% auto;
  padding: 24px 40px;
  width: 400px;
  height: 366px;
  border-radius: 8px;
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
#user-password,
#captcha {
  /* width: 200px; */
  height: 50px;
  color: #000000;
  font-size: 18px;
  margin-bottom: 5px;
}
#user-name span {
  margin-right: 15px;
}
#user-password span {
  margin-right: 17px;
}
#captcha span {
  margin-right: 15px;
}
input {
  width: 245px;
  height: 32px;
  padding: 0 10px;
  /* border: none; */
  border: 1px solid #ccc;
  font-size: 16px;
  outline: none;
}

#captcha input {
  width: 119px;
}
#user-name input:focus {
  border-color: rgb(28, 223, 28);
}
#user-password input:focus {
  border-color: rgb(28, 223, 28);
}
#captcha input:focus {
  border-color: rgb(28, 223, 28);
}
.yanzhengma {
  width: 118px;
  height: 40px;
  margin-top: 13px;
  margin-left: 73px;
}
.yanzhengma img {
  width: 100%;
  height: 100%;
}

#captcha {
  position: relative;
}
.getcaptcha {
  position: absolute;
  top: 0px;
  left: 206px;
  width: 118px;
  height: 30px;
  border: none;
  background-color: #409eff;
}
.changeyzm {
  position: absolute;
  width: 110px;
  height: 40px;
  line-height: 38px;
  text-align: center;
  top: 45px;
  right: -13px;
  font-size: 14px;
  background-color: rgb(255, 255, 255);
  color: #409eff;
  border: 1px solid #409eff;
  border-radius: 8px;
  cursor: pointer;
}
.register {
  width: 320px;
  height: 40px;
  font-size: 18px;
  margin-top: 40px;
}
.accountTip,
.passwordTip {
  margin-left: 73px;
  font-size: 12px;
  color: #409eff;
  height: 20px;
  line-height: 20px;
}
</style>
