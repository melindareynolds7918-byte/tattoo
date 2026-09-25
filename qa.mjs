export default async function run(page) {
  const result = {};
  result.desktop = await page.locator("h1").innerText();
  await page.getByRole("textbox", { name: "Your name" }).fill("Alex South");
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("alex@example.com");
  await page.getByRole("button", { name: "Request an appointment" }).click();
  await page.getByText("Request received").waitFor();
  result.confirmation = await page.locator(".success-state h3").innerText();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.getByRole("button", { name: "Open navigation" }).click();
  result.mobileNavVisible = await page
    .getByRole("button", { name: "Book a session" })
    .isVisible();
  return result;
}
