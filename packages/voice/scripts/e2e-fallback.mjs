// Mic permission denied: typing must still work end to end.
import { chromium } from "playwright-core";
const browser = await chromium.launch({ channel: "chrome", args: ["--use-fake-device-for-media-stream"] });
const page = await (await browser.newContext()).newPage(); // no mic permission granted; prompt auto-denied below
await page.context().grantPermissions([], { origin: "http://localhost:5199" });
await page.addInitScript(() => {
  navigator.mediaDevices.getUserMedia = () =>
    Promise.reject(Object.assign(new Error("denied"), { name: "NotAllowedError" }));
});
await page.goto("http://localhost:5199/");
await page.getByRole("button", { name: /tap and explain/i }).click();
console.log("alert:", await page.getByRole("alert").innerText());
await page.locator("textarea").fill("The water tablet is now 80 mg once a day");
await page.getByRole("button", { name: /check my explanation/i }).click();
console.log("submitted:", await page.locator("#out").textContent());
await browser.close();
