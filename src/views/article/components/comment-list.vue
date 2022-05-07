<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error.sync="err"
    error-text="请求失败，点击重新加载"
    @load="onLoad"
  >
    <comment-item
      v-for="(comment, index) in list"
      :key="index"
      :comment="comment"
    ></comment-item>
  </van-list>
</template>

<script>
import { getCommentList } from "@/api/comment";
import CommentItem from "@/views/article/components/comment-item.vue";
export default {
  name: "CommentList",
  components: {
    CommentItem,
  },
  props: {
    art_id: {
      type: [Number, String, Object],
      required: true,
    },
    list: {
      type: Array,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      // list: [], //使用props去定义和使用list
      loading: false,
      finished: false,
      offset: null,
      err: false,
    };
  },
  methods: {
    async onLoad() {
      try {
        const { data } = await getCommentList({
          type: "a",
          source: this.art_id,
          offset: this.offset,
        });
        console.log(data);
        const { results } = data.data;
        this.list.push(...results);
        this.loading = false;

        if (results.length) {
          this.offset = data.data.last_id;
        } else {
          this.finished = true;
        }
      } catch (err) {
        this.error = true;
        this.loading = false;
      }
    },
  },
};
</script>

<style>
</style>