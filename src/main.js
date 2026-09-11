import './style.css'
import { createApp } from 'vue'
import App from './App.vue'

const storedTheme = localStorage.getItem('flashCardsTheme')
const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
if (storedTheme === 'dark' || (!storedTheme && systemPrefersDark)) {
  document.documentElement.classList.add('dark')
}

createApp(App).mount('#app')
