// Drives the harness in real Chrome with a WAV file as the fake microphone.
//   npx vite --config harness/vite.config.ts   (in another shell)
//   node scripts/e2e-browser.mjs scripts/out/sample.wav
import { chromium } from "playwright-core";
import { resolve } from "node:path";

const wav = resolve(process.argv[2] ?? "scripts/out/sample.wav");
const browser = await chromium.launch({
  channel: "chrome",
  args: [
    "--use-fake-ui-for-media-stream",
    "--use-fake-device-for-media-stream",
    `--use-file-for-fake-audio-capture=${wav}`,
  ],
});
const ctx = await browser.newContext({ permissions: ["microphone"] });
const page = await ctx.newPage();
page.on("console", (m) => console.log("[browser]", m.type(), m.text().slice(0, 200)));
page.on("pageerror", (e) => console.log("[pageerror]", e.message));

await page.goto("http://localhost:5199/");
const t0 = Date.now();
await page.getByRole("button", { name: /tap and explain/i }).click();
await page.getByRole("button", { name: /^stop$/i }).waitFor();
await page.waitForTimeout(11_000); // sample is ~9 s
await page.getByRole("button", { name: /^stop$/i }).click();
await page.waitForFunction(() => document.querySelector("textarea")?.value.length > 0, null, { timeout: 300_000 });
console.log("textarea:", await page.locator("textarea").inputValue());
console.log("elapsed ms:", Date.now() - t0);
const details = page.locator("details");
if (await details.count()) console.log("snaps:", await details.innerText());
await page.getByRole("button", { name: /check my explanation/i }).click();
console.log("submitted:", await page.locator("#out").textContent());
await browser.close();
