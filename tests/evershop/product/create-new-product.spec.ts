import test, { expect, Page } from "@playwright/test";
import { LoginPage } from "../../../pages/LoginPage";
import { NewProductPage } from "../../../pages/NewProductPage";
import { ProductsPage } from "../../../pages/ProductsPage";
import { EditProductPage } from "../../../pages/EditProductPage";
import { DELETE_PRODUCT_API, LOGIN_URL, URL } from "../../../utils/constants";
import { iStep } from "../../../utils/step-utils";

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
    await iStep('Select menu item New Product', () => loginPage.selectMenuByLabel('New Product'));
    await iStep('Verify create new product page load successfully', () => expect(page.getByText('Create a new product')).toBeVisible())
    const random = new Date().getTime();
    const randomName = `Giày Thể Thao Biti's Hunter X - ${random}`;
    await iStep('Input product name', () => newProductPage.inputTextboxByLabel('Name', randomName));
    const randomSku = `SKU-${random}`;
    await iStep('Input product SKU', () => newProductPage.inputTextboxByLabel('SKU', randomSku));
    await iStep('Input product Price', () => newProductPage.inputTextboxByLabel('Price', "100"));
    await iStep('Input product Weight', () => newProductPage.inputTextboxByLabel('Weight', "200"));
    await iStep('Input product category', () => newProductPage.selectCategory('Men'));
    await iStep('Input product tax class', () => newProductPage.selectDropdownByLabel('Tax class', 'Taxable Goods'));
    await iStep('Upload product image', () => newProductPage.uploadImages(['../tests/evershop/product/data/bitis.webp']));
    const randomUrlKey = `url-key-${random}`;
    await iStep('Input product url key', () => newProductPage.inputTextboxByLabel('Url key', randomUrlKey));
    await iStep('Input product meta title', () => newProductPage.inputTextboxByLabel('Meta title', "bitis"));
    await iStep('Input product meta keywords', () => newProductPage.inputTextboxByLabel('Meta keywords', "bitis"));
    await iStep('Input product meta description', () => newProductPage.inputTextAreaByLabel('Meta description', `Giày Thể Thao Biti's Hunter X LiteDash Go For Love 2k25 Edition Nam Màu Trắng HSM007505TRG`));
    await iStep('Input product status', () => newProductPage.selectRadioByLabel('Status', 'Disabled'));
    await iStep('Input product visibility', () => newProductPage.selectRadioByLabel('Visibility', 'Not visible'));
    await iStep('Input product manage stock', () => newProductPage.selectRadioByLabel('Manage stock?', 'No'));
    await iStep('Input product stock availability', () => newProductPage.selectRadioByLabel('Stock availability', 'No'));
    await iStep('Input product quantity', () => newProductPage.inputTextboxByLabel('Quantity', "10"));
    await iStep('Input product attribute group', () => newProductPage.selectDropdownByLabel('Attribute group', 'Default'));
    await iStep('Input product color', () => newProductPage.selectDropdownByLabel('Color', 'White'));
    await iStep('Input product size', () => newProductPage.selectDropdownByLabel('Size', 'XL'));
    await iStep('Click button save', () => newProductPage.clickButtonByLabel('Save'));
    await iStep('Verify product saved successfully!', () => expect(page.getByText('Product saved successfully!')).toBeVisible());
    await iStep('Select menu item Products', () => newProductPage.selectMenuByLabel("Products"));
    await iStep('Verify Products page loaded', () => expect(page.getByText("Products", { exact: true }).first()).toBeVisible());
    await iStep('Search product', () => productsPage.searchProductByName(`${random}`));
    await iStep('Verify product is visible', () => expect(page.getByText(randomName)).toBeVisible());
    await iStep('View product details', () => productsPage.clickOnLinkByText(randomName));
    await iStep('Verify product details is displayed', () => expect(page.getByText(`Editing ${randomName}`)).toBeVisible());
    await iStep('Verify product name', async () => expect(await editProductPage.getTextBoxValueByLabel('Name')).toEqual(randomName));
    await iStep('Verify product SKU', async () => expect(await editProductPage.getTextBoxValueByLabel('SKU')).toEqual(randomSku));
    await iStep('Verify product price', async () => expect(await editProductPage.getTextBoxValueByLabel('Price')).toEqual('100'));
    await iStep('Verify product weight', async () => expect(await editProductPage.getTextBoxValueByLabel('Weight')).toEqual('200'));
});