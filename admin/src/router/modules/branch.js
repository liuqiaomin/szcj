/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

export default {
    path: '/branch',
    component: Layout,
    redirect: '/branch/branch_list',
    alwaysShow: true,
    name: 'branch',
    meta: {
        title: '总后台管理',
        icon: 'permission'
    },
    children: [
        {
            path: '/branch/branch_list',
            component: () => import('@/views/branch-page/branch_list.vue'),
            name: 'branch_list',
            meta: {
                title: '分店列表', icon: 'article-create'
            }
        },
        {
            path: '/branch/branch_up',
            component: () => import('@/views/branch-page/branch_up.vue'),
            name: 'branch_up',
            meta: {
                title: '分店编辑', icon: 'article-create'
            },
            hidden: true,//true不显示在侧边栏
        },
        {
            path: '/branch/branch_add',
            component: () => import('@/views/branch-page/branch_add.vue'),
            name: 'branch_add',
            meta: {
                title: '分店新增', icon: 'article-create'
            },
            hidden: true,//true不显示在侧边栏
        },


        {
            path: '/branch/branch_xcx_User',
            component: () => import('@/views/branch-page/branch_xcx_User.vue'),
            name: 'branch_xcx_User',
            meta: {
                title: '小程序用户列表', icon: 'article-create'
            },

        },

        {
            path: '/branch/branch_Distribution_List',
            component: () => import('@/views/branch-page/branch_Distribution_List.vue'),
            name: 'branch_Distribution_List',
            meta: {
                title: '小程序分销员列表', icon: 'article-create'
            },
    
        },

        {
            path: '/branch/branch_Distribution_List_user',
            component: () => import('@/views/branch-page/branch_Distribution_List_user.vue'),
            name: 'branch_Distribution_List_user',
            meta: {
                title: '小程序分销员发展商家列表', icon: 'article-create'
            },
            hidden: true,//true不显示在侧边栏
        },

        {
            path: '/branch/branch_xcx_city_list',
            component: () => import('@/views/branch-page/branch_xcx_city_list.vue'),
            name: 'branch_xcx_city_list',
            meta: {
                title: '小程序同城信息列表', icon: 'article-create'
            },

        },

        {
            path: '/branch/branch_Withdrawal',
            component: () => import('@/views/branch-page/branch_Withdrawal.vue'),
            name: 'branch_Withdrawal',
            meta: {
                title: '小程序提现申请列表', icon: 'article-create'
            },

        },





    ]
}

