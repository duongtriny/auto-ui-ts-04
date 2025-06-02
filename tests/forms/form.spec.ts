import test, { expect, Page } from "@playwright/test";
const dayjs = require('dayjs');

test.beforeEach('Before each', async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/form');
});

test('Verify form validation message', async ({ page }) => {
    await page.getByRole('button', { name: 'Submit' }).click();
    expect.soft(await getErrorMessageByLabel(page, 'Full Name')).toEqual("Please input your full name!");
    expect.soft(await getErrorMessageByLabel(page, 'Email')).toEqual("Please input your email!");
    expect.soft(await getErrorMessageByLabel(page, 'Phone Number')).toEqual("Please input your phone number!");
    expect.soft(await getErrorMessageByLabel(page, 'Date of Birth')).toEqual("Please select your date of birth!You must be at least 18 years old!");
    expect.soft(await getErrorMessageByLabel(page, 'Address')).toEqual("Please input your address!");
    expect(test.info().errors).toHaveLength(0);
});

async function getErrorMessageByLabel(page: Page, label: string) {
    let errorXpath = `(//label[.//text()[normalize-space() = '${label}']]/following::div[@role='alert'])[1]`;
    let errorLocator = page.locator(errorXpath);
    let errorText = await errorLocator.textContent();
    return errorText?.trim();
}

test('Verify submit form successful', async ({ page }) => {
    await fillTextboxByLabel(page, 'Full Name', 'Test With Me');
    await fillTextboxByLabel(page, 'Email', 'abc@gmail.com');
    await fillTextboxByLabel(page, 'Phone Number', '1234567890');
    await fillTextboxByLabel(page, 'Date of Birth', buildDynamicBirthdayByAge(18, 'exact'));
    await fillTextboxByLabel(page, 'Address', 'HCM');
    await fillTextboxByLabel(page, 'Occupation', 'Tester');
    await fillTextboxByLabel(page, 'Company', 'ABC');
    await page.getByRole('button', { name: 'Submit' }).click();
    expect(page.getByText(`Application of \"Test with me\"Your application has been submitted successfully.`)).toBeVisible();
});

async function fillTextboxByLabel(page: Page, label: string, input: string) {
    let textboxXpath = `(//label[.//text()[normalize-space() = '${label}']]/following::input)[1]`;
    let textboxLocator = page.locator(textboxXpath);
    await textboxLocator.fill(input);
    await page.keyboard.press('Tab');
}

function buildDynamicBirthdayByAge(inputAge: number, type: 'exact' | 'lessThan' | 'graterThan') {
    const dateFormat = 'YYYY-MM-DD';
    switch (type) {
        case "exact":
            return dayjs().subtract(inputAge, 'year').format(dateFormat);
        case "lessThan":
            return dayjs().subtract(inputAge, 'year').subtract(1, 'day').format(dateFormat);
        case "graterThan":
            return dayjs().subtract(inputAge, 'year').add(1, 'day').format(dateFormat);
    }
}