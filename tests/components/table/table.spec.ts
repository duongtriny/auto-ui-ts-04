import test, { expect, Page } from "@playwright/test";
import { expectedTableData } from "./table-test-data";

test.beforeEach('Before each', async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/components/table');
});

test('Verify table', async ({ page }) => {
    let tableXpath = `(//span[.//text()[normalize-space()='Table']]/following::table)[1]`;
    let tableLocator = page.locator(tableXpath);
    //Loop for each page until the next button disable
    let nextButtonXpath = `//li[normalize-space(@title)='Next Page']`;
    let nextButton = page.locator(nextButtonXpath);
    let isNextButtonDisable = false;
    let actualRecords: any = [];
    while (!isNextButtonDisable) {
        isNextButtonDisable = await nextButton.locator('button').isDisabled();
        //1. Get headers
        let headersLocators = await tableLocator.locator('th').all();
        let headers: string[] = [];
        for (let headersLocator of headersLocators) {
            let headerText = await headersLocator.textContent() ?? '';
            headers.push(headerText?.trim());
        }
        //2. Get rows
        let rows = await tableLocator.locator('//tbody//tr').all();
        //3. Loop through each row
        for (let row of rows) {
            let record = {};
            //3.1 For each corresponding index of headers we get data from corresponding td
            for (let i = 0; i < headers.length; i++) {
                if ('Tags' == headers[i]) {
                    let td = row.locator(`//td[${i + 1}]`);
                    let tags = await td.locator('.ant-tag').allTextContents();
                    tags = tags.map(v => v.trim());
                    record[headers[i].trim()] = tags;
                } else {
                    let text = await row.locator(`//td[${i + 1}]`).textContent();
                    //3.2 Put data to an object
                    if ('Action' != headers[i]) {
                        record[headers[i].trim()] = text?.trim();
                    }
                }
            }
            //3.3 Add to results array
            actualRecords.push(record);
        }
        await nextButton.click();
    }
    //4. Verify actual data vs expected data
    expect(actualRecords.length).toBe(expectedTableData.length);
    expect(actualRecords).toEqual(expect.arrayContaining(expectedTableData));
    expect(expectedTableData).toEqual(expect.arrayContaining(actualRecords));
});