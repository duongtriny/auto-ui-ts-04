import test, { expect, Page } from "@playwright/test";

test.beforeEach('Before each', async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/elements/button');
});

let buttons = ['Origin button', 'Default', 'Primary'];
for (let button of buttons) {
    test(`Test button: ${button}`, async ({ page }) => {
        await clickButton(page, button);
        await expect(page.getByText(`Button ${button} was clicked!`)).toBeVisible();
    });
}


test('Test role button', async ({ page }) => {
    await clickRoleButton(page, 'Div button');
    await expect(page.getByText('Button Div button was clicked!')).toBeVisible();
});

test('Test input button', async ({ page }) => {
    await clickInputButton(page, 'Input button');
    await expect(page.getByText('Button Input button was clicked!')).toBeVisible();
})

async function clickButton(page: Page, label: string) {
    let xpath = `//button[.//text()[normalize-space()='${label}']]`;
    await page.click(xpath);
}

async function clickRoleButton(page: Page, label: string) {
    let xpath = `//*[@role = 'button' and .//text()[normalize-space()='${label}']]`;
    await page.click(xpath);
}

async function clickInputButton(page: Page, label: string) {
    let xpath = `//input[@type='button' and @value[normalize-space()='${label}']]`;
    await page.click(xpath);
}