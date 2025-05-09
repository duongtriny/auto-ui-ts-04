import test, { expect, Page } from "@playwright/test";

test.beforeEach('Before each', async ({ page }) => {
    await page.goto('https://test-with-me-app.vercel.app/learning/web-elements/elements/date-time');
});

test('Verify time picker', async ({ page }) => {
    await selectTime(page, 'Time Picker', 11, 54, 59);
    await expect(page.getByText('Current time: 11:54:59')).toBeVisible();
});

test('Verify time picker select now', async ({ page }) => {
    let pickerXpath = `(//span[.//text()[normalize-space()='Time Picker']]/following::input)[1]`;
    let pickerLocator = page.locator(pickerXpath);
    await pickerLocator.click();
    let timeBeforeClick = new Date();
    await page.waitForTimeout(1000);
    let pickerNowButtonCss = '.ant-picker-ranges .ant-picker-now a';
    await page.locator(pickerNowButtonCss).click();
    let actualTime = await pickerLocator.getAttribute('value');
    await page.waitForTimeout(1000);
    let currentTime = new Date();
    let currentDate = currentTime.toISOString().split('T')[0];
    let actualDate = new Date(`${currentDate} ${actualTime}`);
    expect(actualDate.getTime()).toBeGreaterThanOrEqual(timeBeforeClick.getTime());
    expect(actualDate.getTime()).toBeLessThanOrEqual(currentTime.getTime());
});

async function selectTime(page: Page, label: string, hour: number, minute: number, second: number) {
    let pickerXpath = `(//span[.//text()[normalize-space()='${label}']]/following::input)[1]`;
    await page.locator(pickerXpath).click();
    let hourXpath = `//ul[@data-type = 'hour']//li[contains(concat(' ',normalize-space(@class),' '),' ant-picker-time-panel-cell ') and @data-value='${hour}']`;
    await page.locator(hourXpath).click();
    let minuteXpath = `//ul[@data-type = 'minute']//li[contains(concat(' ',normalize-space(@class),' '),' ant-picker-time-panel-cell ') and @data-value='${minute}']`;
    await page.locator(minuteXpath).click();
    let secondXpath = `//ul[@data-type = 'second']//li[contains(concat(' ',normalize-space(@class),' '),' ant-picker-time-panel-cell ') and @data-value='${second}']`;
    await page.locator(secondXpath).click();
    let pickerOkButtonCss = '.ant-picker-ranges .ant-picker-ok button';
    await page.locator(pickerOkButtonCss).click();
}

test('Verify date picker', async ({ page }) => {
    await selectSingleDate(page, 1, 'May', 1990);
    await expect(page.getByText('Current date: 1990-05-01')).toBeVisible();
});

async function selectSingleDate(page: Page, day: number, month: string, year: number) {
    let datePickerXpath = `(//span[.//text()[normalize-space()='Date Picker']]/following::input[@placeholder='Select date'])[1]`;
    await page.locator(datePickerXpath).click();
    await selectDate(page, day, month, year);
}


async function selectDate(page: Page, day: number, month: string, year: number) {
    let yearCss = 'button.ant-picker-year-btn';
    await page.locator(yearCss).click();

    let isYearSelected = false;

    while (!isYearSelected) {
        let decadeCss = 'button.ant-picker-decade-btn';
        let decadeLocator = page.locator(decadeCss);
        let currentRangeText = await decadeLocator.textContent();
        let currentRange = currentRangeText?.split('-');
        if (!currentRange) {
            currentRange = [];
        }
        let startRange = Number.parseInt(currentRange[0]);
        let endRange = Number.parseInt(currentRange[1]);
        if (year >= startRange && year <= endRange) {
            let toBeClickedYearCss = `td[title='${year}'].ant-picker-cell.ant-picker-cell-in-view`;
            await page.locator(toBeClickedYearCss).click();
            isYearSelected = true;
        }
        if (year < startRange) {
            let previousYearButtonCss = `button.ant-picker-header-super-prev-btn`
            await page.locator(previousYearButtonCss).click();
        }
        if (year > endRange) {
            let nextYearButtonCss = `button.ant-picker-header-super-next-btn`;
            await page.locator(nextYearButtonCss).click();
        }
    }
    let monthXpath = `//div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-cell-inner ') and .//text()[normalize-space()='${month}']]`;
    await page.locator(monthXpath).click();
    let dayXpath = `//td[contains(concat(' ',normalize-space(@class),' '),' ant-picker-cell-in-view ') and .//text()[normalize-space()='${day}']]`;
    await page.locator(dayXpath).click();
}

test('Verify multiple date picker', async ({ page }) => {
    await selectMultipleDate(page, 1, 'Apr', 1990);
    await selectMultipleDate(page, 10, 'Jun', 1997);
    await page.getByText('Time Picker').click();
});

async function selectMultipleDate(page: Page, day: number, month: string, year: number) {
    let datePickerXpath = `(//span[.//text()[normalize-space()='Multiple Date Picker']]/following::div[contains(concat(' ',normalize-space(@class),' '),' ant-picker-multiple ')])[1]`;
    await page.locator(datePickerXpath).click();
    await selectDate(page, day, month, year);
}

