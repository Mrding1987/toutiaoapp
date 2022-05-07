<template>
  <van-datetime-picker
    v-model="currentDate"
    type="date"
    title="选择出生日期"
    :min-date="minDate"
    :max-date="maxDate"
    @cancel="$emit('pop-close')"
    @confirm="onConfirmBirthday"
  />
</template>

<script>
import { updateUserProfile } from "@/api/user";
import dayjs from "dayjs";
export default {
  name: "BirthdayRevise",
  model: {
    prop: "birthday",
    event: "update-birthday",
  },
  props: {
    birthday: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      minDate: new Date(1960, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.birthday),
    };
  },
  methods: {
    async onConfirmBirthday() {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, // 禁止背景点击
        duration: 0, // 持续展示
      });
      try {
        await updateUserProfile({
          birthday: dayjs(this.currentDate).format("YYYY-MM-DD"),
        });
        // 关闭弹出层

        this.$emit(
          "update-birthday",
          dayjs(this.currentDate).format("YYYY-MM-DD")
        );

        // 关闭弹层
        this.$emit("pop-close");
        // 提示成功
        this.$toast.success("更新生日成功");
      } catch (err) {
        this.$toast.fail("更新生日失败，请稍后重试");
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>