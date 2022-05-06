<template>
  <div class="search-container">
    <!-- 顶部搜索栏开始 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/" class="searchbar">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>
    <!-- 顶部搜索栏结束 -->

    <!-- 需要实现3个功能：历史记录，搜索建议，搜索结果，使用组件完成 -->

    <search-result v-if="isResultShow" :searchText="searchText"></search-result>
    <search-suggest
      v-else-if="searchText"
      :searchText="searchText"
      @search="onSearch"
    ></search-suggest>
    <search-history
      v-else
      @search2="onSearch"
      :historyList="historyList"
    ></search-history>
  </div>
</template>

<script>
import SearchHistory from "@/views/search/components/search-history.vue";
import SearchResult from "@/views/search/components/search-result.vue";
import SearchSuggest from "@/views/search/components/search-suggest.vue";
import { setItem, getItem } from "@/utils/storage";
export default {
  name: "SearchIndex",
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggest,
  },
  data() {
    return {
      searchText: "",
      isResultShow: false,
      historyList: [],
      historyListLimit: 5,
    };
  },
  methods: {
    onSearch(val) {
      this.searchText = val;
      this.isResultShow = true;
      // 以下代码用于存储搜索关键词的历史纪录，要先判断其中是否有重复项，有重复项则将重复项删除，并把本次的关键词放到数组的最前面
      // 然后，判断数组长度是否超过长度限制，如果超过，则将最后一个元素删除，然后再添加本次关键词到数组最前面；如果没超过长度限制，则直接将元素添加到数组最前面
      if (this.historyList.indexOf(val) !== -1) {
        let index = this.historyList.indexOf(val);
        this.historyList.splice(index, 1);
        this.historyList.unshift(val);
        setItem("HISTORY_KEYWORD", this.historyList);
        return;
      }
      if (this.historyList.length < 5) {
        this.historyList.unshift(val);
      } else {
        this.historyList.splice(this.historyListLimit - 1, 1);
        this.historyList.unshift(val);
      }
      setItem("HISTORY_KEYWORD", this.historyList);
    },
    onCancel() {
      this.$router.back();
    },
  },
  created() {
    this.historyList = getItem("HISTORY_KEYWORD");
  },
};
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  .searchbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
  .van-search__action {
    color: #fff;
  }
}
</style>