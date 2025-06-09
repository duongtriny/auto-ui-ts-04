import { Page } from "@playwright/test";

export class LoginPage {
    page: Page

    constructor(page: Page) {
        this.page = page;
    }

    async loginWithAdmin() {
        await this.login('test@with.me', '12345678');
    }

    async login(email: string, password: string) {
        await this.inputTextboxByLabel('Email', email);
        await this.inputTextboxByLabel('Password', password);
        await this.clickButtonByLabel('SIGN IN');
    }

    async inputTextboxByLabel(label: string, value: string) {
        let xpath = `(//label[.//text()[normalize-space()='${label}']]/following::input)[1]`;
        await this.page.locator(xpath).clear();
        await this.page.locator(xpath).fill(value);
    }

    async clickButtonByLabel(label: string) {
        let xpath = `//button[.//text()[normalize-space()='${label}']]`;
        await this.page.locator(xpath).click();
    }

    async getErrorMessageByLabel(label: string) {
        let xpath = `(//label[.//text()[normalize-space()='${label}']]/following::div[contains(concat(' ',normalize-space(@class),' '),' field-error ')])[1]`;
        let message = await this.page.locator(xpath).textContent();
        return message?.trim();
    }
}