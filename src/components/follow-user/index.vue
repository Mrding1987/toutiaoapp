<template>
  <van-button
    v-if="!is_followed"
    class="follow-btn"
    type="info"
    color="#3296fa"
    round
    :loading="followLoading"
    size="small"
    icon="plus"
    @click="onFollow"
    >关注</van-button
  >
  <van-button
    v-else
    class="follow-btn"
    round
    :loading="followLoading"
    size="small"
    @click="cancelFollow"
    >已关注</van-button
  >
</template>

<script>
import { followAuthors, cancelFollow } from "@/api/user";
export default {
  neme: "FollowUser",
  props: {
    is_followed: {
      type: Boolean,
      required: true,
    },
    user_id: {
      type: [String, Number, Object],
      required: true,
    },
  },
  data() {
    return {
      followLoading: false,
    };
  },
  methods: {
    async onFollow() {
      this.followLoading = true;
      try {
        await followAuthors(this.user_id);
        this.is_followed = true;
        this.$emit("update-is_followed", this.is_followed);
      } catch (err) {
        this.$toast("操作失败，请稍后重试");
      }
      this.followLoading = false;
    },

    async cancelFollow() {
      this.followLoading = true;
      try {
        await cancelFollow(this.user_id);
        this.is_followed = false;
        this.$emit("update-is_followed", this.is_followed);
      } catch (err) {
        let message = "操作失败，请稍后重试";
        if (err.response && err.response.status === 400) {
          message = "用户不能关注自己";
        }
        this.$toast(message);
      }
      this.followLoading = false;
    },
  },
};
</script>

<style>
</style>