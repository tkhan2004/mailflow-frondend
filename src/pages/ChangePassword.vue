<template>
  <div class="max-w-xl mx-auto p-8">
    <h2 class="text-2xl font-bold text-blue-600 mb-6">Đổi mật khẩu</h2>
    <form @submit.prevent="changePassword" class="space-y-4">
      <div>
        <label class="block font-semibold mb-1">Mật khẩu cũ</label>
        <input v-model="oldPassword" type="password" required class="w-full border rounded-lg px-4 py-2" />
      </div>
      <div>
        <label class="block font-semibold mb-1">Mật khẩu mới</label>
        <input v-model="newPassword" type="password" required class="w-full border rounded-lg px-4 py-2" />
      </div>
      <button type="submit" :disabled="loading" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60">
        {{ loading ? 'Đang đổi...' : 'Đổi mật khẩu' }}
      </button>
      <div v-if="success" class="text-green-600 mt-2 text-center">Đổi mật khẩu thành công!</div>
      <div v-if="error" class="text-red-500 mt-2 text-center">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import axios from '../utils/axios';

export default {
  name: 'ChangePassword',
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      loading: false,
      success: false,
      error: '',
    };
  },
  methods: {
    async changePassword() {
      this.loading = true;
      this.success = false;
      this.error = '';
      try {
        const formData = new FormData();
        formData.append('Mật khẩu cũ', this.oldPassword);
        formData.append('Mật khẩu mới', this.newPassword);
        await axios.patch('/user/change-pass', formData);
        this.success = true;
        this.oldPassword = '';
        this.newPassword = '';
      } catch (err) {
        this.error = 'Đổi mật khẩu thất bại.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
</style>
