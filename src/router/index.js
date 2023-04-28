import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: {title: '首页', icon: 'el-icon-s-home', affix: true},
      },
    ],
  },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
    {
      path: '/icon',
      component: Layout,
      children: [
        {
          path: 'index',
          component: () => import('@/views/icons/index'),
          name: 'Icons',
          meta: {title: 'Icons', icon: 'icon', noCache: true},
        },
      ],
    },
  {
    path: '/user',
    component: Layout,
    meta: {
      roles: ['admin'],
    },
    children: [
      {
        path: '/manager',
        component: () => import('@/views/user/manager'),
        name: 'UserManager',
        meta: {
          title: '用户管理',
          icon: 'peoples',
        },
      },
    ],
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/index',
    meta: {
      title: '仓库管理',
      icon: 'el-icon-s-order',
    },
    children: [
      {
        path: '/index',
        component: () => import('@/views/product/list'),
        name: 'ProductList',
        meta: {
          title: '产品管理',
          icon: 'list',
          noCache: true,
        },
      },
      {
        path: '/category',
        component: () => import('@/views/Category/list.vue'),
        name: 'CategoryList',
        meta: {
          title: '分类管理',
          icon: 'tree',
          noCache: true,
        },
      },
      {
        path: '/supplier',
        component: () => import('@/views/Supplier/list.vue'),
        name: 'SupplierList',
        meta: {
          title: '供应商管理',
          icon: 'shopping',
          noCache: true,
        },
      },
    ],
  },
  {
    path: '/operate',
    component: Layout,
    redirect: '/list',
    meta: {
      title: '出入库',
      icon: 'el-icon-sort',
    },
    children: [
      {
        path: '/list',
        component: () => import('@/views/operate/list'),
        name: 'OperateList',
        meta: {
          title: '出入库记录',
          icon: 'list',
          noCache: true,
          roles: ['admin'],
        },
      },
      {
        path: '/audit',
        component: () => import('@/views/operate/audit.vue'),
        name: 'OperateAudit',
        meta: {
          title: '出入库审核',
          icon: 'el-icon-finished',
          noCache: true,
          roles: ['admin'],
        },
      },
      {
        path: '/ruku',
        component: () => import('@/views/operate/ruku.vue'),
        name: 'RuKu',
        meta: {
          title: '入库',
          icon: 'el-icon-circle-plus-outline',
          noCache: true,
        },
      },
      {
        path: '/chuku',
        component: () => import('@/views/operate/chuku.vue'),
        name: 'ChuKu',
        meta: {
          title: '出库',
          icon: 'el-icon-remove-outline',
          noCache: true,
        },
      },
    ],
  },
  // 404 page must be placed at the end !!!
  {path: '*', redirect: '/404', hidden: true},
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRoutes,
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
