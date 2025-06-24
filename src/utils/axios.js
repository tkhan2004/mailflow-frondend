// axios.js
import axios from 'axios'

const instance = axios.create({
  baseURL: '/api',
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  const isAuthRoute = config.url.includes('/auth/login') || config.url.includes('/auth/register')
  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ✅ Quan trọng: export default
export default instance