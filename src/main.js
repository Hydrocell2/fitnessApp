import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'notyf/notyf.min.css'

axios.defaults.baseURL = 'https://fitnessapp-api-ln8u.onrender.com'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')