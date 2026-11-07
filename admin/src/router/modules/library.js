/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

export default {
    path: '/library',
    component: Layout,
    redirect: '/library/library_List',
    alwaysShow: true,
    name: 'library',
    meta: {
        title: '库存管理',
        icon: 'permission'
    },
    children: [
        {
            path: '/library/library_add',
            component: () => import('@/views/library-page/library_add.vue'),
            name: 'library_add',
            meta: { title: '入库创建', icon: 'personnel' }
        },
        {
            path: '/library/library_List',
            component: () => import('@/views/library-page/library_List.vue'),
            name: 'library_List',
            meta: {
                title: '入库列表', icon: 'article-create'
            }
        },
        {
            path: '/library/library_careful',
            component: () => import('@/views/library-page/library_careful.vue'),
            name: 'library_careful',
            meta: {
                title: '入库审核', icon: 'article-create'
            }
        },
        {
            path: '/library/library_supplier',
            component: () => import('@/views/library-page/library_supplier.vue'),
            name: 'library_supplier',
            meta: {
                title: '供应商列表', icon: 'article-create'
            }
        },
        {
            path: '/library/library_Returns',
            component: () => import('@/views/library-page/library_Returns.vue'),
            name: 'library_Returns',
            meta: {
                title: '采购退货', icon: 'article-create'
            }
        },
        {
            path: '/library/library-Preview',
            component: () => import('@/views/library-page/library-Preview.vue'),
            name: 'library-Preview',
            meta: { title: '库存预警', icon: 'personnel' }
        },
        {
            path: '/library/library-preorder',
            component: () => import('@/views/library-page/library-preorder.vue'),
            name: 'library-preorder',
            meta: { title: '线下开单预先列表', icon: 'personnel' }
        },
        {
            path: '/library/library-xcx_preorder',
            component: () => import('@/views/library-page/library-xcx_preorder.vue'),
            name: 'library-xcx_preorder',
            meta: { title: '小程序开单预先列表', icon: 'personnel' }
        },
        
    ]
}

