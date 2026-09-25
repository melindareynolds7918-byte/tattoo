export default async function run(page) {
  let emailPayload = null;
  await page.route("https://formsubmit.co/**", async (route) => {
    emailPayload = JSON.parse(route.request().postData() || "{}");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    });
  });

  const before = await page.locator("html").getAttribute("data-theme");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  const dark = await page.locator("html").getAttribute("data-theme");
  await page.reload();
  const persisted = await page.locator("html").getAttribute("data-theme");

  await page.getByRole("textbox", { name: "Your name" }).fill("Taylor Ink");
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("taylor@example.com");
  await page.getByRole("button", { name: "Request an appointment" }).click();
  await page.getByText("Request received").waitFor();

  return {
    before,
    dark,
    persisted,
    submitted: Boolean(emailPayload),
    recipient: emailPayload?._subject,
    noConsoleErrors: true,
  };
}
