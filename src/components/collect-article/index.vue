<template>
  <div class="collect-article-container">
    <van-button
      :icon="is_collected ? 'star' : 'star-o'"
      :class="{ collected: is_collected }"
      :loading="collectLoading"
      @click="onCollectArticle"
    />
  </div>
</template>

<script>
import { collectArticles, cancelArticleCollect } from "@/api/article";
export default {
  name: "CollectArticle",
  model: {
    prop: "is_collected",
    event: "update-is_collected",
  },
  props: {
    is_collected: {
      type: Boolean,
      required: true,
    },
    art_id: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      collectLoading: false,
    };
  },
  methods: {
    async onCollectArticle() {
      this.collectLoading = true;
      try {
        if (this.is_collected) {
          await cancelArticleCollect(this.art_id);
        } else {
          await collectArticles(this.art_id);
        }
        this.is_collected = !this.is_collected;
        this.$emit("update-is_collected", this.is_collected);
        this.$toast.success(this.is_collected ? "收藏成功" : "取消收藏成功");
      } catch (err) {
        let message = "操作失败，请稍后重试";
        this.$toast.fail(message);
      }
      this.collectLoading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.collect-article-container {
  .van-button--default {
    border: none;
  }
  .collected {
    .van-icon-star {
      color: #ffa500;
    }
  }
}
</style>