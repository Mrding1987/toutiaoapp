<template>
  <div class="like-article-container">
    <van-button
      :icon="attitude === 1 ? 'good-job' : 'good-job-o'"
      :class="{ liked: attitude === 1 }"
      :loading="likeLoading"
      @click="onLikeArticle"
    />
  </div>
</template>

<script>
import { likeArticles, cancelArticleLike } from "@/api/article";
export default {
  name: "LikeArticle",
  model: {
    prop: "attitude",
    event: "update-is_liked",
  },
  props: {
    attitude: {
      type: Number,
      required: true,
    },
    art_id: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      likeLoading: false,
    };
  },
  methods: {
    async onLikeArticle() {
      this.likeLoading = true;
      try {
        if (this.attitude === 1) {
          await cancelArticleLike(this.art_id);
          this.attitude = 0;
        } else {
          await likeArticles(this.art_id);
          this.attitude = 1;
        }

        this.$emit("update-is_liked", this.attitude);
        this.$toast.success(this.attitude === 1 ? "点赞成功" : "取消点赞成功");
      } catch (err) {
        let message = "操作失败，请稍后重试";
        this.$toast.fail(message);
      }
      this.likeLoading = false;
    },
  },
};
</script>

<style lang="less" scoped>
.like-article-container {
  .van-button--default {
    border: none;
  }
  .liked {
    .van-icon {
      color: #ffa500;
    }
  }
}
</style>