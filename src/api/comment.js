import request from "@/utils/request"

export const getCommentList = (params) => {
    return request({
        method: 'GET',
        url: '/v1_0/comments',
        params
    })
}

export const likeComment = (target) => {
    return request({
        method: 'POST',
        url: '/v1_0/comment/likings',
        data: { target }
    })
}

export const cancelCommentLike = (cmt_id) => {
    return request({
        method: 'DELETE',
        url: `/v1_0/comment/likings/${cmt_id}`
    })
}

export const postComment = data => {
    return request({
        method: 'POST',
        url: '/v1_0/comments',
        data
    })
}