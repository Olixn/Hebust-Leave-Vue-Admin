import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css';
import './plugins/element'
import { Message } from 'element-ui'

import axios from 'axios'
axios.defaults.baseURL = 'https://wx.gocos.cn/'

// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config;
}, error => {
  return Promise.reject(error);
});
// 响应拦截器
axios.interceptors.response.use(response => {
  if (response.data.error_code == 999) {
    Message.error(response.data.msg + ",请重新登陆！")
    router.push({ path: '/login' })
  }
  return response;
}, error => {
  return Promise.reject(error);
});

Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
