import test, { expect, Page } from "@playwright/test";

test.beforeEach('Before each', async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/components/transfer');
});
test(`Verify transfer`, async ({ page }) => {
    let sourceData = ['Apple', 'Banana', 'Kiwi'];
    let targetData = ['Orange', 'Pineapple', 'Strawberry'];

    //Move from source to target
    await moveItemsFromSourceToTarget(page, 'Transfer', ['Apple', 'Banana']);
    //Verify source
    let sourceXpath = `(//span[.//text()[normalize-space()='Transfer']]/following::div[contains(concat(' ', normalize-space(@class), ' '), 'ant-transfer-list') and .//span[normalize-space()='Source']]//ul)[1]`;
    let sourceLocator = page.locator(sourceXpath);
    let actualItems = await sourceLocator.allTextContents();
    actualItems = actualItems.map(value => value.trim());
    let expectedSource = ['Kiwi'];
    expect(actualItems.length).toBe(expectedSource.length);
    expect(actualItems).toEqual(expect.arrayContaining(expectedSource));
    expect(expectedSource).toEqual(expect.arrayContaining(actualItems));

    //Verify target

    //Move  'Pineapple', 'Strawberry' to source

    //Verify source

    //Verify target

    await page.waitForTimeout(1000);
});

async function moveItemsFromSourceToTarget(page: Page, label: string, items: string[]) {
    let sourceXpath = `(//span[.//text()[normalize-space()='${label}']]/following::div[contains(concat(' ', normalize-space(@class), ' '), 'ant-transfer-list') and .//span[normalize-space()='Source']]//ul)[1]`;
    let sourceLocator = page.locator(sourceXpath);

    for (let item of items) {
        let itemXpath = `//li[.//span[normalize-space() = '${item}']]`;
        await sourceLocator.locator(itemXpath).click();
    }
    let buttonMoveToTargetXpath = `(//span[.//text()[normalize-space()='${label}']]/following::button[.//span[@aria-label='right']])[1]`;
    await page.locator(buttonMoveToTargetXpath).click();
}

async function moveItemsFromTargetToSource(page: Page, label: string, items: string[]) {
    let targetXpath = ``;
    let targetLocator = page.locator(targetXpath);

    for (let item of items) {
        let itemXpath = ``;
        await targetLocator.locator(itemXpath).click();
    }
    let buttonMoveToSourceXpath = ``;
    await page.locator(buttonMoveToSourceXpath).click();
}