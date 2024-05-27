<!-- 算式组件 -->
<template>
    <div id="keyboard">
        <button v-for="num in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']" class="key" :key="num" :disabled="numDisabled" @click="onKeyClick(num)">
            {{ num }}
        </button>
        <button class="material-icons key" :disabled="backspaceDisabled" @click="onKeyClick('backspace')">backspace</button>
        <button class="material-icons key forward-key" :disabled="forwardDisabled" @click="onKeyClick('forward')">forward</button>
    </div>
</template>

<script setup lang="ts">
defineProps({
    // 位数有效才能继续按数字键
    numDisabled: Boolean,
    forwardDisabled: Boolean,
    backspaceDisabled: Boolean
});
const emit = defineEmits(['onKeyClick']);
const onKeyClick = (key: string) => {
    console.log('SSU onKeyClick', key);
    emit('onKeyClick', key);
};
</script>

<style scoped>
#keyboard {
    margin-top: 0.3rem;
    width: calc(100vw - 1rem);
    display: flex;
    flex-wrap: wrap;
    box-shadow: 0 0 0.05rem #ccc;
    border-radius: 0.08rem;
    box-sizing: border-box;
    padding: 0.1rem;
}

.key {
    width: calc((100vw - 1rem - 0.1rem * 2 * 4 - 0.1rem * 2) / 4);
    height: 1rem;
    font-size: 0.48rem;
    margin: 0.1rem;
}

.forward-key:enabled {
    color: greenyellow;
    background-color: #567ebb;
    border: none;
}
</style>
