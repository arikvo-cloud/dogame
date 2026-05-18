const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const url = 'https://dogame.pages.dev';
  const views = [
    { name: 'home-mobile-scroll1', viewport: { width: 390, height: 844 }, scroll: 800 },
    { name: 'home-mobile-scroll2', viewport: { width: 390, height: 844 }, scroll: 1700 },
    { name: 'home-mobile-scroll3', viewport: { width: 390, height: 844 }, scroll: 2800 },
    { name: 'home-mobile-bottom', viewport: { width: 390, height: 844 }, scroll: 9000 },
    { name: 'home-desktop-scroll1', viewport: { width: 1440, height: 900 }, scroll: 800 },
    { name: 'home-desktop-scroll2', viewport: { width: 1440, height: 900 }, scroll: 2000 },
    { name: 'home-desktop-scroll3', viewport: { width: 1440, height: 900 }, scroll: 3500 },
    { name: 'breed-mobile-scroll1', viewport: { width: 390, height: 844 }, path: '/breed/golden', scroll: 700 },
    { name: 'breed-mobile-scroll2', viewport: { width: 390, height: 844 }, path: '/breed/golden', scroll: 1800 },
    { name: 'result-mobile', viewport: { width: 390, height: 844 }, path: '/quiz' },
  ];
  for (const v of views) {
    const ctx = await browser.newContext({ viewport: v.viewport, deviceScaleFactor: 2, locale: 'he-IL' });
    const page = await ctx.newPage();
    const full = url + (v.path || '/');
    try {
      await page.goto(full, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(3000);
      if (v.scroll) {
        await page.evaluate((s) => window.scrollTo({ top: s, behavior: 'instant' }), v.scroll);
        await page.waitForTimeout(800);
      }
      await page.screenshot({ path: `audit-shots/${v.name}.png`, fullPage: false });
      console.log('OK', v.name);
    } catch (e) {
      console.log('FAIL', v.name, e.message);
    }
    await ctx.close();
  }
  await browser.close();
})();
