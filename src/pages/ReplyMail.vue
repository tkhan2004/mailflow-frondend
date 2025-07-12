<template>
  <div class="fixed inset-0 bg-yellow-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative border-4 border-yellow-400">
      <button @click="$emit('close')" class="absolute top-4 right-4 text-yellow-500 hover:text-yellow-700 text-2xl font-bold">×</button>
      <div class="flex items-center gap-3 mb-6">
        <img src="/vite.svg" alt="cat" class="w-12 h-12 rounded-full border-2 border-yellow-400 bg-yellow-100" />
        <h2 class="text-2xl font-bold text-yellow-600 tracking-wide font-[Pacifico]">Trả lời Email</h2>
      </div>
      <form @submit.prevent="replyMail" class="space-y-4">
        <div>
          <label class="block mb-1 font-semibold text-yellow-700">Nội dung trả lời</label>
          <textarea v-model="content" required class="w-full border-2 border-yellow-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-yellow-50 placeholder-yellow-400 font-semibold" rows="5" placeholder="Nội dung trả lời..."></textarea>
        </div>
        <div>
          <label class="block mb-1 font-semibold text-yellow-700">Tệp đính kèm (tuỳ chọn)</label>
          <input type="file" @change="onFileChange" class="w-full border-2 border-yellow-400 rounded-lg px-2 py-1 bg-yellow-50 font-semibold" />
        </div>
        <div class="flex justify-end">
          <button type="submit" :disabled="sending" class="bg-yellow-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-60 shadow-lg">
            {{ sending ? 'Đang gửi...' : 'Gửi trả lời' }}
          </button>
        </div>
        <div v-if="error" class="text-red-500 mt-2 text-center">{{ error }}</div>
        <div v-if="success" class="text-green-600 mt-2 text-center">Trả lời thành công!</div>
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
  name: 'ReplyMail',
  props: {
    threadId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      content: '',
      file: null,
      sending: false,
      error: null,
      success: false,
    };
  },
  methods: {
    onFileChange(e) {
      this.file = e.target.files[0];
    },
    async replyMail() {
      this.sending = true;
      this.error = null;
      this.success = false;
      try {
        const formData = new FormData();
        formData.append('threadId', this.threadId);
        // Chỉ gửi content không chứa dấu phẩy lặp (nếu user copy-paste hoặc nhập lặp)
        let cleanContent = this.content;
        if (cleanContent.includes(',')) {
          const parts = cleanContent.split(',');
          cleanContent = parts[parts.length - 1].trim();
        }
        formData.append('content', cleanContent);
        if (this.file) formData.append('file', this.file);
        await axios.post(`/mail/reply?threadId=${this.threadId}&content=${encodeURIComponent(cleanContent)}`, formData);
        this.success = true;
        this.content = '';
        this.file = null;
        this.$emit('sent');
      } catch (err) {
        this.error = 'Gửi trả lời thất bại.';
      } finally {
        this.sending = false;
      }
    },
  },
};
</script>

<style scoped>
</style>
