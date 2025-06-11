import { Page } from "@playwright/test";
import { CommonPage } from "./CommonPage";

export class EditProductPage extends CommonPage {
    constructor(page: Page) {
        super(page);
    }
}