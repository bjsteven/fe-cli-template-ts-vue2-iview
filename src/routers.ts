/**
 * 该文件改为手动维护，但请注意，相似的路径写在一起
 */
export default [
  {
    path: '/about',
    name: 'about',
    component: () => import('./views/about.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('./views/settings.vue')
  },
  {
    path: '/changepwd',
    name: 'change',
    component: () => import('./views/changepwd.vue')
  },
  {
    path: '/user/list/',
    name: 'user-list',
    component: () => import('./views/user/index.vue')
  },
  {
    path: '/user/list/detail/:id?',
    name: 'user-list-detail',
    component: () => import('./views/user/detail.vue')
  },
  {
    path: '/app/list/',
    name: 'app-list',
    component: () => import('./views/app/index.vue')
  },
  {
    path: '/app/list/edit/:appId/:type',
    name: 'app-list-edit',
    component: () => import('./views/app/editApp.vue')
  }
] as any[]
