import request from "@/utils/request"
export const getArticles = (params) => {
    return request({
        method: 'GET',
        url: '/v1_0/articles',
        params
    })
}

export const getArticleDetails = (articleId) => {
    return request({
        method: 'GET',
        url: `/v1_0/articles/${articleId}`
    })
}

export const collectArticles = (target) => {
    return request({
        method: 'POST',
        url: '/v1_0/article/collections',
        data: { target }
    })
}

export const cancelArticleCollect = (target) => {
    return request({
        method: 'DELETE',
        url: `/v1_0/article/collections/${target}`
    })
}

export const likeArticles = (target) => {
    return request({
        method: 'POST',
        url: '/v1_0/article/likings',
        data: { target }
    })
}

export const cancelArticleLike = (target) => {
    return request({
        method: 'DELETE',
        url: `/v1_0/article/likings/${target}`
    })
}