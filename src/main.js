import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './style.css'

import { initStore } from './store'

const app = createApp(App)

// Initialize data from Supabase
initStore()

app.use(router)
app.mount('#app')
