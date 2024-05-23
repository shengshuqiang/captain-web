import { createApp } from 'vue'
// import App from './App.vue'
import AddSubView from './views/AddSubView.vue';
import router from './router'

// 全局初始化函数
(function() {
    const remSize = window.parseFloat(getComputedStyle(document.documentElement).fontSize);
    window.ratio = 100 / remSize;
    console.log({ ratio, devicePixelRatio: window.devicePixelRatio, remSize });
    window.rem = (num: number) => num * remSize;
})();

const app = createApp(AddSubView)

app.use(router)

app.mount('#app')
