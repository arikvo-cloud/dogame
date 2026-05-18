const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const url = 'https://dogame.pages.dev';
  const views = [
    { name: 'home-mobile', viewport: { width: 390, height: 844 }, ua: 'mobile' },
    { name: 'home-desktop', viewport: { width: 1440, height: 900 } },
    { name: 'quiz-mobile', viewport: { width: 390, height: 844 }, path: '/quiz' },
    { name: 'breed-mobile', viewport: { width: 390, height: 844 }, path: '/breed/golden' },
    { name: 'breeds-mobile', viewport: { width: 390, height: 844 }, path: '/breeds' },
  ];
  for (const v of views) {
    const ctx = await browser.newContext({ viewport: v.viewport, deviceScaleFactor: 2, locale: 'he-IL' });
    const page = await ctx.newPage();
    const full = url + (v.path || '/');
    try {
      await page.goto(full, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(4000);
      await page.screenshot({ path: `audit-shots/${v.name}.png`, fullPage: false });
      console.log('OK', v.name, full);
    } catch (e) {
      console.log('FAIL', v.name, e.message);
    }
    await ctx.close();
  }
  await browser.close();
})();
