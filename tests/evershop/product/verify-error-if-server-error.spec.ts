import test, { expect, Page } from "@playwright/test";
import { LoginPage } from "../../../pages/LoginPage";
import { NewProductPage } from "../../../pages/NewProductPage";
import { ProductsPage } from "../../../pages/ProductsPage";
import { EditProductPage } from "../../../pages/EditProductPage";
import { DELETE_PRODUCT_API, LOGIN_URL, URL } from "../../../utils/constants";

let loginPage: LoginPage;
let newProductPage: NewProductPage;
let productsPage: ProductsPage;
let editProductPage: EditProductPage;
let listProductIds: string[] = [];
let cookie: string;

test.beforeEach('Before each', async ({ page }) => {
    loginPage = new LoginPage(page);
    newProductPage = new NewProductPage(page);
    productsPage = new ProductsPage(page);
    editProductPage = new EditProductPage(page);
    await page.goto(LOGIN_URL);
    await loginPage.loginWithAdmin();
    await expect(page.getByText('Dashboard').first()).toBeVisible();
});

test.afterAll('Clean up data', async ({ request }) => {
    for (let id of listProductIds) {
        await request.delete(`${URL}${DELETE_PRODUCT_API}${id}`, {
            headers: {
                'cookie': cookie
            }
        });
    }

})

test(`Verify error message when server return 500 error`, async ({ page }) => {
    page.route('*/**/api/products', async (route, request) => {
        let allHeaders = await request.allHeaders();
        cookie = allHeaders.cookie;
        await route.fulfill({
            json: {
                error: {
                    status: 500,
                    message: "Internal Server Error"
                }
            },
            status: 500
        });
    });
    await loginPage.selectMenuByLabel('New Product');
    await expect(page.getByText('Create a new product')).toBeVisible();
    const random = new Date().getTime();
    const randomName = `Giày Thể Thao Biti's Hunter X - ${random}`;
    await newProductPage.inputTextboxByLabel('Name', randomName);
    const randomSku = `SKU-${random}`;
    await newProductPage.inputTextboxByLabel('SKU', randomSku);
    await newProductPage.inputTextboxByLabel('Price', "100");
    await newProductPage.inputTextboxByLabel('Weight', "200");
    const randomUrlKey = `url-key-${random}`;
    await newProductPage.inputTextboxByLabel('Url key', randomUrlKey);
    await newProductPage.inputTextboxByLabel('Quantity', "10");
    await newProductPage.clickButtonByLabel('Save');
    await expect(page.getByText('Internal Server Error')).toBeVisible();

});