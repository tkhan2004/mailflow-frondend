// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Inbox from '../pages/Inbox.vue'
import MailDetail from '../pages/MailDetail.vue'
import Profile from '../pages/Profile.vue'
import ChangePassword from '../pages/ChangePassword.vue'
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/inbox', component: Inbox },
  { path: '/inbox/thread/:threadId', component: MailDetail },
  { path: '/profile', component: Profile },
  { path: '/change-password', component: ChangePassword },
  {
    path: '/compose',
    name: 'ComposeMail',
    component: () => import('../pages/ComposeMail.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router