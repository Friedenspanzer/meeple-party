import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Login", () => {
  test("has login button", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });
});
