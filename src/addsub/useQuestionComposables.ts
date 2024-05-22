import { reactive } from 'vue';
import { toast } from '../utils/utils'
import {
    type SettingData,
    type Answer, type UseQuestion, type QuestionsData
} from './constant';
/**
 * 问题集组合式函数
 */
/**
 * 产生运算范围内数据数组
 * @param limitNum
 * @param isAdd
 * @returns
 */
export const produceLimitNumArray = (limitNum: number, isAdd: boolean) => {
    // limit Num 以内加法，a + b 情况是 a 或 b 都可以是 0 ～ limitNum，故总数是 (limitNum + 1) * (limitNum + 1)
    // limit Num 以内减法，a - b 情况是 a 或 b 都可以是 0 ～ limitNum 且 a >= b，故总数是 ((limitNum + 1) * (limitNum + 1) - (limitNum + 1)) / 2 + (limitNum + 1)
    const answeredCollectionQuestions: boolean[] = [];
    if (isAdd) {
        answeredCollectionQuestions.length = (limitNum + 1) * (limitNum + 1);
    } else {
        answeredCollectionQuestions.length = ((limitNum + 1) * (limitNum + 2)) / 2;
    }
    answeredCollectionQuestions.fill(false);
    return answeredCollectionQuestions;
}
  
/**
 * 产生范围内随机数
 * @param limit
 * @returns
 */
export const produceRandomInt = (limit: number) => {
    return Math.floor(Math.random() * limit);
}

// 构建得分描述
const buildScoreDesc = (totalCount: number, answerRecords: Answer[]) => {
    const completedScoreDesc = answerRecords.map((answer: Answer) => answer.isRight ? '✔️' : '❌').join('');
    const lastCount = totalCount - answerRecords.length;
    const unCompletedScoreDesc = lastCount > 0 ? '◯'.repeat(lastCount) : '';
    console.log('SSU buildScoreDesc', {completedScoreDesc, unCompletedScoreDesc});
    return `${completedScoreDesc}${unCompletedScoreDesc}`;
}
export const useQuestion = (): UseQuestion => {
    let settingData2: SettingData | null = null;
    const data: QuestionsData = reactive({
        totalCount: 0,
        answeredCollectionQuestions: [],
        answer: {
            numA: '',
            numB: '',
            numAnswer: '',
            numC: '',
            // 进位/借位标识
            numFlags: [],
            isRight: false,
        },
        step: 0,
        answerRecords: [],
        scoreDesc: '',
        scoreTitle: '',
        backspaceDisabled: true,
        forwardDisabled: true,
        keyDisabled: false,
    });
    // 是否还有下一题
    const hasNext = () => {
        const result = data.answeredCollectionQuestions.some(completedQuestion => {
            console.log('SSU answeredCollectionQuestions.some', completedQuestion, !completedQuestion);
            return !completedQuestion;
        });
        console.log('SSU hasNext', { 
            answeredCollectionQuestions: data.answeredCollectionQuestions,
            length: data.answeredCollectionQuestions.length,
            result 
        });
        return result;
    }
    // 下一题，更新 data.numA 和 data.numB
    const next = () => {
        let randomInt = produceRandomInt(data.answeredCollectionQuestions.length);
        while (data.answeredCollectionQuestions[randomInt]) {
            randomInt = (randomInt + 1) % data.answeredCollectionQuestions.length;
        }
        const numberRange = settingData2?.numberRange || -1;
        data.answer.numA = randomInt % numberRange;
        data.answer.numB = Math.floor(randomInt / numberRange);
        data.answer.numAnswer = data.answer.numA + data.answer.numB;
        data.step = 0;
        data.answer.numFlags = `${data.answer.numAnswer}`.split('').reduce((acc: boolean[], val, index, array) => {
            const numAPart = `${data.answer.numA}`.slice(-index - 1);
            const numBPart = `${data.answer.numB}`.slice(-index - 1);
            const sum = `${(+numAPart) + (+numBPart)}`;
            // 标记进位，避免 7 + 8 第二位也判断进位
            acc[array.length - index - 1] = (numAPart.length > index && numBPart.length > index && sum.length > Math.max(numAPart.length, numBPart.length));
            console.log('number.flags', { sum, numA: data.answer.numA, numAPart, numB: data.answer.numB, numBPart, acc, curIndex: (sum.length - index - 1), val, index, flag: acc[index] });
            return acc;
        }, []);
        data.answer.numC = '';
        console.log('next', { randomInt, questionData: data, settingData2 });
    }
    const resetSetting = (settingData: SettingData) => {
        settingData2 = settingData;
        
        data.totalCount = settingData.questionCount;
        data.answeredCollectionQuestions = produceLimitNumArray(settingData.numberRange, settingData.isAdd),
        data.answer.numA = '';
        data.answer.numB = '';
        data.answer.numAnswer = '';
        data.answer.numC = '';
        data.answer.numFlags.length = 0;
        data.answer.isRight = false;
        data.step = 0;
        data.answerRecords.length = 0;
        data.scoreTitle = `0/${data.totalCount}`;
        data.scoreDesc = buildScoreDesc(data.totalCount, data.answerRecords);
    }
    
    const handleKeyBoard = (key: string, setting: () => void) => {
        console.log('SSU handleKeyBoard', key);
        if (key === 'backspace') {
            // 删除键
            const numCStr = `${data.answer.numC}`.slice(0, -1);
            data.answer.numC = numCStr.length ? +numCStr : '';
            // 键盘状态
            // 输入完成才可以点击键盘下一步
            data.forwardDisabled = `${data.answer.numC}`.length !== `${data.answer.numAnswer}`.length;
            // 删除键
            data.backspaceDisabled = !`${data.answer.numC}`.length;
            // 数字键
            data.numDisabled = `${data.answer.numC}`.length === `${data.answer.numAnswer}`.length;
        } else if (key === 'forward') {
            if (`${data.answer.numC}`.length < `${data.answer.numAnswer}`.length) {
                toast('请先填写答案');
                return;
            }
            // 下一步
            // 答题结束，不可以删除
            data.backspaceDisabled = true;
            const totalStep = `${data.answer.numAnswer}`.length;
            data.answer.isRight = (data.answer.numAnswer === data.answer.numC);
            if (data.step === 0) {
                data.answerRecords.push({
                    ...data.answer,
                    numFlags: [...data.answer.numFlags],
                });
                data.scoreTitle = `${data.answerRecords.length}/${data.totalCount}`;
                data.scoreDesc = buildScoreDesc(data.totalCount, data.answerRecords);
                if (data.totalCount === data.answerRecords.length) {
                    // 答题完成，显示成绩单
                    // setting();
                }

                if (data.answer.isRight) {
                    // 答案正确则自动播放运算过程，将➡️不可点击
                    data.forwardDisabled = true;
                }
            }
            
            console.log('forward', { step: data.step, totalStep })
            
            const doAnim = () => {
                data.step += 1;
                if (data.step > totalStep) {
                    // 下一题
                    next();
                    // 键盘状态
                    // 输入完成才可以点击键盘下一步
                    data.forwardDisabled = `${data.answer.numC}`.length !== `${data.answer.numAnswer}`.length;
                    // 删除键
                    data.backspaceDisabled = !`${data.answer.numC}`.length;
                    // 数字键
                    data.numDisabled = `${data.answer.numC}`.length === `${data.answer.numAnswer}`.length;
                } else {
                    if (data.answer.isRight) {
                        setTimeout(doAnim, 1000);
                    }
                }
            }
            doAnim();
        } else {
            // 输入数字
            data.answer.numC = (+data.answer.numC) * 10 + (+key);
            // 键盘状态
            // 输入完成才可以点击键盘下一步
            data.forwardDisabled = `${data.answer.numC}`.length !== `${data.answer.numAnswer}`.length;
            // 删除键
            data.backspaceDisabled = !`${data.answer.numC}`.length;
            // 数字键
            data.numDisabled = `${data.answer.numC}`.length === `${data.answer.numAnswer}`.length;
        }
    };
    const handleRecord = (answerRecord: Answer) => {
        data.answer = answerRecord;
        data.step = Number.MAX_VALUE;
    }
    return {data, hasNext, next, resetSetting, handleKeyBoard, handleRecord};
};