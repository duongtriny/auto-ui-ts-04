import test, { expect, Page } from "@playwright/test";

test.beforeEach('Before each', async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/components/cascader');
});

test('Verify select Cascader', async ({ page }) => {
    let input = 'Test>With>You';
    await selectCascaderByLabel(page, 'Cascader', input);
    await expect(page.getByText('Current value: Test, With, You')).toBeVisible();
});

async function selectCascaderByLabel(page: Page, label: string, input: string) {
    let cascaderXpath = `(//span[.//text()[normalize-space()='${label}']]/following::div[contains(concat(' ', normalize-space(@class), ' '), 'ant-select-selector')])[1]`;
    await page.locator(cascaderXpath).click();
    let items = input.split('>');
    for (let item of items) {
        let itemXpath = `//li[@role='menuitemcheckbox' and .//div[normalize-space()= '${item.trim()}']]`;
        await page.locator(itemXpath).click();
    }
}

test('Verify select Cascader multiple value', async ({ page }) => {
    let input = 'Light>Number 1-Number 3';
    let input2 = 'Bamboo>Little';
    await selectCascaderMultipleValueByLabel(page, 'Cascader multiple values', input);
    await selectCascaderMultipleValueByLabel(page, 'Cascader multiple values', input);

    await expect(page.getByText('Current value:').first()).toBeVisible();

});

async function selectCascaderMultipleValueByLabel(page: Page, label: string, input: string) {
    let cascaderXpath = `(//span[.//text()[normalize-space()='${label}']]/following::div[contains(concat(' ', normalize-space(@class), ' '), 'ant-select-selector')])[1]`;
    await page.locator(cascaderXpath).click();
    let parentItems = input.split('>');
    for (let i = 0; i < parentItems.length; i++) {
        if (i == parentItems.length - 1) {
            let items = parentItems[i].split('-');
            for (let item of items) {
                let itemXpath = `//li[@role='menuitemcheckbox' and .//div[normalize-space()= '${item.trim()}']]`;
                let itemXpathLocator = page.locator(itemXpath);
                let checkboxLocator = itemXpathLocator.locator('.ant-cascader-checkbox');
                let className = await checkboxLocator.getAttribute('class');
                if (!className?.split(' ').includes('ant-cascader-checkbox-checked')) {
                    await checkboxLocator.click();
                }
            }
        } else {
            let parentItemXpath = `//li[@role='menuitemcheckbox' and .//div[normalize-space()= '${parentItems[i].trim()}']]`;
            await page.locator(parentItemXpath).click();
        }
    }
    await page.keyboard.press('Tab');
}