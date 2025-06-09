import { Page } from "@playwright/test";
import { CommonPage } from "./CommonPage";

export class LoginPage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }

    async loginWithAdmin() {
        await this.login('test@with.me', '12345678');
    }

    async login(email: string, password: string) {
        await this.inputTextboxByLabel('Email', email);
        await this.inputTextboxByLabel('Password', password);
        await this.clickButtonByLabel('SIGN IN');
    }

    async getErrorMessageByLabel(label: string) {
        let xpath = `(//label[.//text()[normalize-space()='${label}']]/following::div[contains(concat(' ',normalize-space(@class),' '),' field-error ')])[1]`;
        let message = await this.page.locator(xpath).textContent();
        return message?.trim();
    }
}