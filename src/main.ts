import { createApp } from 'vue'
import App from './App.vue'
import { initTheme } from './stores/theme'
import './styles/tokens.css'
import './styles/glass.css'
import './styles/ui.css'

initTheme()
createApp(App).mount('#app')
