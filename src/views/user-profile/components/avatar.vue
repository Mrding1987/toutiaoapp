<template>
  <div class="update-avatar">
    <img class="img" :src="avatar" ref="img" />
    <div class="toolbar">
      <div class="cancel" @click="$emit('pop-close')">取消</div>
      <div class="finish" @click="onConfirmAvatarRevise">完成</div>
    </div>
  </div>
</template>
<script>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { updateUserAvatar } from "@/api/user";
export default {
  name: "AvatarRevise",
  /* model: {
    prop: "avatar",
    event: "update-avatar",
  }, */
  props: {
    avatar: {
      type: [String, Object],
      required: true,
    },
  },
  data() {
    return {
      cropper: null,
    };
  },
  mounted() {
    const image = this.$refs.img;
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: "move",
      aspectRatio: 1,
      // autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
    });
  },
  methods: {
    onConfirmAvatarRevise() {
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        this.updateAvatar(blob);
      });
    },

    async updateAvatar(blob) {
      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, // 禁止背景点击
        duration: 0, // 持续展示
      });
      try {
        const formData = new FormData();
        formData.append("photo", blob);
        const { data } = await updateUserAvatar(formData);
        console.log(data);
        this.$emit("pop-close");
        this.$emit("update-avatar", data.data.photo);
        this.$toast.success("更新头像成功");
      } catch (err) {
        this.$toast.fail("更新头像失败，请稍后重试");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.update-avatar {
  background-color: black;
  height: 100%;
  .img {
    display: block;
    max-width: 100%;
  }
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .cancel,
    .finish {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
</style>