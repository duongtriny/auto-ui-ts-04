import test, { expect, Page } from "@playwright/test";
import { invalidLoginData } from "./login-data";

test.beforeEach('Before each', async ({ page }) => {
    await page.goto('http://localhost:3000/admin/login');
});

for (let data of invalidLoginData) {
    test(`Verify login with invalid data - email: ${data.email} - password: ${data.passwords}`, async ({ page }) => {
        await login(page, data.email, data.passwords);
        expect(await getErrorMessageByLabel(page, 'Email')).toEqual(data.expectedEmailErrorMessage);
        expect(await getErrorMessageByLabel(page, 'Password')).toEqual(data.expectedPasswordErrorMessage);
    });
}

test(`Verify login with wrong username and password`, async ({ page }) => {
    await login(page, 'abc@gmail.com', '121312');
    await expect(page.getByText('Invalid email or password')).toBeVisible();
});

test(`Verify login successful`, async ({ page }) => {
    await login(page, 'test@with.me', '12345678');
    await expect(page.getByText('Dashboard').first()).toBeVisible();
});

async function login(page: Page, email: string, password: string) {
    await inputTextboxByLabel(page, 'Email', email);
    await inputTextboxByLabel(page, 'Password', password);
    await clickButtonByLabel(page, 'SIGN IN');
}

async function inputTextboxByLabel(page: Page, label: string, value: string) {
    let xpath = `(//label[.//text()[normalize-space()='${label}']]/following::input)[1]`;
    await page.locator(xpath).clear();
    await page.locator(xpath).fill(value);
}

async function clickButtonByLabel(page: Page, label: string) {
    let xpath = `//button[.//text()[normalize-space()='${label}']]`;
    await page.locator(xpath).click();
}

async function getErrorMessageByLabel(page: Page, label: string) {
    let xpath = `(//label[.//text()[normalize-space()='${label}']]/following::div[contains(concat(' ',normalize-space(@class),' '),' field-error ')])[1]`;
    let message = await page.locator(xpath).textContent();
    return message?.trim();
}