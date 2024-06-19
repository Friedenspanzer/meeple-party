import { expect, test } from "@playwright/test";
import { USER, USER_STORAGE } from "./constants";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test.describe("Login for logged out user", () => {
  test("has login button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Login or Register" })
    ).toBeVisible();
  });
});

test.describe("Login for logged in user", () => {
  test.use({ storageState: USER_STORAGE });
  test("has expected ui", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Logout " })).toBeVisible();
    await expect(page.getByRole("link", { name: "Go to app " })).toBeVisible();
    await expect(page.getByText(USER.realName)).toBeVisible();
    await expect(page.getByText(USER.name)).toBeVisible();
    await expect(page.getByText("U", { exact: true })).toBeVisible();
  });
  test("button navigates to app", async ({ page }) => {
    await page.getByRole("link", { name: "Go to app " }).click();
    await page.waitForURL("/app");
  });
  test("button logs out", async ({ page }) => {
    await page.getByRole("button", { name: "Logout " }).click();
    await expect(
      page.getByRole("button", { name: "Login or Register" })
    ).toBeVisible();
  });
});
