// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Inbox from '../pages/Inbox.vue'
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/inbox', component: Inbox },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router