/* 
用户登录相关的请求模块封装
*/

import request from "@/utils/request";
// import store from '@/store'
export const login = data => {
    return request({
        method: 'POST',
        url: '/v1_0/authorizations',
        data: data
    })
}

export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user',

        // 使用axios的请求拦截器可以代替以下代码，提高复用性。请求拦截器设置再utils目录下的request.js中
        /*  headers: {
             Authorization: `Bearer ${store.state.user.token}`
         } */
    })
}

export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user/channels'
    })
}

export const followAuthors = target => {
    return request({
        method: 'POST',
        url: '/v1_0/user/followings',
        data: { target }
    })
}

export const cancelFollow = author_id => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/followings/${author_id}`,
    })
}

export const getUserProfile = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user/profile'
    })
}

export const updateUserProfile = data => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/profile',
        data
    })
}

export const updateUserAvatar = data => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/photo',
        data
    })
}