export default async function run(page) {
  let requestData = null;
  await page.route("https://formspree.io/f/xeaokvrj", async (route) => {
    requestData = route.request().postData() || "";
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
      body: JSON.stringify({ next: "/" }),
    });
  });

  await page.getByRole("textbox", { name: "Your name" }).fill("Jordan Ink");
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("jordan@example.com");
  await page.getByRole("button", { name: "Request an appointment" }).click();
  await page.getByText("Request received").waitFor();

  return {
    endpointWasCalled: Boolean(requestData),
    includesName: requestData.includes("Jordan Ink"),
    includesEmail:
      requestData.includes("jordan%40example.com") ||
      requestData.includes("jordan@example.com"),
    successStateVisible: await page.getByText("Request received").isVisible(),
  };
}
