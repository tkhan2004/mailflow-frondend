<template>
  <div class="p-8">
    <button @click="$router.back()" class="mb-4 text-blue-600 hover:underline">← Quay lại Inbox</button>
    <div v-if="loading" class="text-center text-gray-500 py-10">Đang tải chi tiết email...</div>
    <div v-else-if="error" class="text-center text-red-500 py-10">{{ error }}</div>
    <div v-else-if="!mailDetail" class="text-center text-gray-400 py-10">Không tìm thấy email.</div>
    <div v-else>
      <h2 class="text-2xl font-bold text-blue-600 mb-2">{{ mailDetail.title || mailDetail.subject }}</h2>
      <div class="mt-6 space-y-8">
        <div v-for="mail in mails" :key="mail.mailId" class="bg-white rounded-xl shadow p-6">
          <div class="flex items-center mb-2">
            <span class="font-semibold text-gray-900">{{ mail.senderName || mail.senderEmail }}</span>
            <span class="ml-2 text-xs text-gray-500">&lt;{{ mail.senderEmail }}&gt;</span>
            <span class="ml-auto text-xs text-gray-400">{{ getTime(mail.createdAt) }}</span>
          </div>
          <div class="mb-2 text-gray-700">Đến: <span class="font-semibold">{{ mail.receiverName || mail.receiverEmail }}</span> <span class="text-xs text-gray-500">&lt;{{ mail.receiverEmail }}&gt;</span></div>
          <div class="text-gray-800 whitespace-pre-line mb-2">{{ mail.content }}</div>
          <div v-if="mail.attachments && mail.attachments.length" class="mt-2">
            <div class="font-semibold mb-1">Tệp đính kèm:</div>
            <ul>
              <li v-for="file in mail.attachments" :key="file.fileUrl">
                <a :href="file.fileUrl" target="_blank" class="text-blue-600 hover:underline">{{ file.fileName }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <button class="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition" @click="showReply = true">
        Trả lời
      </button>
      <ReplyMail v-if="showReply" :threadId="$route.params.threadId" @close="showReply = false" @sent="onReplySent" />
    </div>
  </div>
</template>

<script>
import axios from '../utils/axios';
import ReplyMail from './ReplyMail.vue';

export default {
  name: 'MailDetail',
  data() {
    return {
      mailDetail: null,
      mails: [],
      loading: false,
      error: null,
      showReply: false,
      myEmail: '',
    };
  },
  components: {
    ReplyMail,
  },
  methods: {
    async fetchMailDetail() {
      this.loading = true;
      this.error = null;
      try {
        const threadId = this.$route.params.threadId;
        const res = await axios.get(`/mail/inbox/thread/${threadId}`);
        this.mails = res.data.data?.mails || [];
        this.mailDetail = this.mails.length ? this.mails[this.mails.length - 1] : null;
      } catch (err) {
        this.error = 'Không thể tải chi tiết email.';
      } finally {
        this.loading = false;
      }
    },
    getTime(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleString();
    },
    onReplySent() {
      this.showReply = false;
      this.fetchMailDetail();
    },
    async fetchMyEmail() {
      try {
        const res = await axios.get('/user/my-profile');
        this.myEmail = res.data.data?.email || '';
      } catch {
        this.myEmail = '';
      }
    },
  },
  mounted() {
    this.fetchMailDetail();
    this.fetchMyEmail();
  },
};
</script>

<style scoped>
</style>
