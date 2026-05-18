const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'he-IL' });
  const page = await ctx.newPage();
  await page.goto('https://dogame.pages.dev/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(4000);

  // Probe for the 01 / 02 / 03 in the How section
  const howNumbers = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    const target = sections.find((s) => s.textContent && s.textContent.includes('שלושה שלבים'));
    if (!target) return null;
    const items = Array.from(target.querySelectorAll('.tabular-nums'));
    return items.map((el) => {
      const rect = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      return { text: el.textContent, opacity: cs.opacity, y: rect.top + window.scrollY, transform: cs.transform };
    });
  });
  console.log('HOW NUMBERS:', JSON.stringify(howNumbers, null, 2));

  // Scroll to How section
  await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    const target = sections.find((s) => s.textContent && s.textContent.includes('שלושה שלבים'));
    if (target) target.scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'audit-shots/how-section-desktop.png', fullPage: false });
  console.log('OK how section');

  await ctx.close();
  await browser.close();
})();
