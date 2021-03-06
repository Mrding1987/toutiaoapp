import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
        path: '/login',
        name: 'login',
        component: () =>
            import ('@/views/login')
    },
    {
        path: '/',
        name: 'layout',
        component: () =>
            import ('@/views/layout'),
        children: [{
                path: '',
                name: 'home',
                component: () =>
                    import ('@/views/home')
            },
            {
                path: '/qa',
                name: 'qa',
                component: () =>
                    import ('@/views/Q&A')
            },
            {
                path: '/video',
                name: 'video',
                component: () =>
                    import ('@/views/video')
            },
            {
                path: '/my',
                name: 'my',
                component: () =>
                    import ('@/views/my')
            }
        ]
    },
    {
        path: '/search',
        name: 'search',
        component: () =>
            import ('@/views/search')
    },
    {
        // 设置为动态路由，每个文章对应的详情页都是不同的
        path: '/article/:articleId',
        name: 'article',
        component: () =>
            import ('@/views/article'),
        props: true
    },
    {
        path: '/userprofile',
        name: 'userprofile',
        component: () =>
            import ('@/views/user-profile')
    }
]

const router = new VueRouter({
    routes
})

export default router