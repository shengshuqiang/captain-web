<!-- 算式组件 -->
<template>
    <div :class="['card', win ? 'win-card' : '']">
        <div
            v-if="showContent"
            :class="['title', win ? 'win' : '']"
        >
            {{ win ? '挑战成功' : '再接再厉' }}
        </div>
        <div
            v-if="showContent"
            class="time"
        >
            {{ timeDesc }}
        </div>
        <div
            v-if="showContent"
            class="desc"
        >
            <span class="right">对{{ answerResult.rightCount }}</span>
            <span class="wrong">错{{ answerResult.wrongCount }}</span>
            <span class="modify">改{{ answerResult.modifyCount }}</span>
            <span class="empty">空{{ answerResult.emptyCount }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { deconstructTime } from '../../utils/utils';
import { Answer } from '../constant';

const props = defineProps({
    showContent: Boolean,
    win: Boolean,
    time: Number,
    answerRecords: []
});
const timeDesc = computed(() => {
    const { mm, ss } = deconstructTime(props.time);
    return `${mm}'${ss}''`;
});
const answerResult = computed(() => {
    return props.answerRecords.reduce(
        (acc, record: Answer) => {
            if (record.numC !== '') {
                if (record.isRight) {
                    acc.rightCount++;
                } else {
                    acc.wrongCount++;
                }
                if (record.isModify) {
                    acc.modifyCount++;
                }
            } else {
                acc.emptyCount++;
            }

            return acc;
        },
        { rightCount: 0, wrongCount: 0, emptyCount: 0, modifyCount: 0 }
    );
});
</script>

<style scoped>
.card {
    width: calc(100vw - 1rem);
    height: 3rem;
    margin-top: 0.8rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 0.1rem #ccc;
    border-radius: 0.08rem;
    box-sizing: border-box;
    padding: 0.1rem;
    background: #f7b3b2;
}
.win-card {
    background: #fdfce7;
}
.title {
    width: 100%;
    font-size: 0.56rem;
    font-family: bold;
    text-align: center;
    color: #ff5245;
    text-shadow: 0 0.08rem 0.1rem #ff5245;
    -webkit-text-stroke: 0.01rem #ffc938;
}
.win {
    color: #ffc938;
    text-shadow: 0 0.08rem 0.1rem #ffc938;
    -webkit-text-stroke: 0.01rem #ff5245;
}
.time {
    font-size: 0.42rem;
    font-family: Bold;
    color: blue;
    margin-left: 0.15rem;
}
.desc {
    font-size: 0.36rem;
    font-family: Bold;
}
.right {
    color: #86ddb0;
}
.wrong {
    margin-left: 0.1rem;
    color: #ff3b3e;
}
.modify {
    margin-left: 0.1rem;
    color: #ffc925;
}
.empty {
    margin-left: 0.1rem;
    color: #b1a7af;
}
</style>
