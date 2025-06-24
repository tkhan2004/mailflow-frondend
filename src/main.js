
import './assets/main.css'
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia' // Thêm dòng này
// src/main.js
const app = createApp(App)
app.use(createPinia()) // Thêm dòng này
app.use(router)
app.mount('#app')