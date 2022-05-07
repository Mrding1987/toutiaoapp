<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 加载完成-文章详情 -->
      <div class="article-detail markdown-body" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <follow-user
            :is_followed="article.is_followed"
            :user_id="article.aut_id"
            @update-is_followed="article.is_followed = $event"
            class="follow-btn"
          ></follow-user>
        </van-cell>
        <!-- /用户信息 -->

        <!-- 文章内容 -->
        <div
          class="article-content"
          v-html="article.content"
          ref="article_content"
        ></div>
        <van-divider>正文结束</van-divider>
        <comment-list
          :art_id="article.art_id"
          :list="newCommentList"
        ></comment-list>
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="ReleaseComment"
            >发表评论</van-button
          >
          <van-icon name="comment-o" :badge="article.comm_count" color="#777" />
          <!-- <van-icon color="#777" name="star-o" /> -->
          <collect-article
            v-model="article.is_collected"
            :art_id="article.art_id"
          ></collect-article>
          <like-article
            v-model="article.attitude"
            :art_id="article.art_id"
          ></like-article>
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-release
            :art_id="article.art_id"
            @post-success="onPostSuccess"
          ></comment-release>
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>
  </div>
</template>

<script>
import { getArticleDetails } from "@/api/article";
import { ImagePreview } from "vant";
import FollowUser from "@/components/follow-user";
import CollectArticle from "@/components/collect-article";
import LikeArticle from "@/components/like-article";
import CommentList from "@/views/article/components/comment-list.vue";
import CommentRelease from "@/views/article/components/comment-release.vue";
export default {
  name: "ArticleIndex",
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentRelease,
  },
  props: {
    // 使用props获取动态路由的数据
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      article: {},
      loading: true,
      errStatus: 0,
      isPostShow: false,
      newCommentList: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle();
  },
  mounted() {},
  methods: {
    async loadArticle() {
      this.loading = true;
      try {
        const { data } = await getArticleDetails(this.articleId);
        // console.log(data);
        //以下代码用来模拟随机的加载失败
        /* if (Math.random() > 0.5) {
          JSON.parse("jidsnaonganog");
        } */

        /* {data: {…}, message: 'OK'}
            data:
            art_id: "7758"
            attitude: -1
            aut_id: "1111"
            aut_name: "1223456"
            aut_photo: "http://www.liulongbin.top:8000/uploads/1650276947665.blob"
            comm_count: "0"
            content: "<p>sofa-rpc是阿里开源的一款高性能的rpc框架，这篇文章主要是对sofa-rpc pro
            is_collected: false
            is_followed: false
            like_count: 0
            pubdate: "2019-03-11 09:00:00"
            read_count: 1
            title: "sofa-rpc 服务端源码流程走读" */
        this.article = data.data;
        // 初始化图片点击预览
        setTimeout(() => {
          this.previewImage();
        }, 0);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404;
        }
      }
      this.loading = false;
    },

    previewImage() {
      // 得到所有的img节点
      const imgs = this.$refs.article_content.querySelectorAll("img");
      // console.log(imgs);
      const imgURL = [];
      imgs.forEach((img, index) => {
        imgURL.push(img.src);
        img.addEventListener("click", (e) => {
          e.preventDefault();
          ImagePreview({
            images: imgURL,
            startPosition: index,
          });
        });
      });
      //   console.log(imgURL);
    },

    ReleaseComment() {
      this.isPostShow = true;
    },

    onPostSuccess(data) {
      //关闭弹出层
      this.isPostShow = false;
      //将发布内容渲染到评论列表顶部
      this.newCommentList.unshift(data.new_obj);
    },
  },
};
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  /deep/.van-nav-bar .van-icon {
    color: unset;
  }
  /deep/.van-nav-bar__left {
    color: #fff;
  }
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/.van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>