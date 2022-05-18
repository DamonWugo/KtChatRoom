import { createApp } from "vue";
import App from "./App.vue";
import axios from "axios";
axios.defaults.withCredentials = true;
//引入Element
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

//引入路由器
import router from "./router/index.js";
//引入store
import store from "../src/store/index";

//引入
import VueContextMenu from "vue-contextmenu";

//创建app
const app = createApp(App);

//使用插件UI
app.use(ElementPlus);

app.use(router);
app.use(store);
axios.defaults.baseURL = "http://localhost:8888";

app.use(VueContextMenu);

app.mount("#app");
