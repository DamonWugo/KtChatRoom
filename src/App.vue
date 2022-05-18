<template>
  <NavigationBar></NavigationBar>
</template>

<script>
//引入组件

import NavigationBar from "./components/NavigationBar.vue";

export default {
  name: "App",
  components: {
    NavigationBar,
  },
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
li {
  list-style: none;
}
a {
  text-decoration: none; /*去掉a标签下划线*/
}
</style>
