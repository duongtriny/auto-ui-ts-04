import test, { expect, Page } from "@playwright/test";

test.beforeEach('Before each', async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/frames');
});

test('Verify iframe', async ({ page }) => {
    const iframe = page.locator(`//iframe[@title='Example Frame']`).contentFrame();
    await iframe.getByText('API Automation Java/JS').click();
    await expect(iframe.getByText('Nâng tầm kỹ năng kiểm thử, chinh phục đỉnh cao sự nghiệp với khóa học API Automation Testing chuyên sâu.')).toBeVisible();
});