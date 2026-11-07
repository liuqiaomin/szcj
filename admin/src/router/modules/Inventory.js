/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

export default {
    path: '/Inventory',
    component: Layout,
    redirect: '/Inventory/List',
    alwaysShow: true,
    name: 'Inventory',
    meta: {
        title: '库存盘点',
        icon: 'permission'
    },
    children: [
        {
            path: '/Inventory/List',
            component: () => import('@/views/Inventory-page/List.vue'),
            name: 'List',
            meta: {
                title: '盘点列表', icon: 'article-create'
            }
        },
        {
            path: '/Inventory/xq',
            component: () => import('@/views/Inventory-page/xq.vue'),
            name: 'xq',
            meta: {
                title: '盘点详情', icon: 'article-create'
            },
            hidden: true,//true不显示在侧边栏
        }
    ]
}

