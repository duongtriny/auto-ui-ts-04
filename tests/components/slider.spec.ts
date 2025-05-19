import test, { expect, Page } from "@playwright/test";

test.beforeEach('Before each', async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/components/slider');
});
[1, 13, 55, 99].forEach(value => {
    test(`Verify slider (by click): ${value}`, async ({ page }) => {
        await selectValueOfSliderByClick(page, 'Slider', value);
        await expect(page.getByText(`Current Value: ${value}`)).toBeVisible();
    });
})


async function selectValueOfSliderByClick(page: Page, label: string, value: number) {
    let sliderXpath = `(//span[normalize-space()='${label}']/following::div[contains(concat(' ',normalize-space(@class),' '),' ant-slider-rail ')])[1]`;
    let sliderLocator = page.locator(sliderXpath);
    let sliderBoundingBox = await sliderLocator.boundingBox();
    let x = sliderBoundingBox?.x ?? 0;
    let y = sliderBoundingBox?.y ?? 0;
    let sliderWidth = sliderBoundingBox?.width ?? 0;
    let sliderHeight = sliderBoundingBox?.height ?? 0;
    let beClickedX = value * sliderWidth / 100 + x;
    let beClickedY = y + sliderHeight / 2;
    await sliderLocator.hover();
    await page.mouse.click(beClickedX, beClickedY);
}

[1, 13, 55, 99].forEach(value => {
    test(`Verify slider (by Slide): ${value}`, async ({ page }) => {
        await selectValueOfSliderBySlide(page, 'Slider', value);
        await expect(page.getByText(`Current Value: ${value}`)).toBeVisible();
    });
})

async function selectValueOfSliderBySlide(page: Page, label: string, value: number) {
    let sliderXpath = `(//span[normalize-space()='${label}']/following::div[contains(concat(' ',normalize-space(@class),' '),' ant-slider-rail ')])[1]`;
    let sliderLocator = page.locator(sliderXpath);
    let sliderBoundingBox = await sliderLocator.boundingBox();
    let x = sliderBoundingBox?.x ?? 0;
    let y = sliderBoundingBox?.y ?? 0;
    let sliderWidth = sliderBoundingBox?.width ?? 0;
    let sliderHeight = sliderBoundingBox?.height ?? 0;
    let beClickedX = value * sliderWidth / 100 + x;
    let beClickedY = y + sliderHeight / 2;
    await sliderLocator.hover();
    await page.mouse.move(x, beClickedY);
    await page.mouse.down();
    await page.mouse.move(beClickedX, beClickedY);
    await page.mouse.up();
}