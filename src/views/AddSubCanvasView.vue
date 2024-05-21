<template>
    <div class="content">
        <Bomb :bombTiming="data.bombTiming" :limitTime="settingData.limitTime" @click="onClickBomb" />
        <Equation :answer="questionData.answer" :isAdd="settingData.isAdd" :step="questionData.step" />
        <KeyBoard
            :forwardDisabled="questionData.forwardDisabled"
            :backspaceDisabled="questionData.backspaceDisabled"
            :numDisabled="questionData.numDisabled"
            @onKeyClick="onKeyClick"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import Bomb from '../components/Bomb.vue';
import Equation from '../components/Equation.vue';
import KeyBoard from '../components/KeyBoard.vue';
import { useSetting, useQuestion } from '../composables';
import { DrawInfo, UseSetting, UseQuestion } from '../constant';

const data = reactive({
    bombTiming: false
});
const newGame = () => {
    data.bombTiming = true;
    document.title = `${settingData.numberRange}以内${settingData.isAdd ? '进位加法' : '退位减法'}`;
    resetSetting(settingData);
    const hasNextResult = hasNext();
    if (hasNextResult) {
        next();
    }
    console.log('SSU newGame', { settingData, hasNextResult });
};
const continueGame = () => {
    data.bombTiming = true;
};
const { data: settingData, show: showSetting }: UseSetting = useSetting(newGame, continueGame);
const { data: questionData, hasNext, next, resetSetting, handleKeyBoard }: UseQuestion = useQuestion();
const setting = () => {
    data.bombTiming = false;
    showSetting();
};
onMounted(() => {
    data.bombTiming = false;
    setting();
});
const onClickBomb = () => {
    data.bombTiming = false;
    setting();
};
console.log('SSU App.vue', { settingData, questionData });

const onKeyClick = (key: string) => {
    handleKeyBoard(key, setting);
};
// const scoreStr = ref('')

// const questionDoneCount = ref(0)
// const questionTotalCount = ref(20)

// const forwardDisabled = ref(false)
// const hasNext = computed(() => limitNumArray.value.some((item) => !item))
// const number = reactive({
//   a: '',
//   b: '',
//   c: ''
// })

// const next = () => {
//   let randomInt = produceRandomInt(limitNumArray.value.length)
//   while (limitNumArray.value[randomInt]) {
//     randomInt = (randomInt + 1) % limitNumArray.value.length
//   }
//   number.a = randomInt % limitNum.value
//   number.b = Math.floor(randomInt / limitNum.value)
//   number.flags = `${number.a + number.b}`.split('').reduce((acc, val, index, array) => {
//     const numAPart = `${number.a}`.slice(-index - 1)
//     const numBPart = `${number.b}`.slice(-index - 1)
//     const sum = `${+numAPart + +numBPart}`
//     // 标记进位，避免 7 + 8 第二位也判断进位
//     acc[array.length - index - 1] =
//       numAPart.length > index &&
//       numBPart.length > index &&
//       sum.length > Math.max(numAPart.length, numBPart.length)
//     console.log('number.flags', {
//       sum,
//       numA: number.a,
//       numAPart,
//       numB: number.b,
//       numBPart,
//       acc,
//       curIndex: sum.length - index - 1,
//       val,
//       index,
//       flag: acc[index]
//     })
//     return acc
//   }, [])
//   number.c = ''
//   console.log('next', number, {
//     draw,
//     randomInt,
//     length: limitNumArray.value.length,
//     limitNum: limitNum.value
//   })
//   draw(number, isAdd.value)
// }
// let step = 0

// // 位数有效才能继续按数字键
// const keyDisabled = computed(() => number.c.length >= `${number.a + number.b}`.length)
</script>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>
