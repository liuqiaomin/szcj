/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

export default {
    path: '/Reconciliation',
    component: Layout,
    redirect: '/Reconciliation/Reconciliation_List',
    alwaysShow: true,
    name: 'Reconciliation',
    meta: {
        title: '对账中心',
        icon: 'permission'
    },
    children: [
        {
            path: '/Reconciliation/Reconciliation_List',
            component: () => import('@/views/Reconciliation-page/Reconciliation_List.vue'),
            name: 'Reconciliation_List',
            meta: {
                title: '列表', icon: 'article-create'
            }
        }
    ]
}

