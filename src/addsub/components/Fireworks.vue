<!-- 烟花特效组件 https://app.lottiefiles.com/premium-assets/packs/featured/security-356 https://www.bootstrapmb.com/item/13964 -->
<template>
    <div
        class="lottie"
        v-show="show"
        ref="fireworksDiv"
    ></div>
</template>

<script setup lang="ts">
import { watch, onMounted, ref } from 'vue';
import lottie from 'lottie-web';
import fireworks from '../../assets/fireworks-lottie.json';
// import bomb from '../../assets/bomb-lottie.json';
const ANIM_NAME = 'fireworks';
const show = defineModel<boolean>();

const fireworksDiv = ref();
console.log('SSU fireworks', show);
let animation = null;

onMounted(() => {
    const container = fireworksDiv.value;
    const animationData = fireworks;
    animation = lottie.loadAnimation({
        container,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        name: ANIM_NAME,
        animationData
    });
    animation.setSpeed(1.5);
    animation.addEventListener('loopComplete', ({ currentLoop }) => {
        console.log('SSU animation complete', currentLoop);
        if (currentLoop === 3) {
            // animation.destroy(ANIM_NAME);
            animation.stop(ANIM_NAME);
            show.value = false;
        }
    });
});
watch(show, () => {
    console.log('SSU fireworks watch(show)', show);
    if (show.value) {
        animation.play(ANIM_NAME);
    }
});
</script>

<style scoped>
.lottie {
    position: absolute;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(#add6d0, #c7d685);
    opacity: 0.8;
}
</style>
