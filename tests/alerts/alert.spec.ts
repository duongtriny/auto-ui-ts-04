import test, { expect, Page } from "@playwright/test";

test.beforeEach('Before each', async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/alerts');
});

test('Verify alert', async ({ page }) => {
    page.on('dialog', async dialog => {
        await page.waitForTimeout(1000);
        await dialog.accept();
    });
    await clickButtonByLabel(page, 'Show Alert');
});

test('Verify alert confirm', async ({ page }) => {
    page.on('dialog', async dialog => {
        await dialog.accept();
    });
    await clickButtonByLabel(page, 'Show Confirm');
    await expect(page.getByText('Selected value: OK')).toBeVisible();
});

test('Verify alert prompt', async ({ page }) => {
    page.on('dialog', async dialog => {
        await dialog.accept("ABC");
    });
    await clickButtonByLabel(page, 'Show Prompt');
    await expect(page.getByText('Entered value: ABC')).toBeVisible();
});

async function clickButtonByLabel(page: Page, label: string) {
    await page.getByRole('button', { name: label }).click();
}