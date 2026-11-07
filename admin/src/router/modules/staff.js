/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

export default {
    path: '/staff',
    component: Layout,
    redirect: '/staff/staff_List',
    alwaysShow: true,
    name: 'staff',
    meta: {
        title: '账号管理',
        icon: 'permission'
    },
    children: [
        {
            path: '/staff/staff_List',
            component: () => import('@/views/staff-page/staff_List.vue'),
            name: 'staff_List',
            meta: {
                title: '账号列表', icon: 'article-create'
            }
        }
    ]
}

