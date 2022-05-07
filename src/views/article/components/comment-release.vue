<template>
  <div class="comment-release">
    <van-field
      class="post-field"
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button
      class="post-btn"
      @click="postComment"
      :disabled="!message.length"
      >发布</van-button
    >
  </div>
</template>

<script>
import { postComment } from "@/api/comment";
export default {
  name: "CommentRelease",
  props: {
    art_id: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async postComment() {
      this.$toast.loading({
        message: "发布中...",
        forbidClick: true, //禁用背景点击
        duration: 0, //设为0表示持续展示加载中的提示，直到下面代码调用新的toast调用
      });
      try {
        const { data } = await postComment({
          target: this.art_id,
          content: this.message,
        });

        // 关闭弹出层,要到父组件中去关闭
        // 将发布内容显示到评论列表顶部，需要先传数据到父组件，然后再从父组件传数据给另一个子组件去渲染
        this.$emit("post-success", data.data);
        // 清空文本框
        this.message = "";
        this.$toast.success("发布评论成功！");
      } catch (err) {
        this.$toast.fail("发布评论失败，请稍后重试");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.comment-release {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>