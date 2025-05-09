import test, { expect, Page } from "@playwright/test";

test.beforeEach('Before each', async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/elements/radio');
});

test('Verify select radio', async ({ page }) => {
    await selectRadioButton(page, 'Orange');
    await expect(page.getByText('Value: Orange').first()).toBeVisible();
});

async function selectRadioButton(page: Page, label: string) {
    let xpath = `//label[.//input[contains(concat(' ',normalize-space(@class),' '),' ant-radio-input ') and @value='${label}']]`;
    await page.locator(xpath).click();
}