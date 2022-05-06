<template>
  <div class="login-container">
    <van-nav-bar title="注册/登录" class="page-nav-bar">
      <template #left>
        <van-icon
          name="cross"
          size="18"
          color="white"
          @click="$router.back()"
        />
      </template>
    </van-nav-bar>

    <van-form ref="loginForm" @submit="onSubmit">
      <van-field
        name="mobile"
        v-model="user.mobile"
        placeholder="请输入手机号"
        left-icon="phone-o"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      />
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        left-icon="bag-o"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <template #button>
          <van-count-down
            v-if="isCountDownShow"
            :time="time"
            format="ss 秒"
            @finish="isCountDownShow = false"
          />
          <!-- native-type设为button可以防止点击这个按钮时发生提交表单的行为；该组件默认会提交表单，
          但是我们不需要提交表单，只想单纯的实现发送验证码的功能 -->
          <van-button
            v-else
            class="send-sms-btn"
            size="small"
            type="default"
            round
            native-type="button"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
//按需导入uer.js中的login请求模块
import { login } from "@/api/user";
export default {
  name: "loginIndex",
  data() {
    return {
      user: {
        mobile: "",
        code: "",
      },
      isCountDownShow: false,
      time: 30 * 1000,
      userFormRules: {
        mobile: [
          {
            required: true,
            message: "请填写手机号",
          },
          {
            pattern: /^1[3|5|7|8|9]\d{9}$/,
            message: "手机号格式错误",
          },
        ],
        code: [
          {
            required: true,
            message: "请填写验证码",
          },
          {
            pattern: /^\d{6}$/,
            message: "验证码格式错误",
          },
        ],
      },
    };
  },
  methods: {
    async onSubmit() {
      // 1.获取表单数据：使用v-model获取
      const user = this.user;

      // 2.表单验证:在van-field标签里的属性rules中设置
      // 在组件中必须通过this.$toast来调用Toast组件
      this.$toast.loading({
        message: "登陆加载中...",
        forbidClick: true, //禁用背景点击
        duration: 0, //设为0表示持续展示加载中的提示，直到下面代码调用新的toast调用
      });

      // 3.提交表单请求登录

      // 当点击登录按钮之后，要将‘发送验证码’的按钮显示出来，将倒计时组件隐藏
      this.isCountDownShow = false;
      try {
        const res = await login(this.user);
        this.$store.commit("setUser", res.data.data);
        this.$toast.success("登陆成功");
        //登录成功之后，跳转到‘我的’页面
        this.$router.push("/my");
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail("手机号或者验证码错误");
        } else {
          this.$toast.fail("登陆失败，请稍后重试");
        }
      }

      // 4.根据响应结果处理后续操作
    },
    async onSendSms() {
      // 1.校验手机号码：使用vant中form表单的validate方法
      try {
        await this.$refs.loginForm.validate("mobile");
      } catch (err) {
        return console.log("验证失败", err);
      }

      // 2.校验通过后，显示倒计时
      this.isCountDownShow = true;
      // 3.请求发送验证码:后台接口失效，无法实现该功能，需要掌握更多只是后再补充
    },
  },
};
</script>

<style lang='less' scoped>
.login-container {
  .send-sms-btn {
    background-color: #ededed;
    width: 168px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>