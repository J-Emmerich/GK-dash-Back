import * as puppeteer from "puppeteer";
import { join } from "path";

const { BASE_FRONTEND_URL } = process.env;

const fileOutputPath = join(__dirname, "../../client/output");

const setDomainLocalStorage = async (browser, url, values) => {
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (r) => {
      r.respond({
        status: 200,
        contentType: "text/plain",
        body: "body",
      });
    });
    await page.goto(url, { waitUntil: "networkidle2" });
    // eslint-disable-next-line no-shadow
    await page.evaluate((values) => {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const key in values) {
        // eslint-disable-next-line no-undef
        localStorage.setItem(key, values[key]);
      }
    }, values);
    await page.close();
  } catch (error) {
    console.log(error);
  }
};

export const saveToPdf = async (id, name, token) => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const localStorage = { ACCESS_TOKEN: token };
    await setDomainLocalStorage(browser, BASE_FRONTEND_URL, localStorage);

    // old
    const page = await browser.newPage();
    await page.goto(`${BASE_FRONTEND_URL}/topdf/${id}`, {
      waitUntil: "networkidle2",
    });
    await page.emulateMediaType("screen");
    await page.pdf({
      path: `${fileOutputPath}/${name}.pdf`,
      format: "a4",
      printBackground: true,
    });

    await browser.close();
  } catch (err) {
    console.log("*****", err.message);
  }
};
