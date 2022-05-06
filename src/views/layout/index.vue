<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <router-view></router-view>
    <!-- 子路由出口 -->

    <!-- 底部标签导航栏 -->
    <van-tabbar class="layout-tobbar" v-model="active" route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="chat-o" to="/qa">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/my">{{
        $store.state.user ? "我的" : "未登录"
      }}</van-tabbar-item>
    </van-tabbar>
    <!-- 底部标签导航栏 -->
  </div>
</template>

<script>
export default {
  name: "LayoutIndex",
  data() {
    return {
      active: 0,
    };
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.layout-container {
  .layout-tobbar {
    .van-tabbar-item_icon {
      width: 40px;
      height: 40px;
    }
    .van-tabbar-item_text {
      font-size: 20px;
    }
  }
}
</style>