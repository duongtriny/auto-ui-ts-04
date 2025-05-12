import test, { expect, Page } from "@playwright/test";

test.beforeEach('Before each', async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/components/auto-complete');
});

test('Verify select auto complete', async ({ page }) => {
    await selectAutoComplete(page, 'Auto complete', 'Downing Street');
    await expect(page.getByText('Value: Downing Street was selected!')).toBeVisible();
});

async function selectAutoComplete(page: Page, label: string, item: string) {
    let autoCompleteXpath = `(//span[.//text()[normalize-space()='${label}']]/following::input[contains(concat(' ',normalize-space(@class),' '),' ant-select-selection-search-input ')])[1]`;
    await page.locator(autoCompleteXpath).click();
    await page.locator(autoCompleteXpath).fill(item);
    let itemXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-select-item-option ') and @title = '${item}']`;
    await page.locator(itemXpath).click();
}