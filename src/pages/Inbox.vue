<template>
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r flex flex-col">
      <div class="h-20 flex items-center justify-center border-b">
        <span class="text-2xl font-bold text-blue-600">MailFlow</span>
      </div>
      <nav class="flex-1 py-4">
        <ul class="space-y-2">
          <li>
            <a href="#" @click.prevent="currentTab = 'inbox'" :class="['flex items-center px-6 py-3 rounded-lg font-semibold', currentTab === 'inbox' ? 'bg-blue-50 text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-100']">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              Inbox
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="currentTab = 'sent'" :class="['flex items-center px-6 py-3 rounded-lg font-semibold', currentTab === 'sent' ? 'bg-blue-50 text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-100']">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm-8 0V8a4 4 0 018 0v4"/></svg>
              Sent
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="currentTab = 'spam'" :class="['flex items-center px-6 py-3 rounded-lg font-semibold', currentTab === 'spam' ? 'bg-blue-50 text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-100']">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2z"/></svg>
              Spam
            </a>
          </li>
          <li>
            <a href="#" @click.prevent="currentTab = 'deleted'" :class="['flex items-center px-6 py-3 rounded-lg font-semibold', currentTab === 'deleted' ? 'bg-blue-50 text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-100']">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              Đã xoá
            </a>
          </li>
        </ul>
      </nav>
      <div class="p-4">
        <button class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition" @click="showCompose = true">+ Compose</button>
        <router-link to="/profile" class="block mt-4 text-blue-600 hover:underline text-center">Thông tin cá nhân</router-link>
        <router-link to="/change-password" class="block mt-2 text-blue-600 hover:underline text-center">Đổi mật khẩu</router-link>
      </div>
    </aside>
    <!-- Main Content -->
    <main class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="h-20 flex items-center justify-between px-8 border-b bg-white">
        <h1 class="text-2xl font-bold text-blue-600">Inbox</h1>
        <input v-model="search" type="text" placeholder="Search mail..." class="border rounded-lg px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      </header>
      <!-- Email List -->
      <section class="flex-1 overflow-y-auto p-8">
        <div v-if="loading" class="text-center text-gray-500 py-10">Đang tải email...</div>
        <div v-else-if="error" class="text-center text-red-500 py-10">{{ error }}</div>
        <div v-else-if="filteredEmails.length === 0" class="text-center text-gray-400 py-10">Không có email nào.</div>
        <div v-else class="space-y-4">
          <div v-for="mail in filteredEmails" :key="mail.threadId" class="group bg-white rounded-xl shadow-sm hover:shadow-lg transition flex items-center px-6 py-4 cursor-pointer border border-transparent hover:border-blue-200"
            @click="$router.push(`/inbox/thread/${mail.threadId}`)">
            <div :class="['w-12 h-12 flex items-center justify-center rounded-full font-bold text-lg mr-4', getAvatarColor(mail.lastSenderEmail)]">
              {{ getAvatarText(mail.lastSenderEmail) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-gray-900 group-hover:text-blue-600 truncate">{{ getDisplayName(mail) }}</span>
                <span v-if="mail.unread" class="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">Chưa đọc</span>
              </div>
              <div class="text-gray-700 truncate">{{ mail.title || mail.subject }}</div>
            </div>
            <div class="flex flex-col items-end ml-4">
              <span class="text-xs text-gray-400">{{ getTime(mail.lastCreatedAt) }}</span>
              <span v-if="mail.attachments && mail.attachments.length" class="mt-1 text-xs text-gray-500 flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a4 4 0 00-5.656-5.656l-6.586 6.586a6 6 0 008.486 8.486"/></svg>
                {{ mail.attachments.length }} file
              </span>
            </div>
            <input type="checkbox" v-model="selected" :value="mail.threadId" class="ml-6 w-5 h-5 accent-blue-600" @click.stop />
          </div>
        </div>
      </section>
      <div class="flex justify-end gap-2 mt-6">
        <button v-if="selected.length" @click="deleteThreads" :disabled="deleting" class="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-60">{{ deleting ? 'Đang xóa...' : 'Xóa đã chọn' }}</button>
        <button v-if="selected.length" @click="markSpam" :disabled="spamming" class="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 disabled:opacity-60">{{ spamming ? 'Đang spam...' : 'Đánh dấu spam' }}</button>
        <button v-if="selected.length" @click="markRead" :disabled="reading" class="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-60">{{ reading ? 'Đang đọc...' : 'Đánh dấu đã đọc' }}</button>
      </div>
      <ComposeMail v-if="showCompose" @close="showCompose = false" @sent="onMailSent" />
    </main>
  </div>
</template>

<script>
import axios from '../utils/axios';
import ComposeMail from './ComposeMail.vue';

export default {
  name: 'Inbox',
  data() {
    return {
      emails: [],
      loading: false,
      error: null,
      search: '',
      showCompose: false,
      selected: [],
      deleting: false,
      spamming: false,
      reading: false,
      myEmail: '',
      currentTab: 'inbox',
    };
  },
  computed: {
    filteredEmails() {
      if (!this.emails) return [];
      const myEmail = this.profile?.email || '';
      if (this.currentTab === 'inbox') {
        return this.emails.filter(
          (mail) => !mail.spam && !mail.deleted && mail.lastSenderEmail !== myEmail
        );
      }
      if (this.currentTab === 'sent') {
        return this.emails.filter(
          (mail) => mail.lastSenderEmail === myEmail && !mail.spam && !mail.deleted
        );
      }
      if (this.currentTab === 'spam') {
        return this.emails.filter(
          (mail) => mail.spam && !mail.deleted
        );
      }
      if (this.currentTab === 'deleted') {
        return this.emails.filter(
          (mail) => mail.deleted
        );
      }
      return this.emails;
    },
  },
  components: {
    ComposeMail,
  },
  methods: {
    async fetchInbox() {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get('/mail/inbox');
        // Nếu lastContent bị lặp dấu phẩy hoặc lặp nội dung, chỉ lấy phần sau cùng (fix trường hợp gửi/reply bị lặp)
        const emails = (res.data.data || []).map(mail => {
          if (mail.lastContent && mail.lastContent.includes(',')) {
            // Lấy phần sau dấu phẩy cuối cùng
            const parts = mail.lastContent.split(',');
            mail.lastContent = parts[parts.length - 1].trim();
          }
          return mail;
        });
        this.emails = emails;
      } catch (err) {
        this.error = 'Không thể tải danh sách email.';
      } finally {
        this.loading = false;
      }
    },
    async deleteThreads() {
      this.deleting = true;
      try {
        await axios.post('/mail/delete-threads', this.selected);
        this.selected = [];
        this.fetchInbox();
      } catch {}
      this.deleting = false;
    },
    async markSpam() {
      this.spamming = true;
      try {
        await axios.post('/mail/spam-mail', { threadId: this.selected });
        this.selected = [];
        this.fetchInbox();
      } catch {}
      this.spamming = false;
    },
    async markRead() {
      this.reading = true;
      try {
        await axios.post('/mail/read-mail', { threadId: this.selected });
        this.selected = [];
        this.fetchInbox();
      } catch {}
      this.reading = false;
    },
    async fetchMyEmail() {
      try {
        const res = await axios.get('/user/my-profile');
        this.myEmail = res.data.data?.email || '';
      } catch {
        this.myEmail = '';
      }
    },
    getAvatarColor(email) {
      // Simple color hash for avatar background
      const colors = ['bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-yellow-100 text-yellow-600', 'bg-pink-100 text-pink-600'];
      let hash = 0;
      for (let i = 0; i < email.length; i++) hash += email.charCodeAt(i);
      return colors[hash % colors.length];
    },
    getAvatarText(email) {
      return email?.charAt(0)?.toUpperCase() || '?';
    },
    getDisplayName(mail) {
      return mail.lastSenderEmail || 'No Name';
    },
    getTime(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    onMailSent() {
      this.showCompose = false;
      this.fetchInbox();
    },
  },
  mounted() {
    this.fetchInbox();
    this.fetchMyEmail();
  },
};
</script>

<style scoped>
/* Có thể thêm style tuỳ chỉnh ở đây nếu cần */
</style>