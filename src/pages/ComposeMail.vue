<template>
  <div class="fixed inset-0 bg-yellow-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative border-4 border-yellow-400">
      <button @click="$emit('close')" class="absolute top-4 right-4 text-yellow-500 hover:text-yellow-700 text-2xl font-bold">×</button>
      <div class="flex items-center gap-3 mb-6">
        <img src="/vite.svg" alt="cat" class="w-12 h-12 rounded-full border-2 border-yellow-400 bg-yellow-100" />
        <h2 class="text-2xl font-bold text-yellow-600 tracking-wide font-[Pacifico]">Meow Mails</h2>
      </div>
      <form @submit.prevent="sendMail" class="space-y-4">
        <div>
          <label class="block mb-1 font-semibold text-yellow-700">Gửi tới (Email)</label>
          <input v-model="receiverEmail" type="email" required class="w-full border-2 border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-yellow-50 placeholder-yellow-400 font-semibold" placeholder="example@email.com"
            @input="onSearchEmail"
            list="email-suggestions"
          />
          <datalist id="email-suggestions">
            <option v-for="email in emailSuggestions" :key="email" :value="email" />
          </datalist>
        </div>
        <div>
          <label class="block mb-1 font-semibold text-yellow-700">Tiêu đề</label>
          <input v-model="subject" type="text" required class="w-full border-2 border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-yellow-50 placeholder-yellow-400 font-semibold" placeholder="Tiêu đề email" />
        </div>
        <div>
          <label class="block mb-1 font-semibold text-yellow-700">Nội dung</label>
          <textarea v-model="content" required class="w-full border-2 border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-yellow-50 placeholder-yellow-400 font-semibold" rows="5" placeholder="Nội dung email..."></textarea>
        </div>
        <div>
          <label class="block mb-1 font-semibold text-yellow-700">Tệp đính kèm (tuỳ chọn)</label>
          <input type="file" @change="onFileChange" class="w-full border-2 border-yellow-400 rounded-lg px-2 py-1 bg-yellow-50 font-semibold" />
        </div>
        <div class="flex justify-end mb-2">
          <button type="button" @click="showAIGen = !showAIGen" class="text-yellow-600 hover:underline font-semibold">Trợ lý AI soạn mail</button>
        </div>
        <div v-if="showAIGen" class="mb-2">
          <label class="block mb-1 font-semibold text-yellow-700">Yêu cầu AI</label>
          <input v-model="aiPrompt" type="text" class="w-full border-2 border-yellow-400 rounded-lg px-4 py-2 mb-2 bg-yellow-50 placeholder-yellow-400 font-semibold" placeholder="Ví dụ: Hãy giúp tôi soạn mail xin nghỉ phép..." />
          <button type="button" @click="generateAIMail" :disabled="aiLoading" class="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 disabled:opacity-60 font-semibold">{{ aiLoading ? 'Đang tạo...' : 'Tạo nội dung' }}</button>
          <div v-if="aiError" class="text-red-500 mt-2">{{ aiError }}</div>
        </div>
        <div class="flex justify-end">
          <button type="submit" :disabled="sending" class="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-60 shadow-lg">
            {{ sending ? 'Đang gửi...' : 'Gửi' }}
          </button>
        </div>
        <div v-if="error" class="text-red-500 mt-2 text-center">{{ error }}</div>
        <div v-if="success" class="text-green-600 mt-2 text-center">Gửi email thành công!</div>
      </form>
      <div class="absolute left-4 bottom-4 flex gap-2">
        <span class="w-6 h-6 bg-yellow-400 rounded-full inline-block"></span>
        <span class="w-4 h-4 bg-yellow-300 rounded-full inline-block"></span>
        <span class="w-3 h-3 bg-yellow-200 rounded-full inline-block"></span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../utils/axios';

export default {
  name: 'ComposeMail',
  data() {
    return {
      receiverEmail: '',
      subject: '',
      content: '',
      file: null,
      sending: false,
      error: null,
      success: false,
      emailSuggestions: [],
      emailSearchTimeout: null,
      showAIGen: false,
      aiPrompt: '',
      aiLoading: false,
      aiError: '',
      groupEmails: '',
      groupLoading: false,
      groupSuccess: false,
      groupError: '',
      isRecording: false,
      recognition: null,
    };
  },
  mounted() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'vi-VN';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.aiPrompt = transcript;
        this.isRecording = false;
      };
      this.recognition.onerror = () => {
        this.isRecording = false;
      };
      this.recognition.onend = () => {
        this.isRecording = false;
      };
    }
  },
  methods: {
    onFileChange(e) {
      this.file = e.target.files[0];
    },
    async onSearchEmail() {
      if (this.emailSearchTimeout) clearTimeout(this.emailSearchTimeout);
      if (!this.receiverEmail || this.receiverEmail.length < 2) {
        this.emailSuggestions = [];
        return;
      }
      this.emailSearchTimeout = setTimeout(async () => {
        try {
          const res = await axios.get(`/user/search-mail?q=${encodeURIComponent(this.receiverEmail)}`);
          this.emailSuggestions = res.data.data || [];
        } catch {
          this.emailSuggestions = [];
        }
      }, 300);
    },
    async sendMail() {
      this.sending = true;
      this.error = null;
      this.success = false;
      try {
        const formData = new FormData();
        formData.append('receiverEmail', this.receiverEmail);
        formData.append('subject', this.subject);
        formData.append('content', this.content);
        if (this.file) formData.append('file', this.file);
        await axios.post('/mail/send', formData);
        this.success = true;
        this.receiverEmail = '';
        this.subject = '';
        this.content = '';
        this.file = null;
        this.$emit('sent');
      } catch (err) {
        this.error = 'Gửi email thất bại.';
      } finally {
        this.sending = false;
      }
    },
    async generateAIMail() {
      if (!this.aiPrompt) return;
      this.aiLoading = true;
      this.aiError = '';
      try {
        const res = await axios.post(`/ai/generate-ai?prompt=${encodeURIComponent(this.aiPrompt)}`);
        const data = res.data.data || {};
        if (data.receiverEmail) this.receiverEmail = data.receiverEmail;
        if (data.subject) this.subject = data.subject;
        if (data.content) this.content = data.content;
      } catch (err) {
        this.aiError = 'Không thể tạo nội dung từ AI.';
      } finally {
        this.aiLoading = false;
      }
    },
    async createGroup() {
      this.groupLoading = true;
      this.groupSuccess = false;
      this.groupError = '';
      try {
        const emails = this.groupEmails.split(',').map(e => e.trim()).filter(Boolean);
        if (!emails.length) throw new Error('Chưa nhập email');
        const params = new URLSearchParams();
        emails.forEach(e => params.append('receiverEmail', e));
        params.append('subject', this.subject || '');
        await axios.post(`/mail/creat-group?${params.toString()}`);
        this.groupSuccess = true;
        this.groupEmails = '';
      } catch (err) {
        this.groupError = 'Tạo nhóm thất bại.';
      } finally {
        this.groupLoading = false;
      }
    },
    startMic() {
      if (this.recognition) {
        this.isRecording = true;
        this.recognition.start();
      }
    },
    stopMic() {
      if (this.recognition && this.isRecording) {
        this.recognition.stop();
        this.isRecording = false;
      }
    },
  },
};
</script>

<style scoped>
</style>
