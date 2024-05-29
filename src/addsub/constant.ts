/**
 * 时间单选框 key value 结构
 */
export interface TimeRadioKeyValueObj {
    [key: string]: number;
}
/**
 * 设置弹窗组合式函数
 */
export const TIME_RADIO_KEY_VALUE_OBJ: TimeRadioKeyValueObj = {
    'time-2min': 2 * 60 * 1000,
    'time-5min': 5 * 60 * 1000,
    'time-10min': 10 * 60 * 1000
};
export interface QuestionRadioKeyValueObj {
    [key: string]: number;
}
export const QUESTION_RADIO_KEY_VALUE_OBJ: QuestionRadioKeyValueObj = {
    'question-20': 20,
    'question-50': 50,
    'question-100': 100
};
export interface SettingData {
    isAdd: boolean;
    numberRange: number;
    limitTime: number;
    questionCount: number;
    reset: boolean;
}
export interface UseSetting {
    settingData: SettingData;
    showSetting: () => void;
}

export interface Answer {
    // numA + numB = numC（用户输入答案，不一定对）
    numA: number | '';
    numB: number | '';
    numAnswer: number | '';
    numC: number | '';
    // 进位/借位标识
    numFlags: boolean[];
    // 是否正确
    isRight: boolean;
    // 耗时
    time: number;
}
export interface QuestionsData {
    // 完成答题全集标记，当前要答20题，但是题集可能有200多题，完成 true，避免题目重复
    // 题库答题记录
    bankAnswerNumSet: Set<number>;
    // 当前答题
    answer: Answer;
    // 当前答题竖式计算步骤
    step: number;
    // 答题记录
    answerRecords: Answer[];
    // 得分信息
    scoreTitle: string;
    scoreDesc: string;
    // 键盘➡️是否可点击，数字输入完成才可以点
    forwardDisabled: boolean;
    backspaceDisabled: boolean;
    numDisabled: boolean;
    // 是否答题结束
    finished: boolean;
}
export interface UseQuestion {
    questionData: QuestionsData;
    hasNext: () => boolean;
    next: () => void;
    handleKeyBoard: (key: string, setting: () => void) => void;
    handleRecord: (answer: Answer) => void;
}

// 炸弹数据
export interface BombTimingData {
    bombTiming: boolean;
    bombAnim: boolean;
    remainingTime: number;
}
