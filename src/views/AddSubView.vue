<template>
    <div class="content">
        <div class="bomb-score-group">
            <Bomb
                v-model="bombData.remainingTime"
                :bombTiming="bombData.bombTiming"
                @click="onClickBomb"
                @fire="onBombFire"
            />
            <div class="score-group">
                <div :class="{ 'score-title': true, 'score-title-finished': questionData.finished }">
                    {{ questionData.scoreTitle }}
                    <div
                        v-if="questionData.finished"
                        class="score-time"
                    >
                        {{ buildWorkTime() }}
                    </div>
                </div>

                <div
                    class="score-desc"
                    v-html="questionData.scoreDesc"
                ></div>
            </div>
        </div>
        <BombAnim
            class="bomb-anim"
            v-model="bombData.bombAnim"
        />
        <Equation
            :answer="questionData.answer"
            :isAdd="settingData.isAdd"
            :step="questionData.step"
        />
        <ScoreBoard
            v-if="questionData.finished"
            :answerRecords="questionData.answerRecords"
            @onRecordClick="onRecordClick"
        />
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
import BombAnim from '../addsub/components/BombAnim.vue';
import { useQuestion } from '../addsub/useQuestionComposables';
import { useSetting } from '../addsub/useSettingComposables';
import { UseSetting, UseQuestion, Answer, BombTimingData } from '../addsub/constant';
import { deconstructTime } from '../utils/utils';

// TODO 增加分享功能 // https://juejin.cn/post/6844903825589927944

const bombData = reactive<BombTimingData>({
    bombTiming: false,
    bombAnim: false,
    remainingTime: 0
});
const { settingData, showSetting }: UseSetting = useSetting();
const { questionData, hasNext, next, handleKeyBoard, handleRecord }: UseQuestion = useQuestion(settingData, bombData);
const setting = () => {
    bombData.bombTiming = false;
    showSetting();
};
onMounted(() => {
    bombData.bombTiming = false;
    setting();
});
const onClickBomb = () => {
    bombData.bombTiming = false;
    setting();
};
console.log('SSU App.vue', { settingData, questionData });

const onKeyClick = (key: string) => {
    handleKeyBoard(key, setting);
};
const onRecordClick = (answerRecord: Answer) => {
    handleRecord(answerRecord);
};
watch(
    () => settingData.reset,
    reset => {
        console.log('SSU watch settingData.reset', reset);
        if (reset) {
            // 重新开始游戏
            bombData.bombTiming = true;
            document.title = `${settingData.numberRange}以内${settingData.isAdd ? '进位加法' : '退位减法'}`;
            bombData.remainingTime = settingData.limitTime;
            const hasNextResult = hasNext();
            if (hasNextResult) {
                next();
            }
            console.log('SSU newGame', { settingData, hasNextResult });
            // TODO 重复设置true不会触发watch，所以要重置回去
            settingData.reset = false;
        } else {
            bombData.bombTiming = true;
        }
    }
);
watch(
    () => questionData.finished,
    finished => {
        console.log('SSU watch finished', finished);
        if (finished) {
            bombData.bombTiming = false;
            bombData.bombAnim = true;
            handleRecord(questionData.answerRecords[0]);
        }
    }
);
const onBombFire = () => {
    // 时间到
    questionData.finished = true;
};

const buildWorkTime = () => {
    const { mm, ss, ms } = deconstructTime(settingData.limitTime - bombData.remainingTime);
    return `${mm}'${ss}''`;
};
</script>

<style scoped>
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}
.bomb-anim {
    position: absolute;
    background-color: gray;
    opacity: 0.95;
    width: 100vw;
    height: 100vh;
}
.bomb-score-group {
    width: 6.5rem;
    display: flex;
    flex-direction: row;
    align-items: center;
}
.score-group {
    width: 2.5rem;
    margin-left: 0.35rem;
}
.score-title {
    display: flex;
    align-items: flex-end;
    font-size: 0.48rem;
    font-family: Bold;
}
.score-time {
    font-size: 0.42rem;
    font-family: Bold;
    color: blue;
    margin-left: 0.15rem;
}
.score-title-finished {
    color: red;
}
.score-desc {
    width: 2.5rem;
    word-break: break-all;
    font-size: 0.32rem;
    margin-top: 0.1rem;
}
</style>
