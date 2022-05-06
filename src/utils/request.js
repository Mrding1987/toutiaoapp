/* 基于axios的请求模块，后续使用axios发起POST和GET请求，而不是用传统的ajax */
import axios from 'axios'
import store from '@/store'

const request = axios.create({
    baseURL: 'http://www.liulongbin.top:8000/',
})

// 请求拦截器
request.interceptors.request.use((config) => {
    const { user } = store.state
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`
    }

    // 注意：这里务必要返回config配置对象，否则请求就停在这里出不去
    // 相当于是一个放行的标记
    return config
}, (error) => {
    return Promise.reject(error)
})

export default request