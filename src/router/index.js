import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login'
import Index from '../components/Index'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/index', component: Index }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, form, next) => {
  // to 要访问的路径
  // from 代表从哪个路径跳转而来
  // next 表示放行
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
