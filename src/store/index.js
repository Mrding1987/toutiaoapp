import Vue from 'vue'
import Vuex from 'vuex'
import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)
const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
    state: {
        // user用来存储当前登录的用户信息，包含token等信息，是一个对象
        // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
        user: getItem(TOKEN_KEY)
    },
    getters: {},
    mutations: {
        setUser(state, data) {
            state.user = data

            // 为了防止刷新丢失数据，需要将数据备份到本地存储
            // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
            setItem(TOKEN_KEY, state.user)
        }
    },
    actions: {},
    modules: {}
})