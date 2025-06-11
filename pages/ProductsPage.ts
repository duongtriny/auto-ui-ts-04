import { Page } from "@playwright/test";
import { CommonPage } from "./CommonPage";

export class ProductsPage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }

    async searchProductByName(name: string) {
        let locator = this.page.locator("#keyword");
        await locator.click();
        await locator.clear();
        await this.page.keyboard.insertText(name);
        await this.page.keyboard.press("Enter");
    }
}