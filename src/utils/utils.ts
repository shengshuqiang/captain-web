import Swal from 'sweetalert2';

export const buildRem = () => {
    const remSize = window.parseFloat(getComputedStyle(document.documentElement).fontSize);
    const ratio = 100 / remSize;
    console.log({ ratio, devicePixelRatio: window.devicePixelRatio, remSize });
    const rem = (num: number) => num * remSize;
    return rem;
};

/**
 * 将 num 转换为每位数字数组，如 99 => [9, 9]
 * @param num
 * @returns
 */
const buildNumArr = (num: number): number[] => {
    if (Number.isInteger(num)) {
        const numArr = [];
        while (num > 0) {
            numArr.push(num % 10);
            num = Math.floor(num / 10);
        }
        return numArr;
    }
    console.error('不支持小数');
    return [];
};
/**
 * numA + numB 进位数组
 * 99 + 1 返回 [false, true, true]
 * @param numA
 * @param numB
 * @returns
 */
export const addABFlags = (numA: number, numB: number) => {
    const numAArr = buildNumArr(numA);
    const numBArr = buildNumArr(numB);
    const maxLength = Math.max(numAArr.length, numBArr.length);

    // 第一位不会进位，拿false占位
    const flags = [false];
    let partNumA = 0;
    let partNumB = 0;
    let partMax = 1;
    for (let index = 0; index < maxLength; index++) {
        partNumA += (index < numAArr.length ? numAArr[index] : 0) * partMax;
        partNumB += (index < numBArr.length ? numBArr[index] : 0) * partMax;
        partMax *= 10;
        if (partNumA + partNumB >= partMax) {
            flags.push(true);
        } else {
            flags.push(false);
        }
    }
    console.log('SSU addABFlags', { numAArr, numBArr, maxLength, flags });
    return flags;
};

/**
 * numA - numB 退位
 * 100 - 1 返回 [false, true, true, false]
 * @param numA
 * @param numB
 */
export const subABFlags = (numA: number, numB: number) => {
    const numAArr = buildNumArr(numA);
    const numBArr = buildNumArr(numB);
    // 第一位不会借位，拿false占位
    const flags = [false];
    let partNumA = 0;
    let partNumB = 0;
    let partMax = 1;
    for (let index = 0; index < numAArr.length; index++) {
        partNumA += numAArr[index] * partMax;
        partNumB += (index < numBArr.length ? numBArr[index] : 0) * partMax;
        partMax *= 10;
        console.log('SSU subABFlags', { index, partNumA, partNumB, aGb: partNumA - partNumB });
        if (partNumA - partNumB < 0) {
            flags.push(true);
        } else {
            flags.push(false);
        }
    }
    console.log('SSU subABFlags', { numAArr, numBArr, flags });
    return flags;
};

export const ToastDialog = Swal.mixin({
    toast: true,
    // position: "top-end",
    showConfirmButton: false,
    timer: 1000,
    timerProgressBar: true,
    didOpen: toast => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});
export const toast = (msg: string) => {
    ToastDialog.fire({
        icon: 'warning',
        title: msg
    });
};

/**
 * 获取 numberRange 以内加法算式
 * a + b 均可取值 0, 1, ... numberRange 共 (numberRange + 1) 个数
 * @param numberRange
 * @param index
 * @returns
 */
export const getAddABEquation = (numberRange: number) => ({
    // 算式总数
    count: (numberRange + 1) * (numberRange + 1),
    getABByIndex: (index: number) => ({
        numA: index % (numberRange + 1),
        numB: Math.floor(index / (numberRange + 1))
    })
});

/**
 * 产生范围内随机数
 * @param limit
 * @returns
 */
export const produceRandomInt = (limit: number) => {
    return Math.floor(Math.random() * limit);
};
/**
 * 获取 numberRange 以内减法算式
 * @param numberRange
 * @param index
 * @returns
 */
export const getSubABEquation = (numberRange: number) => ({
    // 算式总数，a - b 均可取值 0, 1, ... n 且 a >= b，总个数对应 1 到 (n + 1) 的等差数列，共 (1 + (n + 1)) * (n + 1) 个数
    count: ((1 + (numberRange + 1)) * (numberRange + 1)) / 2,
    getABByIndex: (index: number) => {
        // (1 + n) * n / 2 = x, 求解得 n = Math.sqrt(2 * x + 1/4) - 1/2
        const n = Math.sqrt(2 * index + 1 / 4) - 1 / 2;
        let numA, numB;
        if (Number.isInteger(n)) {
            numA = n;
            numB = n;
        } else {
            const m = Math.floor(n);
            numA = m + 1;
            numB = index - ((1 + m) * m) / 2;
        }
        return {
            numA,
            numB
        };
    }
});

// export const toast = (msg: string) => {
//   // 参考开源轻量级toast https://www.npmjs.com/package/autolog.js
//   ((text, type = '', time = 2500) => {
//     const cssStr = `#autolog{display:flex;flex-direction:column;align-items:center;justify-content:flex-start;pointer-events:none;width:100vw;height:100vh;position:fixed;left:0;top:.32rem;z-index:9999999;cursor:pointer;transition:0.2s}#autolog span{pointer-events:auto;width:max-content;animation:fadein 0.4s;animation-delay:0s;border-radius:6px;padding:10px 20px;box-shadow:0 0 10px 6px rgba(0,0,0,0.1);margin:4px;transition:0.2s;z-index:9999999;font-size: .32rem;display:flex;align-items:center;justify-content:center;gap:4px;height:max-content}#autolog span.hide{opacity:0;pointer-events:none;transform:translateY(-10px);height:0;padding:0;margin:0}.autolog-warn{background-color:#fffaec;color:#e29505}.autolog-error{background-color:#fde7e7;color:#d93025}.autolog-info{background-color:#e6f7ff;color:#0e6eb8}.autolog-success{background-color:#e9f7e7;color:#1a9e2c}.autolog-{background-color:#fafafa;color:#333}@keyframes fadein{0%{opacity:0;transform:translateY(-10px)}100%{opacity:1;transform:translateY(0)}}`
//     const svgIcons: object = {
//         warn: `<svg t="1713405237257" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2387" xmlns:xlink="http://www.w3.org/1999/xlink" width=".32rem" height=".32rem"><path d="M934.4 770.133333L605.866667 181.333333C586.666667 147.2 550.4 128 512 128c-38.4 0-74.666667 21.333333-93.866667 53.333333L89.6 770.133333c-19.2 34.133333-19.2 76.8 0 110.933334S145.066667 938.666667 183.466667 938.666667h657.066666c38.4 0 74.666667-21.333333 93.866667-57.6 19.2-34.133333 19.2-76.8 0-110.933334z m-55.466667 81.066667c-8.533333 14.933333-23.466667 23.466667-38.4 23.466667H183.466667c-14.933333 0-29.866667-8.533333-38.4-23.466667-8.533333-14.933333-8.533333-34.133333 0-49.066667L473.6 213.333333c8.533333-12.8 23.466667-21.333333 38.4-21.333333s29.866667 8.533333 38.4 21.333333l328.533333 588.8c8.533333 14.933333 8.533333 32 0 49.066667z" fill="#e29505" p-id="2388"></path><path d="M512 746.666667m-42.666667 0a42.666667 42.666667 0 1 0 85.333334 0 42.666667 42.666667 0 1 0-85.333334 0Z" fill="#e29505" p-id="2389"></path><path d="M512 629.333333c17.066667 0 32-14.933333 32-32v-192c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v192c0 17.066667 14.933333 32 32 32z" fill="#e29505" p-id="2390"></path></svg>`,
//         error: `<svg t="1713405212725" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1744" xmlns:xlink="http://www.w3.org/1999/xlink" width=".32rem" height=".32rem"><path d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m0 810.666666c-204.8 0-373.333333-168.533333-373.333333-373.333333S307.2 138.666667 512 138.666667 885.333333 307.2 885.333333 512 716.8 885.333333 512 885.333333z" fill="#d93025" p-id="1745"></path><path d="M657.066667 360.533333c-12.8-12.8-32-12.8-44.8 0l-102.4 102.4-102.4-102.4c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l102.4 102.4-102.4 102.4c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466666 8.533334s17.066667-2.133333 23.466667-8.533334l102.4-102.4 102.4 102.4c6.4 6.4 14.933333 8.533333 23.466667 8.533334s17.066667-2.133333 23.466666-8.533334c12.8-12.8 12.8-32 0-44.8l-106.666666-100.266666 102.4-102.4c12.8-12.8 12.8-34.133333 0-46.933334z" fill="#d93025" p-id="1746"></path></svg>`,
//         info: `<svg t="1713405208589" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1582" xmlns:xlink="http://www.w3.org/1999/xlink" width=".32rem" height=".32rem"><path d="M853.333333 138.666667H170.666667c-40.533333 0-74.666667 34.133333-74.666667 74.666666v512c0 40.533333 34.133333 74.666667 74.666667 74.666667h151.466666V917.333333c0 12.8 8.533333 25.6 19.2 29.866667 4.266667 2.133333 8.533333 2.133333 12.8 2.133333 8.533333 0 17.066667-4.266667 23.466667-10.666666l136.533333-138.666667H853.333333c40.533333 0 74.666667-34.133333 74.666667-74.666667V213.333333c0-40.533333-34.133333-74.666667-74.666667-74.666666z m10.666667 586.666666c0 6.4-4.266667 10.666667-10.666667 10.666667H501.333333c-8.533333 0-17.066667 4.266667-23.466666 10.666667l-89.6 93.866666V768c0-17.066667-14.933333-32-32-32H170.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667V213.333333c0-6.4 4.266667-10.666667 10.666667-10.666666h682.666666c6.4 0 10.666667 4.266667 10.666667 10.666666v512z" fill="#0e6eb8" p-id="1583"></path><path d="M512 490.666667H298.666667c-17.066667 0-32 14.933333-32 32S281.6 554.666667 298.666667 554.666667h213.333333c17.066667 0 32-14.933333 32-32S529.066667 490.666667 512 490.666667zM672 341.333333H298.666667c-17.066667 0-32 14.933333-32 32S281.6 405.333333 298.666667 405.333333h373.333333c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32z" fill="#0e6eb8" p-id="1584"></path></svg>`,
//         success: `<svg t="1713405224326" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2225" xmlns:xlink="http://www.w3.org/1999/xlink" width=".32rem" height=".32rem"><path d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m0 810.666666c-204.8 0-373.333333-168.533333-373.333333-373.333333S307.2 138.666667 512 138.666667 885.333333 307.2 885.333333 512 716.8 885.333333 512 885.333333z" fill="#1a9e2c" p-id="2226"></path><path d="M701.866667 381.866667L448 637.866667 322.133333 512c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l149.333334 149.333333c6.4 6.4 14.933333 8.533333 23.466666 8.533334s17.066667-2.133333 23.466667-8.533334l277.333333-277.333333c12.8-12.8 12.8-32 0-44.8-14.933333-12.8-36.266667-12.8-49.066666-2.133333z" fill="#1a9e2c" p-id="2227"></path></svg>`,
//         '': ''
//     }
//     const autolog = {
//       log(text: string, type: string = '', time: number = 2500) {
//         if (typeof type === 'number') {
//           time = type
//           type = ''
//         }
//         const mainEl = getMainElement()
//         let el: any = document.createElement('span')
//         el.className = `autolog-${type}`
//         el.innerHTML = svgIcons[type] + text
//         mainEl.appendChild(el)
//         setTimeout(() => {
//           el.classList.add('hide')
//         }, time - 500)
//         setTimeout(() => {
//           mainEl.removeChild(el)
//           el = null
//         }, time)
//       }
//     }
//     function getMainElement() {
//       let mainEl = document.querySelector('#autolog')
//       if (!mainEl) {
//         mainEl = document.createElement('div')
//         mainEl.id = 'autolog'
//         document.body.appendChild(mainEl)
//         const style = document.createElement('style')
//         style.innerHTML = cssStr
//         document.head.insertBefore(style, document.head.firstChild)
//       }
//       return mainEl
//     }

//     autolog.log(text, type, time)
//   })(msg, 'warn')
// }
