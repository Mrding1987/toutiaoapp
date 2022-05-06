<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isLoading"
      :success-text="refreshSuccessText"
      success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        >
        </article-item>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from "@/api/article";
import ArticleItem from "@/components/article-item";
export default {
  name: "ArticleList",
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  components: {
    ArticleItem,
  },
  data() {
    return {
      list: [],
      loading: false, //控制‘加载中’
      finished: false, //控制‘没有更多了’
      timestamp: null,
      error: false,
      isLoading: false,
      refreshSuccessText: "刷新成功",
    };
  },
  methods: {
    async onLoad() {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: this.timestamp || Date.now(),
          with_top: 1,
        });
        // console.log(data);
        const { results } = data.data;
        this.list.push(...results);

        this.loading = false;

        if (results.length) {
          this.timestamp = data.data.pre_timestamp;
        } else {
          this.finished = true;
        }
      } catch (err) {
        console.log("请求失败", err);
        this.error = true;
        this.loading = false;
      }
    },
    async onRefresh() {
      try {
        // 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id,
          timestamp: Date.now(),
          with_top: 1,
        });

        // 将数据放到文章列表的顶部
        const { results } = data.data;
        this.list.unshift(...results);

        // 关闭下拉刷新的loading状态
        this.isLoading = false;

        // 刷新成功后在页面进行提示
        this.refreshSuccessText = `刷新成功，更新了条${results.length}数据`;
      } catch (err) {
        this.isLoading = false;
        this.refreshSuccessText = "刷新失败";
      }
    },
  },
};
</script>

<style lang="less" scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>