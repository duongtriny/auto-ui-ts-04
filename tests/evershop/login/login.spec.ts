import test, { expect, Page } from "@playwright/test";
import { invalidLoginData } from "./login-data";
import { LoginPage } from "../../../pages/LoginPage";
import { ADMIN_PASSWORD, ADMIN_USER_NAME, LOGIN_URL } from "../../../utils/constants";
import { iStep } from "../../../utils/step-utils";
import { getEnv } from "../../../utils/config-utils";

let loginPage: LoginPage;

test.beforeEach('Before each', async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto(LOGIN_URL);
});

for (let data of invalidLoginData) {
    test(`Verify login with invalid data - email: ${data.email} - password: ${data.passwords}`, async ({ page }) => {
        await iStep("Open login page", () => loginPage.login(data.email, data.passwords));
        await iStep("Verify email error message", async () => expect(await loginPage.getErrorMessageByLabel('Email')).toEqual(data.expectedEmailErrorMessage));
        await iStep("Verify password error message", async () => expect(await loginPage.getErrorMessageByLabel('Email')).toEqual(data.expectedEmailErrorMessage));
    });
}

test(`Verify login with wrong username and password`, async ({ page }) => {
    await loginPage.login('abc@gmail.com', '121312');
    await expect(page.getByText('Invalid email or password')).toBeVisible();
});

test(`Verify login successful`, async ({ page }) => {
    await loginPage.login(getEnv(ADMIN_USER_NAME), getEnv(ADMIN_PASSWORD));
    await expect(page.getByText('Dashboard').first()).toBeVisible();
});
