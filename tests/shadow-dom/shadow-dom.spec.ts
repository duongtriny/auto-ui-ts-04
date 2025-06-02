import test, { expect, Page } from "@playwright/test";

test.beforeEach('Before each', async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/shadow-dom');
});

test('Verify shadow DOM', async ({ page, context }) => {
    let myShadow = page.locator("#my-shadow");
    await myShadow.locator("#name-input").fill("Test With Me!");
    await myShadow.getByRole('button', { name: 'Submit' }).click();
    await expect(myShadow.getByText("What you just type: Test With Me!")).toBeVisible();
});
