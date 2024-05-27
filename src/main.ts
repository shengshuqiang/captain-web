import { createApp } from 'vue'
// import App from './App.vue'
import AddSubView from './views/AddSubView.vue';
import router from './router'
const app = createApp(AddSubView)

app.use(router)

app.mount('#app')
