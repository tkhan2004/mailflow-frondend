import { defineStore } from 'pinia';
import axios from '../utils/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem('accessToken') || '',
    refreshToken: localStorage.getItem('refreshToken') || '',
  }),
  actions: {
    async login(email, password) {
      const res = await axios.post('/auth/login', { email, password });

      // ❗ Thêm kiểm tra rõ ràng cho accessToken
      const { accessToken, refreshToken } = res.data?.data || {}

      if (!accessToken) {
        console.error('❌ Token không hợp lệ!', res.data)
        throw new Error('Login thất bại: Không nhận được token!')
      }

      this.accessToken = accessToken
      this.refreshToken = refreshToken

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      await this.getProfile()
  },
    async register(formData) {
      const res = await axios.post('/auth/register', formData);
      return res.data;
    },
    async getProfile() {
      const res = await axios.get('/user/my-profile');
      this.user = res.data.data;
    },
    logout() {
      this.user = null;
      this.accessToken = '';
      this.refreshToken = '';
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }
});