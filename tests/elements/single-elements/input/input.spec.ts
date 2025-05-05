import test, { expect, Page } from "@playwright/test";
import { inputData } from "./input-test-data";

test.beforeEach('Before each', async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/elements/input');
});

test('Verify normal input', async ({ page }) => {
    await fillInput(page, 'Normal Input', 'ABC');
    await expect(page.getByText('Value: ABC')).toBeVisible({ timeout: 20000 });
});

for (let data of inputData) {
    test(`Verify input number - value: ${data.input} - first approach - using fill`, async ({ page }) => {
        await fillInput(page, 'Input Number', data.input);
        await expect(page.getByText(`Value: ${data.expect}`)).toBeVisible();
    });
}

test('Verify password box', async ({ page }) => {
    await fillInput(page, 'Password Box', '123456')
    await expect(page.getByText('Value: 123456')).toBeVisible();
});

async function fillInput(page: Page, label: string, value: string) {
    let xpath = `(//span[.//text()[normalize-space()='${label}']]/following::input)[1]`;
    await page.locator(xpath).fill(value);
    await page.keyboard.press('Enter');
}

test('Verify text area', async ({ page }) => {
    await fillTextarea(page, 'Text Area', 'Test With Me');
    await expect(page.getByText('Value: Test With Me')).toBeVisible();
});

async function fillTextarea(page: Page, label: string, value: string) {
    let xpath = `(//span[.//text()[normalize-space()='${label}']]/following::textarea)[1]`;
    await page.locator(xpath).fill(value);
    await page.keyboard.press('Enter');
}

test('Verify input number - second approach - using keyboard type', async ({ page }) => {
    fillInputNumberByKeyboard(page, 'Input Number', '101')
    await expect(page.getByText('Value: 100')).toBeVisible();
});

async function fillInputNumberByKeyboard(page: Page, label: string, value: string) {
    let xpath = `(//span[.//text()[normalize-space()='${label}']]/following::input)[1]`;
    let input = page.locator(xpath);
    await input.click();
    await input.clear();
    await page.keyboard.type(value);
    await page.keyboard.press('Enter');
}

test('Verify OTP box', async ({ page }) => {
    await fillOtpBox(page, 'OTP Box', '123456');
    await expect(page.getByText('Value: 123456')).toBeVisible();
});

async function fillOtpBox(page: Page, label: string, value: string) {
    for (let i = 0; i < value.length; i++) {
        let xpath = `(//span[.//text()[normalize-space()='${label}']]/following::input)[${i + 1}]`;
        await page.locator(xpath).fill(value[i]);
        await page.keyboard.press('Enter');
    }
}