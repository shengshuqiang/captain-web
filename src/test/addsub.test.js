// sum.test.js
import { expect, test } from 'vitest';
/** node src/test/test.js */
import { getAddABEquation, getSubABEquation, produceRandomInt } from '../utils/utils';
const testAdd = function (n) {
    const { count, getABByIndex } = getAddABEquation(n);
    console.log(`${n}以内加法算式数量${count}`);
    // for(let index = 0; index < count; index ++) {
    //     const {numA, numB} = getABByIndex(index);
    //     console.log(`${index}: ${numA} + ${numB}`);
    // }
    const set = new Set();
    while (set.size !== count) {
        let randomInt = produceRandomInt(count);
        while (set.has(randomInt)) {
            randomInt = (randomInt + 1) % count;
        }
        set.add(randomInt);

        const { numA, numB } = getABByIndex(randomInt);
        console.log(`${randomInt}: ${numA} + ${numB}`);
    }
    console.log(`${count} === ${set.size}`);
    return count;
};

test('打印n以内的加法运算', () => {
    expect(testAdd(10)).toBe(121);
});

const testSub = function (n) {
    const { count, getABByIndex } = getSubABEquation(n);
    console.log(`${n}以内减法算式数量${count}`);
    for (let index = 0; index < count; index++) {
        const { numA, numB } = getABByIndex(index);
        if (numA < numB) {
            console.error(`${index}: ${numA} - ${numB}`);
        } else {
            console.log(`${index}: ${numA} - ${numB}`);
        }
    }
    return count;
};
test('打印n以内的减法法运算', () => {
    expect(testSub(10)).toBe(66);
});
