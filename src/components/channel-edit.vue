<template>
  <div class="channel-edit">
    <!-- 我的频道模块开始 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        round
        plain
        type="danger"
        size="mini"
        @click="editValueChange"
        >{{ editBtnValue === "clear" ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid class="mygrid" :column-num="4" :gutter="10">
      <van-grid-item
        class="grid-item"
        :icon="fixedChannels.includes(channel.id) ? '' : editBtnValue"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <span slot="text" class="text" :class="{ active: index === active }">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>
    <!-- 我的频道模块结束 -->

    <!-- 频道推荐模块开始 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recgrid" :column-num="4" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        icon="plus"
        @click="addMyChannels(channel)"
      />
    </van-grid>
    <!-- 频道推荐模块结束 -->
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannels,
  deleteUserChannels,
} from "@/api/channel";
import { mapState } from "vuex";
import { setItem } from "@/utils/storage";
export default {
  name: "ChannelEdit",
  data() {
    return {
      editBtnValue: "",
      allChannels: [],
      fixedChannels: [0],
    };
  },
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels();
        this.allChannels = data.data.channels;
      } catch (err) {
        this.$toast("获取全部频道失败");
      }
    },

    editValueChange() {
      this.editBtnValue = this.editBtnValue === "clear" ? "" : "clear";
    },

    async addMyChannels(channel) {
      this.myChannels.push(channel);

      // 数据要进行持久化处理，负责一刷新页面，数据就会丢失
      // 持久化分为两种情况：一是未登录状态，需要把数据存储到本地设备上；二是已登录状态，数据要提交到服务器中，无论那台设备都可以同步数据
      if (this.user) {
        // 1.已登录情况下的提交数据至后台服务器
        try {
          await addUserChannels({
            id: channel.id,
            seq: this.myChannels.length,
          });
        } catch (err) {
          this.$toast("添加频道失败，请稍后重试");
        }
      } else {
        // 2.未登录情况下的本地存储
        setItem("TOUTIAN_CHANNELS", this.myChannels);
      }
    },

    onMyChannelClick(channel, index) {
      //该方法用于完成对我的频道的切换和移除功能
      //首先，判断按钮是否处于编辑状态。如果不是编辑状态，则点击频道会导致直接跳转到主页进行切换；如果时编辑状态，则点击会将对应频道移除到频道推荐模块中
      if (this.editBtnValue) {
        //如果是固定频道，不能移除的话，采用以下条件表达式进行判断
        if (this.fixedChannels.includes(channel.id)) {
          return;
        }
        // 处于编辑状态，移除频道
        // 使用数组的删除元素方法splice，有两个参数：1是要删除元素的索引，2是删除的个数
        if (index <= this.active) {
          this.$emit("update-active", this.active - 1, true);
        }
        this.myChannels.splice(index, 1);

        // 处理持久化数据
        this.deleteChannel(channel);
      } else {
        // 处于非编辑状态，切换到首页对应的频道内容
        this.$emit("update-active", index, false);
      }
    },

    async deleteChannel(channel) {
      if (this.user) {
        // 用户已登录
        try {
          await deleteUserChannels(channel.id);
        } catch (err) {
          this.$$toast("操作失败，请稍后重试");
        }
      } else {
        //用户未登录
        setItem("TOUTIAN_CHANNELS", this.myChannels);
      }
    },
  },
  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  created() {
    this.loadAllChannels();
  },
  computed: {
    ...mapState(["user"]),
    recommendChannels() {
      return this.allChannels.filter((channel) => {
        return !this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id;
        });
      });
      /* const channels = [];
      this.allChannels.forEach((channel) => {
        const ret = this.myChannels.find((mychannel) => {
          return mychannel.id === channel.id;
        });
        if (!ret) channels.push(channel);
      });
      return channels; */
    },
  },
};
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  /deep/ .van-cell {
    align-items: center;
    .van-cell__value {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
    }
  }

  /deep/ .recgrid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 8px;
        }
      }
    }
  }

  /deep/ .mygrid {
    .grid-item {
      .van-grid-item__icon {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
}
</style>