/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

export default {
    path: '/outside',
    component: Layout,
    redirect: '/outside/outside_List',
    alwaysShow: true,
    name: 'outside',
    meta: {
        title: '报表导出',
        icon: 'permission'
    },
    children: [
        {
            path: '/outside/outside_Warehousing',
            component: () => import('@/views/outside-page/outside_Warehousing.vue'),
            name: 'outside_Warehousing',
            meta: {
                title: '入库-进货明细', icon: 'article-create'
            }
        },
        {
            path: '/outside/outside_Outbound',
            component: () => import('@/views/outside-page/Outbound.vue'),
            name: 'outside_Outbound',
            meta: {
                title: '出库-出货明细', icon: 'article-create'
            }
        },
        {
            path: '/outside/outside_Purchasereturn',
            component: () => import('@/views/outside-page/outside_Purchasereturn.vue'),
            name: 'outside_Purchasereturn',
            meta: {
                title: '采购退货', icon: 'article-create'
            }
        },

        {
            path: '/outside/outside_Salesreturns',
            component: () => import('@/views/outside-page/outside_Salesreturns.vue'),
            name: 'outside_Salesreturns',
            meta: {
                title: '销售退货', icon: 'article-create'
            }
        }, {
            path: '/outside/outside_Totalinventory',
            component: () => import('@/views/outside-page/outside_Totalinventory.vue'),
            name: 'outside_Totalinventory',
            meta: {
                title: '总库存-结存明细', icon: 'article-create'
            }
        },
        {
            path: '/outside/Salesperson',
            component: () => import('@/views/outside-page/Salesperson.vue'),
            name: 'Salesperson',
            meta: {
                title: '业务员报表', icon: 'article-create'
            }
        },
    ]
}

