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

    page.route('*/**/api/products', async (route, request) => {
        let allHeaders = await request.allHeaders();
        cookie = allHeaders.cookie;
        const response = await route.fetch();
        const json = await response.json();
        listProductIds.push(json.data.uuid);
        await route.fulfill({ response, json });
    });
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

test(`Verify create product`, async ({ page }) => {
    await loginPage.selectMenuByLabel('New Product');
    await expect(page.getByText('Create a new product')).toBeVisible();
    const random = new Date().getTime();
    const randomName = `Giày Thể Thao Biti's Hunter X - ${random}`;
    await newProductPage.inputTextboxByLabel('Name', randomName);
    const randomSku = `SKU-${random}`;
    await newProductPage.inputTextboxByLabel('SKU', randomSku);
    await newProductPage.inputTextboxByLabel('Price', "100");
    await newProductPage.inputTextboxByLabel('Weight', "200");
    await newProductPage.selectCategory('Men');
    await newProductPage.selectDropdownByLabel('Tax class', 'Taxable Goods');
    await newProductPage.uploadImages(['../tests/evershop/product/data/bitis.webp']);
    const randomUrlKey = `url-key-${random}`;
    await newProductPage.inputTextboxByLabel('Url key', randomUrlKey);
    await newProductPage.inputTextboxByLabel('Meta title', "bitis");
    await newProductPage.inputTextboxByLabel('Meta keywords', "bitis");
    await newProductPage.inputTextAreaByLabel('Meta description', `Giày Thể Thao Biti's Hunter X LiteDash Go For Love 2k25 Edition Nam Màu Trắng HSM007505TRG`);
    await newProductPage.selectRadioByLabel('Status', 'Disabled');
    await newProductPage.selectRadioByLabel('Visibility', 'Not visible');
    await newProductPage.selectRadioByLabel('Manage stock?', 'No');
    await newProductPage.selectRadioByLabel('Stock availability', 'No');
    await newProductPage.inputTextboxByLabel('Quantity', "10");
    await newProductPage.selectDropdownByLabel('Attribute group', 'Default');
    await newProductPage.selectDropdownByLabel('Color', 'White');
    await newProductPage.selectDropdownByLabel('Size', 'XL');
    await newProductPage.clickButtonByLabel('Save');
    await expect(page.getByText('Product saved successfully!')).toBeVisible();
    await newProductPage.selectMenuByLabel("Products");
    await expect(page.getByText("Products", { exact: true }).first()).toBeVisible();
    await productsPage.searchProductByName(`${random}`);
    await expect(page.getByText(randomName)).toBeVisible();
    await productsPage.clickOnLinkByText(randomName);
    await expect(page.getByText(`Editing ${randomName}`)).toBeVisible();
    expect(await editProductPage.getTextBoxValueByLabel('Name')).toEqual(randomName);
    expect(await editProductPage.getTextBoxValueByLabel('SKU')).toEqual(randomSku);
    expect(await editProductPage.getTextBoxValueByLabel('Price')).toEqual('100');
    expect(await editProductPage.getTextBoxValueByLabel('Weight')).toEqual('200');
});