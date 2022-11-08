import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'



export default route(function ({ store }) {
  const createHistory = process.env.MODE === 'ssr'
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach((to, from, next) => {
    if (
      to.matched.some((record) => record.meta.requireLogin) &&
      !store.state.isAuthenticated
    ) {
      next('/login')
    } else {
      next()
    }
  })

  return Router
})
