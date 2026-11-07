/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

export default {
    path: '/applet',
    component: Layout,
    redirect: '/applet/applet_List',
    alwaysShow: true,
    name: 'applet',
    meta: {
        title: '小程序管理',
        icon: 'permission'
    },
    children: [
        {
            path: '/applet/applet_List',
            component: () => import('@/views/applet-page/applet_List.vue'),
            name: 'applet_List',
            meta: {
                title: '订单列表', icon: 'article-create'
            }
        },
        {
            path: '/applet/Presalelist_order_list',
            component: () => import('@/views/applet-page/Presalelist_order_list.vue'),
            name: 'Presalelist_order_list',
            meta: {
                title: '预售订单列表', icon: 'article-create'
            }
        },
        {
            path: '/applet/Presalelist_order_xq',
            component: () => import('@/views/applet-page/Presalelist_order_xq.vue'),
            name: 'Presalelist_order_xq',
            meta: {
                title: '预售订单详情', icon: 'article-create'
            },
            hidden: true,//true不显示在侧边栏
        },
        {
            path: '/applet/Presalelist',
            component: () => import('@/views/applet-page/Presalelist.vue'),
            name: 'Presalelist',
            meta: {
                title: '预售商品列表', icon: 'article-create'
            }
        },
        {
            path: '/applet/Presalelist_add',
            component: () => import('@/views/applet-page/Presalelist_add.vue'),
            name: 'Presalelist_add',
            meta: {
                title: '预售商品新增', icon: 'article-create'
            },
            hidden: true,//true不显示在侧边栏
        },
        {
            path: '/applet/Presalelist_xq',
            component: () => import('@/views/applet-page/Presalelist_xq.vue'),
            name: 'Presalelist_xq',
            meta: {
                title: '预售商品详情', icon: 'article-create'
            },
            hidden: true,//true不显示在侧边栏
        },

        {
            path: '/applet/applet_chargeback',
            component: () => import('@/views/applet-page/applet_chargeback.vue'),
            name: 'applet_chargeback',
            meta: {
                title: '退单申请列表', icon: 'article-create'
            }
        },
        {
            path: '/applet/applet_Coupons',
            component: () => import('@/views/applet-page/applet_Coupons.vue'),
            name: 'applet_Coupons',
            meta: {
                title: '优惠券设置', icon: 'article-create'
            }
        },
        {
            path: '/applet/applet_set',
            component: () => import('@/views/applet-page/applet_set.vue'),
            name: 'applet_set',
            meta: {
                title: '系统设置', icon: 'article-create'
            }
        },
        {
            path: '/applet/Distribution_List_order',
            component: () => import('@/views/applet-page/Distribution_List_order.vue'),
            name: 'Distribution_List_order',
            meta: {
                title: '用户订单', icon: 'article-create'
            },
            hidden: true,//true不显示在侧边栏
        },
    ]
}

