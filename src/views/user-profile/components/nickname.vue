<template>
  <div class="nickname-container">
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('pop-close')"
      @click-right="confirmNickname"
    />

    <van-field
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="10"
      placeholder="请输入留言"
      show-word-limit
      clearable
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
export default {
  name: "NickName",
  model: {
    prop: "nickname",
    event: "update-name",
  },
  props: {
    nickname: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      message: this.nickname,
    };
  },
  methods: {
    async confirmNickname() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, // 禁止背景点击
        duration: 0, // 持续展示
      });
      try {
        if (!this.message.length) {
          this.$toast("昵称不能为空");
          return;
        }
        await updateUserProfile({ name: this.message });
        // 关闭弹出层
        // 清空已填内容

        this.$emit("update-name", this.message);

        // 关闭弹层
        this.$emit("pop-close");
        // 提示成功
        this.$toast.success("更新昵称成功");
      } catch (err) {
        this.$toast.fail("更新昵称失败，请稍后重试");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.nickname-container {
  /deep/.van-field__control {
    border: 1px dotted #358fb0;
    padding: 20px;
  }
}
</style>