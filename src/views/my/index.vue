<template>
  <div class="my-container">
    <div class="header beforeLogin" v-if="!user">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile" src="../../assets/image/phone.jpg" />
        <span class="text">登录/注册</span>
      </div>
    </div>
    <div class="header afterLogin" v-else>
      <div class="base-info">
        <div class="left">
          <van-image class="avatar" round fit="cover" :src="userInfo.photo" />
          <span class="text">黑马头条号</span>
        </div>
        <div class="right">
          <van-button round size="mini" type="default" to="/userprofile"
            >编辑资料</van-button
          >
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="name">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="name">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="name">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="name">获赞</span>
        </div>
      </div>
    </div>
    <div class="navi">
      <van-grid :column-num="2" clickable>
        <van-grid-item
          class="grid"
          icon="star"
          style="color: cyan"
          text="收藏"
        />
        <van-grid-item
          class="grid"
          icon="clock"
          style="color: skyblue"
          text="历史"
        />
      </van-grid>
    </div>
    <van-cell title="消息通知" is-link />
    <van-cell class="mb-9" title="小智同学" is-link />
    <van-cell
      class="logout-cell"
      v-if="user"
      title="退出登录"
      clickable
      @click="logout"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getUserInfo } from "@/api/user";

export default {
  name: "MyIndex",
  data() {
    return {
      userInfo: {},
    };
  },
  methods: {
    logout() {
      // 弹出对话框，提示是否退出
      this.$dialog
        .confirm({
          title: "是否确认退出？",
        })
        .then(() => {
          // 如果确认退出，则清除登录状态，包括vuex和本地存储中的登录状态
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          // on cancel
          console.log("取消退出操作");
        });
    },
    async loadUserInfo() {
      try {
        const { data } = await getUserInfo();
        console.log(data);
        this.userInfo = data.data;
      } catch (err) {
        this.$toast("获取用户数据失败，请稍后重试");
      }
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    // 如果用户登录了，则才会请求加载用户信息数据
    if (this.user) this.loadUserInfo();
  },
};
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url("../../assets/image/LoginBackground.jpg");
    background-size: cover;
  }
  .beforeLogin {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 15px;
      .mobile {
        width: 132px;
        height: 132px;
        border-radius: 50%;
        background-color: rgb(229, 161, 161);
      }
      .text {
        font-size: 28px;
        color: rgb(152, 142, 142);
      }
    }
  }
  .afterLogin {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .base-info {
      box-sizing: border-box;
      width: 100%;
      height: 231px;
      padding: 76px 32px 23px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: 4px solid #fff;
        }

        .text {
          font-size: 30px;
          color: rgb(109, 104, 104);
        }
      }
    }
    .data-stats {
      box-sizing: border-box;
      width: 100%;
      height: 130px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .data-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: rgb(99, 89, 89);
        .count {
          font-size: 36px;
        }

        .name {
          font-size: 23px;
        }
      }
    }
  }
  .navi {
    box-sizing: border-box;
    margin-bottom: 5px;
    .van-grid-item {
      height: 141px;
    }
  }

  .logout-cell {
    text-align: center;
    color: red;
    margin-top: 5px;
  }
}
</style>