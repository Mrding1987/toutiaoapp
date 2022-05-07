<template>
  <van-picker
    title="选择性别"
    show-toolbar
    :columns="columns"
    :default-index="gender"
    @confirm="onConfirmGender"
    @change="onPickerChange"
    @cancel="$emit('pop-close')"
  />
</template>

<script>
import { updateUserProfile } from "@/api/user";
export default {
  name: "GenderRevise",
  model: {
    prop: "gender",
    event: "update-gender",
  },
  props: {
    gender: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      columns: ["男", "女"],
      localGender: this.gender,
    };
  },
  methods: {
    async onConfirmGender() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, // 禁止背景点击
        duration: 0, // 持续展示
      });
      try {
        await updateUserProfile({ gender: this.localGender });
        // 关闭弹出层

        this.$emit("update-gender", this.localGender);

        // 关闭弹层
        this.$emit("pop-close");
        // 提示成功
        this.$toast.success("更新性别成功");
      } catch (err) {
        this.$toast.fail("更新性别失败，请稍后重试");
      }
    },

    onPickerChange(picker, value, index) {
      this.localGender = index;
    },
  },
};
</script>

<style lang="less" scoped>
</style>