<template>
  <div class="user-profile">
    <van-nav-bar
      class="topnav"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 以下为FILE类型的文本框，用于选择照片，因为不好看，所以加上hidden属性，让该文本框隐藏 -->
    <input type="file" hidden ref="file" @change="onFileChange" />
    <!-- 以下为4个修改模块 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image class="avatar" fit="cover" :src="userInfo.photo" round />
    </van-cell>
    <van-cell
      title="昵称"
      is-link
      :value="userInfo.name"
      @click="isReviseNickNameShow = true"
    />
    <van-cell
      title="性别"
      is-link
      :value="userInfo.gender === 1 ? '女' : '男'"
      @click="isReviseGenderShow = true"
    />
    <van-cell
      title="生日"
      is-link
      :value="userInfo.birthday"
      @click="isReviseBirthdayShow = true"
    />

    <!-- 头像弹出层 -->
    <van-popup
      v-model="isReviseAvatarShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <avatar-revise
        v-if="isReviseAvatarShow"
        @pop-close="isReviseAvatarShow = false"
        :avatar="avatar"
        @update-avatar="userInfo.photo = $event"
      ></avatar-revise>
    </van-popup>

    <!-- 昵称弹出层 -->
    <van-popup
      v-model="isReviseNickNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <nick-name
        v-if="isReviseNickNameShow"
        @pop-close="isReviseNickNameShow = false"
        v-model="userInfo.name"
      ></nick-name>
    </van-popup>
    <!-- 性别弹出层 -->
    <van-popup v-model="isReviseGenderShow" position="bottom">
      <gender-revise
        v-if="isReviseGenderShow"
        @pop-close="isReviseGenderShow = false"
        v-model="userInfo.gender"
      ></gender-revise>
    </van-popup>

    <!-- 生日弹出层 -->
    <van-popup v-model="isReviseBirthdayShow" position="bottom">
      <birthday-revise
        v-if="isReviseBirthdayShow"
        @pop-close="isReviseBirthdayShow = false"
        v-model="userInfo.birthday"
      ></birthday-revise>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import AvatarRevise from "@/views/user-profile/components/avatar.vue";
import NickName from "@/views/user-profile/components/nickname.vue";
import GenderRevise from "@/views/user-profile/components/gender.vue";
import BirthdayRevise from "@/views/user-profile/components/birthday.vue";
export default {
  name: "UserProfile",
  props: {},
  components: {
    AvatarRevise,
    NickName,
    GenderRevise,
    BirthdayRevise,
  },
  data() {
    return {
      userInfo: {},
      isReviseAvatarShow: false,
      isReviseNickNameShow: false,
      isReviseGenderShow: false,
      isReviseBirthdayShow: false,
      avatar: null,
    };
  },
  created() {
    this.loadUserProfile();
  },
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile();
        this.userInfo = data.data;
      } catch (err) {
        this.$toast.fail("获取信息失败，请稍后重试");
      }
    },

    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0];
      // 基于文件对象获取blob数据
      const data = window.URL.createObjectURL(file);
      this.avatar = data;
      this.isReviseAvatarShow = true;

      // file选择框如果下次选了同一个文件，就不会触发表单的change事件，从而导致不显示图片
      // 解决方案：每次使用完毕一个文件，将其value清空
      this.$refs.file.value = "";
    },
  },
};
</script>

<style lang="less" scoped>
.user-profile {
  /deep/.topnav {
    background-color: #3296fa;
    .van-icon {
      color: #fff;
    }
    .van-nav-bar__title {
      color: #fff;
      font-size: 28px;
    }
    .van-nav-bar__text {
      color: #fff;
    }
  }
  .avatar {
    height: 60px;
    width: 60px;
  }
  .van-cell {
    align-items: center;
  }
  .van-cell__value {
    display: flex;
    justify-content: flex-end;
  }
}
</style>