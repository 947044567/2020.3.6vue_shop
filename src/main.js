import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import '../src/assets/font1/iconfont.css'
import '../src/assets/font2/iconfont.css'
import axios from 'axios'

// axios配置
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log(config)
  // 在请求拦截器这边，统一的添加token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

Vue.prototype.$axios = axios
Vue.config.productionTip = false

// // 添加响应拦截器
// axios.interceptors.response.use(function (response) {
//   // 对响应数据做点什么
//   // response = response.data
//   // 统一对响应进行处理，如果状态码是401，认为token过期或者无效token，此时：统一拦截到登录
//   console.log(response)
//   // if (response.meta === 401) {
//   //   response.meta.msg = '尊敬的用户，您的登录状态已过期，请重新登录'
//   //   // 清除无效的token
//   //   window.sessionStorage.removeItem('token')
//   //   // 拦截到登录
//   //   router.push('/login')
//   // }
//   // return response
// }, function (error) {
//   // 对响应错误做点什么
//   return Promise.reject(error)
// })

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
