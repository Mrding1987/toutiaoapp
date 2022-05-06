<template>
  <div class="search-history-container">
    <van-cell title="历史记录">
      <span
        class="allDelete"
        v-if="isCloseIconShow === true"
        @click="onAllDelete"
        >全部删除</span
      >
      <span
        class="finish"
        v-if="isCloseIconShow === true"
        @click="confirmDelete"
        >完成</span
      >
      <van-icon v-else name="delete" class="delete-icon" @click="deleteClick" />
    </van-cell>
    <van-cell
      v-for="(keyword, index) in historyList"
      :key="index"
      :title="keyword"
      @click="onHistoryClick(keyword)"
    >
      <van-icon
        v-if="isCloseIconShow === true"
        name="close"
        class="close-icon"
      />
    </van-cell>
  </div>
</template>

<script>
import { setItem, getItem } from "@/utils/storage";
export default {
  name: "SearchHistory",
  props: {
    historyList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isCloseIconShow: false,
    };
  },
  methods: {
    onHistoryClick(keyword) {
      if (this.isCloseIconShow) {
        // 在编辑状态下点击，功能为移除历史记录
        this.deleteHistory(keyword);
      } else {
        //在未编辑状态下点击，功能为切换到搜索结果页面，展示搜索结果
        this.moveToSearch(keyword);
      }
    },
    moveToSearch(keyword) {
      this.$emit("search2", keyword);
    },

    deleteHistory(keyword) {
      let index = this.historyList.indexOf(keyword);
      this.historyList.splice(index, 1);
      setItem("HISTORY_KEYWORD", this.historyList);
    },
    deleteClick() {
      this.isCloseIconShow = true;
    },

    onAllDelete() {
      this.historyList.splice(0);
      this.isCloseIconShow = false;
      setItem("HISTORY_KEYWORD", this.historyList);
    },

    confirmDelete() {
      this.isCloseIconShow = false;
    },
  },
};
</script>

<style lang="less" scoped>
.search-history-container {
  .allDelete {
    margin-right: 16px;
    font-size: 28px;
    color: red;
  }
  .finish {
    font-size: 28px;
    color: green;
  }
  .delete-icon {
    font-size: 36px;
    color: rgb(82, 77, 77);
  }
}
</style>