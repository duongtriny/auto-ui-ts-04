import { Page } from "@playwright/test";
import { CommonPage } from "./CommonPage";
import path from "node:path";

export class NewProductPage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }

    async selectMenuByLabel(label: string) {
        let xpath = `//li[contains(concat(' ',normalize-space(@class),' '),' nav-item ')]//a[.//text()[normalize-space()='${label}']]`;
        await this.page.locator(xpath).click();
    }

    async selectCategory(category: string) {
        await this.page.locator("//a[.//text()[normalize-space()='Select category']]").click();
        await this.page.getByText("Select categories").waitFor({ state: "visible" });
        await this.page.getByPlaceholder("Search categories").clear();
        await this.page.getByPlaceholder("Search categories").fill(category);
        await this.page.locator(`(//span[.//text()[normalize-space()='${category}']]/following::button[.//text()[normalize-space()='Select']])[1]`).click();
    }

    async uploadImages(filePaths: string[]) {
        filePaths = filePaths.map(filePath => path.join(__dirname, filePath));
        let xpathInput = `(//h2[.//text()[normalize-space()='Media']]/following::input)[1]`;
        await this.page.locator(xpathInput).setInputFiles(filePaths);
    }
}