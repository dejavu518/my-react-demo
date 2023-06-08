/*
 * @Author: dejavu518 cf_1118sab@163.com
 * @Date: 2023-06-06 10:37:58
 * @LastEditors: dejavu518 cf_1118sab@163.com
 * @LastEditTime: 2023-06-06 10:38:08
 * @FilePath: \BM.Web.CIMS\tests\sum.test.js
 * @Description:
 */
const sum = require('./sum');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});
