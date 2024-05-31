import { reactive, computed, watch } from 'vue';
import { toast } from '../utils/utils';
import { type SettingData, type Answer, type UseQuestion, type QuestionsData, type BombTimingData } from './constant';
import { getAddABEquation, getSubABEquation, produceRandomInt, addABFlags, subABFlags } from '../utils/utils';

/**
 * 问题集组合式函数
 */

// 构建得分描述
const buildScoreDesc = (totalCount: number, answerRecords: Answer[]) => {
    const completedScoreDesc = answerRecords.map((answer: Answer) => (answer.isRight ? '✔️' : '❌')).join('');
    const lastCount = totalCount - answerRecords.length;
    const unCompletedScoreDesc = lastCount > 0 ? '◯'.repeat(lastCount) : '';
    console.log('SSU buildScoreDesc', { completedScoreDesc, unCompletedScoreDesc });
    return `${completedScoreDesc}${unCompletedScoreDesc}`;
};
export const useQuestion = (settingData: SettingData, bombTimingData: BombTimingData): UseQuestion => {
    const questionData: QuestionsData = reactive({
        // 题库答题记录
        bankAnswerNumSet: new Set<number>(),
        answer: {
            numA: '',
            numB: '',
            numAnswer: '',
            numC: '',
            // 进位/借位标识
            numFlags: [],
            isRight: false,
            time: 0
        },
        step: 0,
        answerRecords: [],
        scoreDesc: '',
        scoreTitle: '',
        backspaceDisabled: true,
        forwardDisabled: true,
        numDisabled: false,
        finished: false
    });
    // ab算式
    const abEquation = computed(() => (settingData.isAdd ? getAddABEquation(settingData.numberRange) : getSubABEquation(settingData.numberRange)));
    //  监听重置状态清空答题库
    watch(
        () => settingData.reset,
        reset => {
            if (reset) {
                // 清空题库答题记录
                questionData.bankAnswerNumSet.clear();
                questionData.answer.numA = '';
                questionData.answer.numB = '';
                questionData.answer.numAnswer = '';
                questionData.answer.numC = '';
                questionData.answer.numFlags.length = 0;
                questionData.answer.isRight = false;
                questionData.answer.isModify = false;
                questionData.step = 0;
                questionData.answerRecords.length = 0;
                questionData.scoreTitle = `0/${settingData.questionCount}`;
                questionData.scoreDesc = buildScoreDesc(settingData.questionCount, questionData.answerRecords);
                questionData.finished = false;
                questionData.backspaceDisabled = true;
                questionData.forwardDisabled = true;
                questionData.numDisabled = false;
            }
        }
    );

    // 是否还有下一题，题库答题记录小于答题总数则表示还可以答题
    const hasNext = () => questionData.bankAnswerNumSet.size < settingData.questionCount;
    // 下一题，更新 questionData.numA 和 questionData.numB
    const next = () => {
        let randomInt = produceRandomInt(abEquation.value.count);
        while (questionData.bankAnswerNumSet.has(randomInt)) {
            randomInt = (randomInt + 1) % abEquation.value.count;
        }
        questionData.bankAnswerNumSet.add(randomInt);
        questionData.step = 0;
        const { numA, numB } = abEquation.value.getABByIndex(randomInt);
        questionData.answer.numA = numA;
        questionData.answer.numB = numB;
        if (settingData.isAdd) {
            questionData.answer.numAnswer = questionData.answer.numA + questionData.answer.numB;
            // 加法进位
            questionData.answer.numFlags = addABFlags(questionData.answer.numA, questionData.answer.numB);
        } else {
            questionData.answer.numAnswer = questionData.answer.numA - questionData.answer.numB;
            // 减法退位
            questionData.answer.numFlags = subABFlags(questionData.answer.numA, questionData.answer.numB);
        }
        questionData.answer.numC = '';
        questionData.answer.isModify = false;
        questionData.answer.isRight = false;
        questionData.answer.time = bombTimingData.remainingTime;
        console.log('next', { randomInt, questionData: questionData });
    };
    const handleKeyBoard = (key: string) => {
        console.log('SSU handleKeyBoard', key);
        if (key === 'backspace') {
            // 删除键
            const numCStr = `${questionData.answer.numC}`.slice(0, -1);
            questionData.answer.numC = numCStr.length ? +numCStr : '';
            // 标记修改
            questionData.answer.isModify = true;
            // 键盘状态
            // 输入完成才可以点击键盘下一步
            questionData.forwardDisabled = `${questionData.answer.numC}`.length !== `${questionData.answer.numAnswer}`.length;
            // 删除键
            questionData.backspaceDisabled = !`${questionData.answer.numC}`.length;
            // 数字键
            questionData.numDisabled = `${questionData.answer.numC}`.length === `${questionData.answer.numAnswer}`.length;
        } else if (key === 'forward') {
            if (`${questionData.answer.numC}`.length < `${questionData.answer.numAnswer}`.length) {
                toast('请先填写答案');
                return;
            }
            // 下一步
            // 答题结束，不可以删除
            questionData.backspaceDisabled = true;
            const totalStep = `${questionData.answer.numAnswer}`.length;
            questionData.answer.isRight = questionData.answer.numAnswer === questionData.answer.numC;
            if (questionData.step === 0) {
                questionData.answer.time -= bombTimingData.remainingTime;
                questionData.answerRecords.push({
                    ...questionData.answer,
                    numFlags: [...questionData.answer.numFlags]
                });
                questionData.scoreTitle = `${questionData.answerRecords.length}/${settingData.questionCount}`;
                questionData.scoreDesc = buildScoreDesc(settingData.questionCount, questionData.answerRecords);

                if (questionData.answer.isRight) {
                    // 答案正确则自动播放运算过程，将➡️不可点击
                    questionData.forwardDisabled = true;
                }
            }

            console.log('forward', { step: questionData.step, totalStep });

            const doAnim = () => {
                console.log('SSU doAnim', {
                    step: questionData.step,
                    totalStep,
                    questionCount: settingData.questionCount,
                    answerRecordsLength: questionData.answerRecords.length
                });
                questionData.step += 1;
                if (questionData.step > totalStep) {
                    if (settingData.questionCount === questionData.answerRecords.length) {
                        // 答题完成，显示成绩单
                        questionData.finished = true;
                        console.log('SSU doAnim finished');
                    } else {
                        // 下一题
                        next();
                        // 键盘状态
                        // 输入完成才可以点击键盘下一步
                        questionData.forwardDisabled = `${questionData.answer.numC}`.length !== `${questionData.answer.numAnswer}`.length;
                        // 删除键
                        questionData.backspaceDisabled = !`${questionData.answer.numC}`.length;
                        // 数字键
                        questionData.numDisabled = `${questionData.answer.numC}`.length === `${questionData.answer.numAnswer}`.length;
                    }
                } else {
                    if (questionData.answer.isRight) {
                        setTimeout(doAnim, 1000);
                    }
                }
            };
            doAnim();
        } else {
            // 输入数字
            questionData.answer.numC = +questionData.answer.numC * 10 + +key;
            // 键盘状态
            // 输入完成才可以点击键盘下一步
            questionData.forwardDisabled = `${questionData.answer.numC}`.length !== `${questionData.answer.numAnswer}`.length;
            // 删除键
            questionData.backspaceDisabled = !`${questionData.answer.numC}`.length;
            // 数字键
            questionData.numDisabled = `${questionData.answer.numC}`.length === `${questionData.answer.numAnswer}`.length;
        }
    };
    const handleRecord = (answerRecord: Answer) => {
        console.log('SSU handleRecord', answerRecord, bombTimingData);
        if (answerRecord) {
            questionData.answer = answerRecord;
            questionData.step = Number.MAX_VALUE;
            bombTimingData.remainingTime = answerRecord.time;
        }
    };
    // 补全空记录
    const completeEmptyAnswer = () => {
        while (questionData.answerRecords.length < settingData.questionCount) {
            next();
            questionData.answerRecords.push({
                ...questionData.answer,
                numFlags: [...questionData.answer.numFlags]
            });
        }
    };
    return { questionData, hasNext, next, handleKeyBoard, handleRecord, completeEmptyAnswer };
};
