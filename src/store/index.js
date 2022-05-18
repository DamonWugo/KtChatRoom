// 创建一个store实例
import { createStore } from "vuex";
//引入useWebsocket
// import useWebsocket from "../hooks/index";
//模块化vuex
//注册
const registerAbout = {
  namespaced: true, //开启命名空间
  state: {},
  mutations: {},
  actions: {},
  getters: {},
};

//登录
const loginAbout = {
  namespaced: true, //开启命名空间
  state: {
    islogined: localStorage.getItem("account"),
  },
  mutations: {
    TOLOGIN(state, value) {
      state.islogined = value;
    },
  },
  actions: {
    tologin(context, value) {
      context.commit("TOLOGIN", value);
    },
  },
  getters: {},
};

//发送消息
const msgAbout = {
  namespaced: true, //开启命名空间
  state: {
    messages: null,
  },
  mutations: {
    MESSAGES(state, value) {
      if (state.messages !== null && state.messages.length !== 0) {
        console.log("是有");

        state.messages.push(value[value.length - 1]);
      } else {
        console.log("没有有");

        state.messages = value;
      }
    },
    CLEARMSG(state) {
      console.log("这里执行了！！！");
      state.messages = null;
    },
  },
  actions: {
    messages(context, value) {
      context.commit("MESSAGES", value);
    },
    clearmsg(context) {
      context.commit("CLEARMSG");
    },
  },
  getters: {},
};

//撤回消息
const withdrawAbout = {
  namespaced: true, //开启命名空间
  state: {
    withdrawMsg: [],
  },
  mutations: {
    WITHDRAWMSG(state, value) {
      state.withdrawMsg.push(value);
    },
  },
  actions: {
    withdrawmsg(context, value) {
      context.commit("WITHDRAWMSG", value);
    },
  },
  getters: {},
};

//当前聊天对象
const currentFriend = {
  namespaced: true, //开启命名空间
  state: {
    currentObj: "",
  },
  mutations: {
    CURRENTOBJ(state, value) {
      state.currentObj = value;
    },
  },
  actions: {
    currentObj(context, value) {
      context.commit("CURRENTOBJ", value);
    },
  },
  getters: {},
};

//个人的信息
const myselfAbout = {
  namespaced: true, //开启命名空间
  state: {
    avatar: "",
  },
  mutations: {
    MYSELF(state, value) {
      state.avatar = value;
    },
  },
  actions: {
    myself(context, value) {
      context.commit("MYSELF", value);
    },
  },
  getters: {},
};

const store = createStore({
  modules: {
    registerAbout, //注册模块
    loginAbout, //登录
    msgAbout, //消息
    currentFriend, //当前聊天对象
    myselfAbout,
    withdrawAbout,
  },
});

//暴露出去
export default store;
