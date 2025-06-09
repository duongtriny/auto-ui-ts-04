import test, { expect, Page } from "@playwright/test";
import { invalidLoginData } from "./login-data";
import { LoginPage } from "../../../pages/LoginPage";

let loginPage: LoginPage;

test.beforeEach('Before each', async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto('http://localhost:3000/admin/login');
});

for (let data of invalidLoginData) {
    test(`Verify login with invalid data - email: ${data.email} - password: ${data.passwords}`, async ({ page }) => {
        await loginPage.login(data.email, data.passwords);
        expect(await loginPage.getErrorMessageByLabel('Email')).toEqual(data.expectedEmailErrorMessage);
        expect(await loginPage.getErrorMessageByLabel('Password')).toEqual(data.expectedPasswordErrorMessage);
    });
}

test(`Verify login with wrong username and password`, async ({ page }) => {
    await loginPage.login('abc@gmail.com', '121312');
    await expect(page.getByText('Invalid email or password')).toBeVisible();
});

test(`Verify login successful`, async ({ page }) => {
    await loginPage.login('test@with.me', '12345678');
    await expect(page.getByText('Dashboard').first()).toBeVisible();
});
