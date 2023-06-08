/*
 * @Author: liaoyh liaoyh@gl.com
 * @Date: 2023-03-15 10:05:35
 * @LastEditors: liaoyh liaoyh@gl.com
 * @LastEditTime: 2023-03-15 10:56:24
 * @FilePath: \BM.Web.CIMS\tests\foo.spec.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { test, chromium } from '@playwright/test';

test('basic test', async ({ page }) => {
  const browser = await chromium.launch({ headless: false });
  // const page = await browser.newPage();
  await page.goto('https://www.baidu.com');
});
