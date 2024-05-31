<!-- 算式组件 -->
<template>
    <div class="board">
        <button
            v-for="(answerRecord, index) in answerRecords"
            :class="[
                'answer',
                answerRecord.numC !== '' ? (answerRecord.isRight ? 'right' : 'wrong') : 'empty',
                answerRecord.isModify ? 'modify' : '',
                data.selectedIndex === index ? 'selected' : ''
            ]"
            :key="index"
            @click="onRecordClick(answerRecord, index)"
        >
            {{ index + 1 }}
        </button>
        <div
            class="zero-score"
            v-if="!answerRecords.length"
        >
            零分空白卷
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { Answer } from '../constant';

defineProps({
    answerRecords: []
});
const data = reactive({
    selectedIndex: 0
});
const emit = defineEmits(['onRecordClick']);
const onRecordClick = (answerRecord: Answer, index) => {
    data.selectedIndex = index;
    console.log('SSU onRecordClick', answerRecord);
    emit('onRecordClick', answerRecord);
};
</script>

<style scoped>
.board {
    margin-top: 0.3rem;
    width: calc(100vw - 1rem);
    display: flex;
    flex-wrap: wrap;
    box-shadow: 0 0 0.05rem #ccc;
    border-radius: 0.08rem;
    box-sizing: border-box;
    padding: 0.1rem;
}

.answer {
    width: calc((100vw - 1rem - 0.1rem * 2 * 5 - 0.1rem * 2) / 5);
    height: calc((100vw - 1rem - 0.1rem * 2 * 5 - 0.1rem * 2) / 5);
    color: black;
    font-size: 0.48rem;
    font-weight: bold;
    margin: 0.1rem;
    border: none;
}
.right {
    background-color: #86ddb0;
    border-radius: calc((100vw - 1rem - 0.1rem * 2 * 5 - 0.1rem * 2) / 5 / 2);
    border-color: #86ddb0;
}
.wrong {
    background-color: #ff3b3e;
    border-radius: calc((100vw - 1rem - 0.1rem * 2 * 5 - 0.1rem * 2) / 5 / 2);
    border-color: #ff3b3e;
}
.empty {
    background-color: #b1a7af;
    border-radius: calc((100vw - 1rem - 0.1rem * 2 * 5 - 0.1rem * 2) / 5 / 2);
    border-color: #b1a7af;
}
.modify {
    color: #ffc925;
}
.selected {
    border: 0.08rem solid blue;
}
.zero-score {
    width: 100%;
    text-align: center;
    font-size: 0.64rem;
    color: red;
}
</style>
