<template>
  <div class="min-h-screen flex items-center justify-center bg-white">
    <div class="w-full max-w-6xl h-[600px] grid grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
      <!-- Left Gradient Welcome với mèo -->
      <div class="flex flex-col justify-center items-center bg-gradient-to-br from-indigo-500 via-pink-400 to-yellow-300 text-white p-10 relative">
        <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f431.png" alt="MeowMail" class="w-20 h-20 mb-4 drop-shadow-lg" />
        <h1 class="text-5xl font-extrabold mb-2 font-serif drop-shadow">MeowMail</h1>
        <p class="text-2xl font-medium italic text-center drop-shadow">Đăng ký tài khoản mới để cùng "meo meo" gửi thư nhé!<br><span class="text-yellow-200 font-bold">Nhanh như mèo, vui như boss 🐾</span></p>
      </div>

      <!-- Right Form -->
      <form
        @submit.prevent="handleRegister"
        class="bg-white flex flex-col justify-center px-10 py-8 relative"
      >
        <h2 class="text-3xl font-bold mb-4 border-b-4 border-gradient-to-r from-purple-400 to-yellow-300 w-fit pb-1 font-serif text-indigo-600">🐾 Đăng ký</h2>
        <!-- Alert nghệ thuật -->
        <transition name="fade">
          <div v-if="alert.show" :class="alertClass" class="flex items-center gap-2 px-4 py-3 mb-4 rounded-lg shadow font-serif text-base animate-fade-in">
            <span v-if="alert.type==='success'">😺</span>
            <span v-else>😿</span>
            <span>{{ alert.message }}</span>
          </div>
        </transition>
        <div class="flex gap-4 mb-4">
          <input v-model="firstName" type="text" placeholder="Họ" class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 font-serif" required />
          <input v-model="lastName" type="text" placeholder="Tên" class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 font-serif" required />
        </div>
        <input v-model="email" type="email" placeholder="Email" class="mb-4 px-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 font-serif" required />
        <input v-model="password" type="password" placeholder="Mật khẩu" class="mb-4 px-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 font-serif" required />
        <input v-model="confirmPassword" type="password" placeholder="Xác nhận mật khẩu" class="mb-4 px-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 font-serif" required />
        <div class="flex items-center mb-6 text-sm text-gray-600">
          <input type="checkbox" id="terms" class="mr-2" required />
          <label for="terms">
            Tôi đồng ý với <a href="#" class="text-indigo-500 underline">Điều khoản dịch vụ</a> và <a href="#" class="text-indigo-500 underline">Chính sách bảo mật</a>
          </label>
        </div>
        <button
          class="w-full bg-gradient-to-r from-indigo-500 via-pink-400 to-yellow-300 hover:from-indigo-600 hover:to-yellow-400 text-white font-bold py-3 rounded-lg shadow-md transition-all duration-200 font-serif text-lg tracking-wide"
        >
          Đăng ký ngay meo!
        </button>
        <p class="text-sm text-center mt-6 text-gray-600 font-serif">
          Đã có tài khoản?
          <router-link to="/login" class="text-indigo-600 hover:underline font-semibold">Đăng nhập</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const router = useRouter()
const auth = useAuthStore()

const alert = ref({ show: false, message: '', type: 'success' })
const alertClass = computed(() =>
  alert.value.type === 'success'
    ? 'bg-green-100 text-green-800 border border-green-300'
    : 'bg-rose-100 text-rose-800 border border-rose-300'
)

function showAlert(message, type = 'success', timeout = 2500) {
  alert.value = { show: true, message, type }
  setTimeout(() => (alert.value.show = false), timeout)
}

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    showAlert('😿 Mật khẩu xác nhận không khớp!', 'error')
    return
  }
  try {
    await auth.register({
      email: email.value,
      password: password.value,
      fullName: `${firstName.value} ${lastName.value}`
    })
    showAlert('😺 Đăng ký thành công! Meo meo~', 'success')
    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    showAlert('😿 Đăng ký thất bại! Vui lòng kiểm tra lại thông tin.', 'error')
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