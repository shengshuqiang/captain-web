<template>
    <div class="content">
        <div class="bomb-score-group">
            <Bomb :bombTiming="data.bombTiming" :limitTime="settingData.limitTime" @click="onClickBomb" />
            <div class="score-group">
                <div class="score-title">{{ questionData.scoreTitle }}</div>
                <div class="score-desc" v-html="questionData.scoreDesc"></div>
            </div>
        </div>
        <Equation :answer="questionData.answer" :isAdd="settingData.isAdd" :step="questionData.step" />
        <ScoreBoard v-if="isFinished" :answerRecords="questionData.answerRecords" @onRecordClick="onRecordClick" />
        <KeyBoard
            v-else
            :forwardDisabled="questionData.forwardDisabled"
            :backspaceDisabled="questionData.backspaceDisabled"
            :numDisabled="questionData.numDisabled"
            @onKeyClick="onKeyClick"
        />
    </div>
</template>

<script setup lang="ts">
import ScoreBoard from '../addsub/components/ScoreBoard.vue';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import Bomb from '../addsub/components/Bomb.vue';
import Equation from '../addsub/components/Equation.vue';
import KeyBoard from '../addsub/components/KeyBoard.vue';
import { useQuestion } from '../addsub/useQuestionComposables';
import { useSetting } from '../addsub/useSettingComposables';
import { UseSetting, UseQuestion, Answer } from '../addsub/constant';

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
const { data: questionData, hasNext, next, resetSetting, handleKeyBoard, handleRecord }: UseQuestion = useQuestion();
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
const onRecordClick = (answerRecord: Answer) => {
    handleRecord(answerRecord);
};
const isFinished = computed(() => !data.bombTiming || questionData.totalCount === questionData.answerRecords.length);
</script>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.bomb-score-group {
    width: calc(100vw - 1rem);
    display: flex;
    flex-direction: row;
    align-items: center;
}
.score-group {
    width: 2.5rem;
    margin-left: 0.35rem;
}
.score-title {
    font-size: 0.48rem;
    font-family: Bold;
}
.score-desc {
    word-break: break-all;
    font-size: 0.32rem;
    margin-top: 0.1rem;
}
</style>
