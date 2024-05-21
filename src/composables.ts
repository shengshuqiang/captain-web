import { reactive } from 'vue';
import Swal from 'sweetalert2';
import { toast } from './utils/utils'
import {
    type DrawInfo, TIME_RADIO_KEY_VALUE_OBJ, QUESTION_RADIO_KEY_VALUE_OBJ,
    type SettingData, type UseSetting,
    type Answer, type UseQuestion, type QuestionsData
} from './constant';


export const useSetting = (newGame: () => void, continueGame: () => void): UseSetting => {
  const data: SettingData = reactive({
    isAdd: true,
    numberRange: 20,
    limitTime: 2 * 60 * 1000,
    questionCount: 20
  })
  const show = () => {
      Swal.fire({
          icon: "info",
          title: "请选择运算类型和范围",
          html: `
            <div
            style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            "
            >
                <div class="swal2-radio" style="display: flex">
                    <label>
                    <input type="radio" name="addSub-radio" id="add" ${(data.isAdd) ? 'checked' : ''}/>
                    <span class="swal2-label">进位加法</span>
                    </label>
                    <label>
                    <input type="radio" name="addSub-radio" id="sub" ${(!data.isAdd) ? 'checked' : ''}/>
                    <span class="swal2-label">退位减法</span>
                    </label>
                </div>
                <select id="range" class="swal2-select" style="display: flex">
                    <option value="" disabled="">请选择</option>
                    <option value="20" ${(data.numberRange === 20) ? 'selected' : ''} >20以内</option>
                    <option value="30" ${(data.numberRange === 30) ? 'selected' : ''}>30以内</option>
                    <option value="40" ${(data.numberRange === 40) ? 'selected' : ''}>40以内</option>
                    <option value="50" ${(data.numberRange === 50) ? 'selected' : ''}>50以内</option>
                    <option value="60" ${(data.numberRange === 60) ? 'selected' : ''}>60以内</option>
                    <option value="80" ${(data.numberRange === 80) ? 'selected' : ''}>80以内</option>
                    <option value="100" ${(data.numberRange === 100) ? 'selected' : ''}>100以内</option>
                </select>
                <div class="swal2-radio" style="display: flex">
                    <label>
                    <input type="radio" name="time-radio" id="time-2min" ${(data.limitTime === 2 * 60 * 1000) ? 'checked' : ''}/>
                    <span class="swal2-label">2分钟</span>
                    </label>
                    <label>
                    <input type="radio" name="time-radio" id="time-5min" ${(data.limitTime === 5 * 60 * 1000) ? 'checked' : ''}/>
                    <span class="swal2-label">5分钟</span>
                    </label>
                    <label>
                    <input type="radio" name="time-radio" id="time-10min" ${(data.limitTime === 10 * 60 * 1000) ? 'checked' : ''}/>
                    <span class="swal2-label">10分钟</span>
                    </label>
                </div>
                <div id="question" class="swal2-radio" style="display: flex" value="question-20">
                    <label>
                    <input type="radio" name="question-radio" id="question-20" ${(data.questionCount === 20) ? 'checked' : ''}/>
                    <span class="swal2-label">20题</span>
                    </label>
                    <label>
                    <input type="radio" name="question-radio" id="question-50" ${(data.questionCount === 50) ? 'checked' : ''}/>
                    <span class="swal2-label">50题</span>
                    </label>
                    <label>
                    <input type="radio" name="question-radio" id="question-100" ${(data.questionCount === 100) ? 'checked' : ''}/>
                    <span class="swal2-label">100题</span>
                    </label>
                </div>
            </div>
        `,
          confirmButtonText: '确认',
          preConfirm: () => {
              const checkedAddSubRadio = document.querySelector('[name=addSub-radio]:checked');
              data.isAdd = checkedAddSubRadio?.id === 'add';
              const rangeSelect = document.querySelector('#range');
              data.numberRange = +(rangeSelect ? rangeSelect.value : '');
              const checkedTimeRadio = document.querySelector('[name=time-radio]:checked');
              data.limitTime = TIME_RADIO_KEY_VALUE_OBJ[checkedTimeRadio?.id || ''];
              const checkedQuestionRadio = document.querySelector('[name=question-radio]:checked');
              data.questionCount = QUESTION_RADIO_KEY_VALUE_OBJ[checkedQuestionRadio?.id || ''];
              
              console.log('SSU Swal.fire', data)
          }
      }).then((result) => {
        if (result.isConfirmed) {
            newGame();
        } else {
            continueGame();
        }
      });;
  }
  return { show, data };
}

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
    const completedScoreDesc = answerRecords.map((answer: Answer) => answer.isRight ? '✅' : '❌').join();
    const lastCount = totalCount - answerRecords.length;
    const unCompletedScoreDesc = lastCount > 0 ? ',' + '🔲'.repeat(lastCount) : '';
    return completedScoreDesc + unCompletedScoreDesc;
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
        data.scoreDesc = buildScoreDesc(data.totalCount, data.answerRecords);
    }
    
    const handleKeyBoard = (key: string, setting: () => void) => {
        console.log('SSU handleKeyBoard', key);
        if (key === 'backspace') {
            // 删除键
            const numCStr = `${data.answer.numC}`.slice(0, -1);
            data.answer.numC = numCStr.length ? +numCStr : '';
        } else if (key === 'forward') {
            if (`${data.answer.numC}`.length < `${data.answer.numAnswer}`.length) {
                toast('请先填写答案');
                return;
            }
            // 下一题
            const totalStep = `${data.answer.numAnswer}`.length;
            const isRight = (data.answer.numAnswer === data.answer.numC)
            if (data.step === 0) {
                data.answerRecords.push({
                    ...data.answer,
                    numFlags: [...data.answer.numFlags],
                });
                data.scoreDesc += buildScoreDesc(data.totalCount, data.answerRecords);
                if (data.totalCount === data.answerRecords.length) {
                    // 答题完成，显示成绩单 TODO
                    setting();
                }
            }
            
            console.log('forward', { step: data.step, totalStep })
            
            const doAnim = () => {
                data.step += 1;
                if (data.step > totalStep) {
                    // 重置
                    data.step = 0;
                    next();
                } else {
                    if (isRight) {
                        setTimeout(doAnim, 1000);
                    }
                }
            }
            doAnim();
        } else {
            data.answer.numC = (+data.answer.numC) * 10 + (+key);
        }
        // 输入完成才可以点击键盘下一步
        data.forwardDisabled = `${data.answer.numC}`.length !== `${data.answer.numAnswer}`.length;
        // 删除键
        data.backspaceDisabled = !`${data.answer.numC}`.length;
        // 数字键
        data.numDisabled = `${data.answer.numC}`.length === `${data.answer.numAnswer}`.length;
    };
    return {data, hasNext, next, resetSetting, handleKeyBoard};
};