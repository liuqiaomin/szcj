/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

export default {
    path: '/Billing',
    component: Layout,
    redirect: '/Billing/Billing_List',
    alwaysShow: true,
    name: 'Billing',
    meta: {
        title: '线下开单',
        icon: 'permission'
    },
    children: [
        {
            path: '/Billing/Billing_add',
            component: () => import('@/views/Billing-page/Billing_add.vue'),
            name: 'Billing_add',
            meta: { title: '新开单', icon: 'personnel' }
        },
        {
            path: '/Billing/Billing_all',
            component: () => import('@/views/Billing-page/Billing_all.vue'),
            name: 'Billing_all',
            meta: {
                title: '全部订单', icon: 'article-create'
            }
        },
        {
            path: '/Billing/Billing_List',
            component: () => import('@/views/Billing-page/Billing_List.vue'),
            name: 'Billing_List',
            meta: {
                title: '待出库订单列表', icon: 'article-create'
            }
        },
        {
            path: '/Billing/Billing_List1',
            component: () => import('@/views/Billing-page/Billing_List1.vue'),
            name: 'Billing_List1',
            meta: {
                title: '待抢单订单列表', icon: 'article-create'
            }
        },
        {
            path: '/Billing/Billing_List2',
            component: () => import('@/views/Billing-page/Billing_List2.vue'),
            name: 'Billing_List2',
            meta: {
                title: '配送中订单列表', icon: 'article-create'
            }
        },

        {
            path: '/Billing/Billing_List4',
            component: () => import('@/views/Billing-page/Billing_List4.vue'),
            name: 'Billing_List4',
            meta: {
                title: '待退货订单列表', icon: 'article-create'
            }
        },
        {
            path: '/Billing/Billing_List5',
            component: () => import('@/views/Billing-page/Billing_List5.vue'),
            name: 'Billing_List5',
            meta: {
                title: '待收款订单列表', icon: 'article-create'
            }
        },
        {
            path: '/Billing/Billing_List3',
            component: () => import('@/views/Billing-page/Billing_List3.vue'),
            name: 'Billing_List3',
            meta: {
                title: '已完成订单列表', icon: 'article-create'
            }
        },
        {
            path: '/Billing/Billing_xq',
            component: () => import('@/views/Billing-page/Billing_xq.vue'),
            name: 'Billing_xq',
            meta: {
                title: '订单详情', icon: 'article-create'
            },
            hidden: true,//true不显示在侧边栏
        }, {
            path: '/Billing/Billing_td_xq',
            component: () => import('@/views/Billing-page/Billing_td_xq.vue'),
            name: 'Billing_td_xq',
            meta: {
                title: '退单详情', icon: 'article-create'
            },
            hidden: true,//true不显示在侧边栏
        }, {
            path: '/Billing/Billing_user_list',
            component: () => import('@/views/Billing-page/Billing_user_list.vue'),
            name: 'Billing_user_list',
            meta: {
                title: '用户列表', icon: 'article-create'
            }
        }
        , {
            path: '/Billing/Billing_Returnsadd',
            component: () => import('@/views/Billing-page/Billing_Returnsadd.vue'),
            name: 'Billing_Returnsadd',
            meta: {
                title: '新建销售退货', icon: 'article-create'
            },
        }, {
            path: '/Billing/Billing_Returns',
            component: () => import('@/views/Billing-page/Billing_Returns.vue'),
            name: 'Billing_Returns',
            meta: {
                title: '销售退货列表', icon: 'article-create'
            }
        }
        , {
            path: '/Billing/Billing_Returnsxq',
            component: () => import('@/views/Billing-page/Billing_Returnsxq.vue'),
            name: 'Billing_Returnsxq',
            meta: {
                title: '销售退货详情', icon: 'article-create'
            },
            hidden: true,//true不显示在侧边栏
        }

    ]
}

