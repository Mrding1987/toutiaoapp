import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入vant组件库
import Vant from 'vant';

//导入vant组件库的全局样式
import 'vant/lib/index.css';
//加载全局样式
import './styles/index.less'
import 'amfe-flexible'

//加载dayjs初始化配置
import "./utils/dayjs"

//注册vant组件
Vue.use(Vant);

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')