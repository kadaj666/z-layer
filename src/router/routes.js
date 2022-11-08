const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '', component: () => import('pages/Dashboard.vue')},
      {path: '/:key', component: () => import('pages/Dashboard.vue')},
      {path: '/:key/:network', component: () => import('pages/Networks.vue')},
    ],
    meta: {
      requireLogin: true
    },
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  },
  {
    path: '/login',
    component: () => import('pages/Login.vue')
  },
]

export default routes
