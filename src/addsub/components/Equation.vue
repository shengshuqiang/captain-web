<!-- 算式绘制组件 -->
<template>
    <canvas
        id="canvas"
        ref="canvas"
    >
        当前浏览器不支持canvas元素，请升级或更换浏览器！
    </canvas>
</template>

<script setup lang="ts">
import { watch, onMounted, ref } from 'vue';
import { buildRem } from '../../utils/utils';

const rem = buildRem();
const props = defineProps({
    isAdd: Boolean,
    step: Number,
    answer: Object
});

const canvas = ref();

let context = null;
let canvasWidth, canvasHeight;
const initCanvas = () => {
    // 获取绘图上下文, 通过判断getContext方法是否存在来判断浏览器的支持性
    context = canvas.value.getContext('2d');
    // 获取 canvas 元素
    //   canvas = document.getElementById('canvas')
    canvasWidth = canvas.value.clientWidth;
    canvasHeight = canvas.value.clientHeight;
    console.log('SSU initCanvas1', { canvas, canvasWidth, canvasHeight });

    // 在 <canvas> 中更正分辨率 https://developer.mozilla.org/zh-CN/docs/Web/API/Window/devicePixelRatio
    const scale = window.devicePixelRatio;
    canvas.value.style.width = `${canvasWidth}px`; // 控制显示大小
    canvas.value.style.height = `${canvasHeight}px`; // 控制显示大小
    canvas.value.width = Math.floor(canvasWidth * scale); // 实际渲染像素
    canvas.value.height = Math.floor(canvasHeight * scale); // 实际渲染像素
    context.scale(scale, scale);
    console.log('SSU initCanvas', { canvas, scale, width: Math.floor(canvasWidth * scale), styleWidth: canvasWidth, canvasWidth, canvasHeight });
};
const normalFontSize = rem(0.52);
const paddingLeft = rem(0.05);
const paddingTop = rem(0.15);
const inputRectPadding = rem(0.05);
const verticalComputeMarginTop = rem(0.5);
const verticalComputeItemPaddingLeft = rem(0.05);
const verticalComputeItemPaddingTop = rem(0.2);
const normalFontStyle = `${normalFontSize}px Arial`;
// 进位标识
const addFlagFontStyle = `bold ${rem(0.3)}px Arial`;
// 退位标识
const subFlagFontStyle = `bold ${rem(0.2)}px Arial`;
const subFlagPadding = rem(0.08);
// 算式分割线宽度和左右延长
const lineWidth = rem(0.05);
const linePadding = rem(0.08);
// 绘制表达式
const drawExpression = ({ numA, numB, numAnswer, numC, isAdd }, drawPosition) => {
    // 完整表达式大小
    const completeExpressionMetrics = context.measureText(`${numA} ${isAdd ? '+' : '-'} ${numB} = ${numA + numB}`);
    // 移动到居中位置
    context.translate((canvasWidth - completeExpressionMetrics.width) / 2, 0);
    context.textAlign = 'left';
    const expression = `${numA} ${isAdd ? '+' : '-'} ${numB} = `;
    const textMetrics = context.measureText(expression);
    const expressionWidth = textMetrics.width;
    const expressionHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    context.fillText(expression, paddingLeft, paddingTop + expressionHeight);

    console.log('canvas textMetrics', textMetrics, {
        context,
        expression,
        numAnswer,
        paddingLeft,
        expressionHeight,
        paddingTop,
        normalFontSize
    });

    let charRectX = paddingLeft + expressionWidth;
    let partAnswer = '';
    const numAnswerStr = `${numAnswer}`;
    const numCStr = `${numC}`;
    for (let i = 0; i < numAnswerStr.length; i++) {
        const char = numAnswerStr.charAt(i);
        const charMetrics = context.measureText(char);
        context.strokeRect(charRectX, paddingTop - inputRectPadding, charMetrics.width, expressionHeight + 2 * inputRectPadding);
        console.log('SSU context.strokeRect', {
            char,
            charMetrics,
            charRectX,
            charRectY: paddingTop - inputRectPadding,
            width: charMetrics.width,
            height: expressionHeight + 2 * inputRectPadding
        });
        if (numCStr.length > i) {
            const numberCChar = numCStr.charAt(i);
            partAnswer += numberCChar;
            context.save();
            if (numAnswerStr.startsWith(partAnswer)) {
                context.fillStyle = 'green';
            } else {
                context.fillStyle = 'red';
            }
            context.fillText(numberCChar, charRectX, paddingTop + expressionHeight);
            context.restore();
        }
        charRectX += charMetrics.width + inputRectPadding;
    }
    drawPosition.y = paddingTop + expressionHeight;
    // context.fillRect(10, normalFontSize, 100, 100);
    console.log('draw', `${numA} + ${numB} = ${numC}`);
};
// 绘制竖式计算步骤
const drawVerticalComputeStep = ({ numA, numB, numC, numAnswer, numFlags, isAdd, step }, drawPosition) => {
    context.textAlign = 'right';
    // 第一行数字a
    const numAStr = `${numA}`.split('').join(' ');
    const numAStrMetrics = context.measureText(numAStr);
    const numAStrHeight = numAStrMetrics.actualBoundingBoxAscent + numAStrMetrics.actualBoundingBoxDescent;

    // 第二行 +数字b，b前面用空格填充，使得是a和b长度最长数字
    const buildFillSpace = (a, b) => {
        const length = `${a}`.length - `${b}`.length;
        if (length > 0) {
            return ' '.repeat(length);
        }
        return '';
    };
    const numBStr = `${isAdd ? '+' : '-'}${buildFillSpace(numA, numB)}${numB}`.split('').join(' ');
    const numBStrMetrics = context.measureText(numBStr);
    const numBStrWidth = numBStrMetrics.width;
    const numBStrHeight = numBStrMetrics.actualBoundingBoxAscent + numBStrMetrics.actualBoundingBoxDescent;

    // 第三行正确结果
    const answerText = `${numAnswer}`.split('').join(' ');
    const answerMetrics = context.measureText(answerText);
    const answerHeight = answerMetrics.actualBoundingBoxAscent + answerMetrics.actualBoundingBoxDescent;
    // 绘制
    const maxWidth = numBStrWidth;
    // 移动到居中位置
    context.translate((canvasWidth - maxWidth) / 2, 0);
    // 绘制进位/退位标记
    const drawSingleFlag = step => {
        if (numFlags[step]) {
            context.save();
            if (isAdd) {
                // 第二行红色 1 进位标记
                const partNumberB = numBStr.slice(-step * 2 + 1);
                const partNumberBWidth = context.measureText(partNumberB).width;
                const x = drawPosition.x - partNumberBWidth;
                context.fillStyle = 'red';
                context.font = addFlagFontStyle;
                const flag = '1';
                console.log('partNumberB', {
                    partNumberB,
                    flags: numFlags,
                    step,
                    x,
                    drawPositionX: drawPosition.x,
                    partNumberBWidth
                });
                context.fillText(flag, x, drawPosition.y + answerHeight);
            } else {
                // 第一行黑色 · 借位标记
                const partNumberA = numAStr.slice(-step * 2 + 1);
                // 进位是打在高位上面
                const partNumberAPlus = numAStr.slice(-(step + 1) * 2 + 1);
                const partNumberAPlusWidth = context.measureText(partNumberAPlus).width;
                let x = drawPosition.x - partNumberAPlusWidth + context.measureText(partNumberAPlus.charAt(0)).width / 2;
                const flag = '●';
                context.fillStyle = 'black';
                context.font = subFlagFontStyle;
                x += context.measureText(flag).width / 2;

                console.log('partNumberA', {
                    partNumberA,
                    flags: numFlags,
                    step,
                    x,
                    drawPositionX: drawPosition.x,
                    partNumberAPlus,
                    partNumberAPlusWidth
                });
                context.fillText(flag, x, drawPosition.y - subFlagPadding);
            }
            context.restore();
        }
    };
    const drawFlag = () => {
        if (step === Number.MAX_VALUE) {
            const allStep = numFlags.length;
            for (let stepIndex = 0; stepIndex < allStep; stepIndex++) {
                drawSingleFlag(stepIndex);
            }
        } else {
            drawSingleFlag(step);
        }
    };

    drawPosition.x = maxWidth + verticalComputeItemPaddingLeft;
    // 第一行数字a，减法处理借位，
    drawPosition.y += verticalComputeMarginTop;
    context.fillText(numAStr, drawPosition.x, drawPosition.y + numAStrHeight);
    if (!isAdd) {
        // 第一行顶部绘制退位标记
        drawFlag();
    }
    // 第二行 +数字b，加法处理进位
    drawPosition.y += verticalComputeItemPaddingTop + numAStrHeight;
    context.fillText(numBStr, drawPosition.x, drawPosition.y + numBStrHeight);
    if (isAdd) {
        // 第二行顶部绘制进位标记
        drawFlag();
    }
    // 横线
    context.save();
    drawPosition.y += verticalComputeItemPaddingTop + numBStrHeight;
    context.beginPath(); // Start a new path
    context.lineWidth = rem(0.05);
    context.moveTo(verticalComputeItemPaddingLeft - linePadding, drawPosition.y); // Move the pen to (30, 50)
    context.lineTo(verticalComputeItemPaddingLeft + maxWidth + linePadding, drawPosition.y); // Draw a line to (150, 100)
    context.stroke(); // Render the path
    context.restore();
    // 第三行结果
    drawPosition.y += verticalComputeItemPaddingTop;
    let partAnswer: string = null;
    if (step === Number.MAX_VALUE) {
        partAnswer = `${numAnswer}`.split('').join(' ');
    } else {
        partAnswer = `${numAnswer}`.split('').reduce((acc, value, index, array) => {
            if (index < array.length - step) {
                return `${acc} _`;
            } else {
                return `${acc} ${value}`;
            }
        }, '');
    }
    console.log('partAnswer', { step, partAnswer, length: answerText.length, answerText });
    context.fillText(partAnswer, drawPosition.x, drawPosition.y + answerHeight);
    // 截取数据覆盖一层，确保数字是绿色的，第一步是黑色"_ 3"，第二步是绿色"  3"，产生黑色"_"绿色"3"
    context.fillStyle = 'green';
    context.fillText(partAnswer.replaceAll('_', ' '), drawPosition.x, drawPosition.y + answerHeight);
};
const draw = ({ numA, numB, numAnswer, numC, numFlags, isAdd, step = 0 }) => {
    console.log('SSU draw', { numA, numB, numC, numFlags, isAdd, step });
    if (!context) {
        console.error('canvas context 为空');
        return;
    }
    // 清空画板
    context.clearRect(0, 0, canvas.value.width, canvas.value.height);
    context.font = normalFontStyle;
    context.fillStyle = 'black';
    const drawPosition = {
        x: paddingLeft,
        y: paddingTop
    };
    context.save();
    drawExpression({ numA, numB, numAnswer, numC, isAdd }, drawPosition);
    context.restore();
    context.save();
    drawVerticalComputeStep({ numA, numB, numAnswer, numC, numFlags, isAdd, step }, drawPosition);
    context.restore();
};
onMounted(() => initCanvas());

watch(
    props,
    ({ answer, isAdd, step }) => {
        draw({
            numA: answer.numA,
            numB: answer.numB,
            numAnswer: answer.numAnswer,
            numC: answer.numC,
            numFlags: answer.numFlags,
            isAdd,
            step
        });
    },
    { immediate: true, deep: true }
);
</script>

<style scoped>
/* 给画布增加一个阴影和圆角的样式 */
#canvas {
    width: calc(100vw - 1rem);
    height: 3rem;
    padding: 0.15rem;
    box-shadow: 0 0 0.05rem #ccc;
    border-radius: 0.08rem;
    margin-top: 0.5rem;
    box-sizing: border-box;
}
</style>
