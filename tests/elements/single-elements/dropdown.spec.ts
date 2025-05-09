import test, { expect, Page } from "@playwright/test";

test.beforeEach('Before each', async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/elements/dropdown');
});

test('Verify select dropdown', async ({ page }) => {
    await selectDropDown(page, 'Dropdown', '2nd menu item');
    await expect(page.getByText('Value: 2nd menu item').first()).toBeVisible();
});

async function selectDropDown(page: Page, label: string, item: string) {
    let xpath = `(//span[.//text()[normalize-space()='${label}']]/following::button[.//span[contains(concat(' ',normalize-space(@class),' '),' ant-btn-icon ')]])[1]`;
    await page.locator(xpath).hover();
    let itemXpath = `//li[.//text()[normalize-space() = '${item}']]`;
    await page.locator(itemXpath).click();
}