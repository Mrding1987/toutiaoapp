<template>
  <div class="home-container">
    <!-- 导航栏开始 -->
    <van-nav-bar class="titlebar">
      <template #title>
        <router-link to="/search">
          <input class="search" type="text" value="搜索" /><van-icon
            name="search"
            class="search-icon"
          />
        </router-link>
      </template>
    </van-nav-bar>
    <!-- 导航栏结束 -->

    <!-- 频道列表开始 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab
        v-for="channel in channels"
        :key="channel.id"
        :title="channel.name"
      >
        <article-list :channel="channel"></article-list>
      </van-tab>

      <!-- 占位符：当频道被滑动到最右侧时，为了使频道列表的按钮不挡住最后一个频道名称，需要一个与频道列表按钮相同大小的div来实现 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 以下div为频道列表的按钮 -->
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChannelEditShow = true"
      >
        <i class="iconfont icon-fenlei"></i>
      </div>
    </van-tabs>
    <!-- 频道列表结束 -->

    <!-- 频道编辑弹出层开始 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :my-channels="channels"
        :active="active"
        @update-active="onUpdateActive"
      ></channel-edit>
    </van-popup>
    <!-- 频道编辑弹出层结束 -->
  </div>
</template>

<script>
import { getUserChannels } from "@/api/user";
import ArticleList from "@/components/article-list";
import ChannelEdit from "@/components/channel-edit";
import { mapState } from "vuex";
import { getItem } from "@/utils/storage";

export default {
  components: {
    ArticleList,
    ChannelEdit,
  },
  data() {
    return {
      active: 0,
      channels: [], //频道列表
      isChannelEditShow: false, //控制是否显示频道列表弹出层，false为不显示
    };
  },
  methods: {
    async loadChannels() {
      try {
        // 判断用户是否登录，如果登录，则显示用户自己后台存储的频道列表；如果未登录，则显示本地存储中的频道列表；如果没有本地存储，则显示默认的频道列表
        if (this.user) {
          const { data } = await getUserChannels();
          this.channels = data.data.channels;
        } else {
          if (getItem("TOUTIAN_CHANNELS")) {
            this.channels = getItem("TOUTIAN_CHANNELS");
          } else {
            //下面这次请求是在不登录的情况下请求，返回的结果是默认的频道列表
            const { data } = await getUserChannels();
            this.channels = data.data.channels;
          }
        }
      } catch (err) {
        this.$toast("获取频道列表数据失败");
      }
    },
    onUpdateActive(val, isChannelEditShow = true) {
      this.active = val;
      this.isChannelEditShow = isChannelEditShow;
    },
  },
  created() {
    this.loadChannels();
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style lang="less" scoped>
.home-container {
  padding-bottom: 100px;
  /deep/ .titlebar {
    width: 100%;
    background-color: #3296fa;
    position: fixed;
    .van-nav-bar__title {
      max-width: unset;
      position: relative;
    }
    .search {
      border: none;
      border-radius: 32px;
      text-align: center;
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      color: #fff;
      font-size: 28px;
    }
    .search-icon {
      position: absolute;
      left: 316px;
      top: 20px;
      font-size: 36px;
      color: #fff;
    }
  }

  /deep/ .channel-tabs {
    padding-top: 174px;
    .van-tabs__nav--complete {
      padding-right: 0;
      padding-left: 0;
    }

    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      font-size: 30px;
      color: #777;
    }

    .van-tab--active {
      color: #333;
    }
    .van-tabs-nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
      margin-bottom: 8px;
    }
    .placeholder {
      width: 66px;
      height: 82px;
      flex-shrink: 0; //不参与flex布局的空间计算
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      line-height: 75px;
      text-align: center;
      background-color: #fff;
      opacity: 0.902;
      .icon-fenlei {
        font-size: 33px;
      }
    }
  }
}
</style>