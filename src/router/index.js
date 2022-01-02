import Vue from 'vue'
import VueRouter from 'vue-router'


// import Home from '../components/Home'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ "../components/Home.vue")
// import Welcome from '../components/Welcome'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ "../components/Welcome.vue")
// import Login from '../components/Login'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ "../components/Login.vue")

// import Users from '../components/users/Users'
const Users = () => import(/* webpackChunkName: "users_tasks" */ "../components/users/Users.vue")

// import Tasks from '../components/tasks/Tasks'
const Tasks = () => import(/* webpackChunkName: "users_tasks" */ "../components/tasks/Tasks.vue")

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/tasks', component: Tasks },
    ]
  },
]

const router = new VueRouter({
  routes
})

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  // 放行login
  if (to.path == '/login') return next();
  // 拿到token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
