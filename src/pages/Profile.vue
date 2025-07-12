<template>
  <div class="max-w-xl mx-auto p-8">
    <h2 class="text-2xl font-bold text-blue-600 mb-6">Thông tin cá nhân</h2>
    <div v-if="loading" class="text-center text-gray-500 py-10">Đang tải...</div>
    <div v-else-if="error" class="text-center text-red-500 py-10">{{ error }}</div>
    <div v-else>
      <form @submit.prevent="updateProfile" class="space-y-4">
        <div>
          <label class="block font-semibold mb-1">Email</label>
          <input type="text" :value="profile.email" disabled class="w-full border rounded-lg px-4 py-2 bg-gray-100" />
        </div>
        <div>
          <label class="block font-semibold mb-1">Họ tên</label>
          <input v-model="profile.fullname" type="text" class="w-full border rounded-lg px-4 py-2" required />
        </div>
        <div>
          <label class="block font-semibold mb-1">Số điện thoại</label>
          <input v-model="profile.phone" type="text" class="w-full border rounded-lg px-4 py-2" required />
        </div>
        <div>
          <label class="block font-semibold mb-1">Avatar</label>
          <input type="file" @change="onFileChange" />
          <div v-if="profile.avatar" class="mt-2">
            <img :src="profile.avatar" alt="avatar" class="w-20 h-20 rounded-full object-cover" />
          </div>
        </div>
        <button type="submit" :disabled="saving" class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60">
          {{ saving ? 'Đang lưu...' : 'Lưu thay đổi' }}
        </button>
        <div v-if="success" class="text-green-600 mt-2 text-center">Cập nhật thành công!</div>
        <div v-if="errorMsg" class="text-red-500 mt-2 text-center">{{ errorMsg }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from '../utils/axios';

export default {
  name: 'Profile',
  data() {
    return {
      profile: {
        email: '',
        fullname: '',
        phone: '',
        avatar: '',
      },
      loading: false,
      error: null,
      saving: false,
      success: false,
      errorMsg: '',
      file: null,
    };
  },
  methods: {
    async fetchProfile() {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get('/user/my-profile');
        this.profile = res.data.data || {};
      } catch (err) {
        this.error = 'Không thể tải thông tin cá nhân.';
      } finally {
        this.loading = false;
      }
    },
    onFileChange(e) {
      this.file = e.target.files[0];
    },
    async updateProfile() {
      this.saving = true;
      this.success = false;
      this.errorMsg = '';
      try {
        const formData = new FormData();
        formData.append('fullName', this.profile.fullname);
        formData.append('phone', this.profile.phone);
        if (this.file) formData.append('avatar', this.file);
        await axios.put('/user/update-profile', formData);
        this.success = true;
        this.fetchProfile();
      } catch (err) {
        this.errorMsg = 'Cập nhật thất bại.';
      } finally {
        this.saving = false;
      }
    },
  },
  mounted() {
    this.fetchProfile();
  },
};
</script>

<style scoped>
</style>
