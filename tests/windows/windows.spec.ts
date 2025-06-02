import test, { expect, Page } from "@playwright/test";

test.beforeEach('Before each', async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/windows');
});

test('Verify new tab', async ({ page, context }) => {
    let pageEvent = context.waitForEvent('page');
    await page.getByRole('button', { name: 'Open New Tab' }).click();
    let newTab = await pageEvent;
    await expect(newTab.getByText('Welcome to Test With Me')).toBeVisible();
    await expect(page.getByText('Open New Tab').first()).toBeVisible();
});

test('Verify new popup window', async ({ page }) => {
    let pageEvent = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'Open New Window' }).click();
    let newTab = await pageEvent;
    await expect(newTab.getByText('Welcome to Test With Me')).toBeVisible();
});