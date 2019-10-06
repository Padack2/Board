//라우터 관리
import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Register from './views/Register.vue'
import Login from './views/Login.vue'
import MyPage from './views/MyPage.vue'
import Write from './views/Write.vue'
import Read from './views/Read.vue'
import Update from './views/Update.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/Register.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/mypage',
      name: 'mypage',
      component: () => import('./views/MyPage.vue')
    },
    {
      path: '/write',
      name: 'write',
      component: () => import('./views/Write.vue')
    },
    {
      path: '/read/:id',
      name: 'read',
      component: () => import('./views/Read.vue')
    },
    {
      path: '/update/:id',
      name: 'update',
      component: () => import('./views/Update.vue')
    }
  ]
})
