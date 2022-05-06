<template>
  <div class="search-suggest-container">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template> 

<script>
import { getSearchSuggest } from "@/api/search";
import { debounce } from "lodash";
export default {
  name: "SearchSuggest",
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      suggestions: [],
    };
  },
  // 以下侦听器，用于侦听搜索关键词的变化，一旦发生变化就会调用handler函数
  watch: {
    searchText: {
      handler: debounce(function (value) {
        this.loadSearchSuggest(value);
      }, 200),

      immediate: true,
    },
  },
  methods: {
    async loadSearchSuggest(q) {
      try {
        const { data } = await getSearchSuggest(q);
        this.suggestions = data.data.options;
      } catch (err) {
        this.$toast("获取搜索建议失败，请稍后重试");
      }
    },

    highlight(text) {
      if (!text) return;
      const highlightStr = `<span style="color: #3296fa">${this.searchText}</span>`;
      const reg = new RegExp(this.searchText, "gi");
      return text.replace(reg, highlightStr);
    },
  },
};
</script>

<style>
</style>