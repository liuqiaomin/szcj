/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

export default {
    path: '/Product',
    component: Layout,
    redirect: '/Product/Product_List',
    alwaysShow: true,
    name: 'Product',
    meta: {
        title: '商品管理',
        icon: 'permission'
    },
    children: [
        {
            path: '/Product/Product_add',
            component: () => import('@/views/Product-page/Product_add.vue'),
            name: 'Product_add',
            meta: {
                title: '新建商品', icon: 'article-create'
            }
        },
        {
            path: '/Product/Product_List',
            component: () => import('@/views/Product-page/Product_List.vue'),
            name: 'Product_List',
            meta: { title: '商品列表', icon: 'personnel' }
        },
        {
            path: '/Product/Product_classification',
            component: () => import('@/views/Product-page/Product_classification.vue'),
            name: 'Product_classification',
            meta: {
                title: '商品分类', icon: 'article-create'
            }
        }, {
            path: '/Product/Product_xq',
            component: () => import('@/views/Product-page/Product_xq.vue'),
            name: 'Product_xq',
            meta: {
                title: '商品详情', icon: 'article-create'
            },
            hidden: true,//true不显示在侧边栏
        },
    ]
}

