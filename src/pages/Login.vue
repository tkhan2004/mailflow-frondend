<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="w-full max-w-6xl h-[600px] grid grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
      <!-- Left Gradient Welcome với mèo -->
      <div class="flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 via-pink-400 to-yellow-300 text-white p-10 relative">
        <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f431.png" alt="MeowMail" class="w-20 h-20 mb-4 drop-shadow-lg" />
        <h1 class="text-5xl font-extrabold mb-2 font-serif drop-shadow">MeowMail</h1>
        <p class="text-2xl font-medium italic text-center drop-shadow">Đăng nhập để "meo meo" gửi thư nhé!<br><span class="text-yellow-200 font-bold">Nhanh như mèo, vui như boss 🐾</span></p>
      </div>

      <!-- Right Form -->
      <form
        @submit.prevent="handleLogin"
        class="bg-white flex flex-col justify-center px-10 py-8 relative"
      >
        <h2 class="text-3xl font-bold mb-4 border-b-4 border-gradient-to-r from-purple-400 to-yellow-300 w-fit pb-1 font-serif text-indigo-600">🔐 Đăng nhập</h2>
        <!-- Alert nghệ thuật -->
        <transition name="fade">
          <div v-if="alert.show" :class="alertClass" class="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg shadow font-serif text-base animate-fade-in">
            <span v-if="alert.type==='success'">😺</span>
            <span v-else>😿</span>
            <span>{{ alert.message }}</span>
          </div>
        </transition>
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="mb-4 px-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 font-serif"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Mật khẩu"
          class="mb-6 px-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 font-serif"
          required
        />
        <button
          class="w-full bg-gradient-to-r from-indigo-500 via-pink-400 to-yellow-300 hover:from-indigo-600 hover:to-yellow-400 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-200 font-serif text-lg tracking-wide"
        >
          Đăng nhập
        </button>
        <p class="text-sm text-center mt-6 text-gray-600 font-serif">
          Chưa có tài khoản?
          <router-link to="/register" class="text-indigo-600 hover:underline font-semibold">Đăng ký</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const email = ref('')
const password = ref('')
const auth = useAuthStore()
const router = useRouter()

const alert = ref({ show: false, message: '', type: 'error' })
const alertClass = computed(() =>
  alert.value.type === 'success'
    ? 'bg-green-100 text-green-800 border border-green-300'
    : 'bg-rose-100 text-rose-800 border border-rose-300'
)

function showAlert(message, type = 'error', timeout = 2500) {
  alert.value = { show: true, message, type }
  setTimeout(() => (alert.value.show = false), timeout)
}

async function handleLogin() {
  try {
    await auth.login(email.value, password.value)
    router.push('/inbox')
  } catch (err) {
    showAlert('😿 Sai thông tin đăng nhập!')
  }
}
</script>

<style>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(40px);}
  to { opacity: 1; transform: translateY(0);}
}
.animate-fade-in {
  animation: fade-in 0.8s cubic-bezier(.4,2,.3,1) both;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>