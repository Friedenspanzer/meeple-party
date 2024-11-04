import { expect, test } from "@playwright/test";
import { AVAILABLE_GAMES } from "./globalSetup";
import {
  addGamesToCollection,
  clearCollection,
  logInAsNewUser,
} from "./utility";

const WINGSPAN = 266192;

test.describe("Pagination", () => {
  test.beforeEach(async ({ page }) => {
    const user = await logInAsNewUser(page.context());
    await clearCollection(user.id);
    await addGamesToCollection(user.id, AVAILABLE_GAMES);
  });
  test("has expected pages with small gamebox", async ({ page }) => {
    await page.goto("/app/collection");
    await page.getByRole("radiogroup").locator("label").first().click();
    await expect(page.getByRole("button", { name: "1" })).toBeVisible();
    await expect(page.getByRole("button", { name: "2" })).toBeVisible();
    await expect(page.getByRole("button", { name: "3" })).toBeVisible();
    await expect(page.getByRole("button", { name: "4" })).toBeVisible();
    await expect(page.getByLabel("Current page")).toHaveValue("1");
    await expect(page.getByText("of 4")).toBeVisible();
    await expect(page.getByRole("button", { name: "1" })).toHaveClass(/active/);
  });
  test("has expected pages with big gamebox", async ({ page }) => {
    await page.goto("/app/collection");
    await page.getByRole("radiogroup").locator("label").nth(1).click();
    await expect(page.getByRole("button", { name: "1" })).toBeVisible();
    await expect(page.getByRole("button", { name: "2" })).toBeVisible();
    await expect(page.getByRole("button", { name: "3" })).toBeVisible();
    await expect(page.getByRole("button", { name: "6" })).toBeVisible();
    await expect(page.getByText("…6")).toBeVisible();
    await expect(page.getByLabel("Current page")).toHaveValue("1");
    await expect(page.getByText("of 6")).toBeVisible();
    await expect(page.getByRole("button", { name: "1" })).toHaveClass(/active/);
  });
  test("button display changes with changing pages", async ({ page }) => {
    await page.goto("/app/collection");
    await page.getByRole("radiogroup").locator("label").nth(1).click();
    await page.getByRole("button", { name: "3" }).click();
    await expect(page.getByRole("button", { name: "3" })).toHaveClass(/active/);
    await expect(page.getByRole("button", { name: "4" })).toBeVisible();
    await expect(page.getByRole("button", { name: "5" })).toBeVisible();
    await expect(page.getByLabel("Current page")).toHaveValue("3");
  });
  test("button changes pages", async ({ page }) => {
    await page.goto("/app/collection");
    await expect(
      page.getByRole("heading", { name: "7 Wonders Duel" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ark Nova" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Brass: Lancashire" })
    ).toBeVisible();
    await page.getByRole("button", { name: "3" }).click();
    await expect(
      page.getByRole("heading", { name: "Frosthaven" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Lost Ruins of Arnak" })
    ).toBeVisible();
    await page.getByRole("button", { name: "6" }).click();
    await expect(
      page.getByRole("heading", { name: "The Crew: Mission Deep Sea" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Wingspan" })).toBeVisible();
  });
  test("inputting pages changes current page", async ({ page }) => {
    await page.goto("/app/collection");
    await page.getByLabel("Current page");
  });
});

test.describe("Collection updates in collection view", () => {
  test.describe("visual tests", () => {
    test("hovering set state", async ({ page }) => {
      const user = await logInAsNewUser(page.context());
      await clearCollection(user.id);
      await addGamesToCollection(user.id, [WINGSPAN]);
      await page.goto("/app/collection");

      await expect(page.getByText("Wingspan")).toBeVisible();

      await page.getByRole("button", { name: "Don't own" }).hover();

      await expect(page).toHaveScreenshot({
        clip: { x: 330, y: 200, width: 620, height: 270 },
      });
    });
    test("hovering not set state", async ({ page }) => {
      const user = await logInAsNewUser(page.context());
      await clearCollection(user.id);
      await addGamesToCollection(user.id, [WINGSPAN]);
      await page.goto("/app/collection");

      await expect(page.getByText("Wingspan")).toBeVisible();

      await page.getByRole("button", { name: "Want To Play" }).hover();

      await expect(page).toHaveScreenshot({
        clip: { x: 330, y: 200, width: 620, height: 270 },
      });
    });
  })
  test("changing collection status", async ({ page }) => {
    const user = await logInAsNewUser(page.context());
    await clearCollection(user.id);
    await addGamesToCollection(user.id, [WINGSPAN]);
    await page.goto("/app/collection");

    await expect(page.getByText("Wingspan")).toBeVisible();

    await expect(page.getByText("Own", { exact: true }).nth(3)).toBeVisible();
    await page.getByRole("button", { name: "Don't own" }).click();
    await expect(page.getByText("Don't own", { exact: true })).toBeVisible();

    await page.reload();

    await expect(page.getByText("Wingspan")).not.toBeVisible();
  });
  test("changing want to play status", async ({ page }) => {
    const user = await logInAsNewUser(page.context());
    await clearCollection(user.id);
    await addGamesToCollection(user.id, [WINGSPAN]);
    await page.goto("/app/collection");

    await expect(page.getByText("Don't want to play")).toBeVisible();
    await page.getByRole("button", { name: "Want to play" }).click();
    await expect(page.getByText("Want To Play", { exact: true })).toBeVisible();

    await page.reload();

    await expect(page.getByText("Want To Play", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Want To Play" }).click();
    await expect(page.getByText("Don't want to play")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Don't want to play")).toBeVisible();
  });
  test("changing wishlist status", async ({ page }) => {
    const user = await logInAsNewUser(page.context());
    await clearCollection(user.id);
    await addGamesToCollection(user.id, [WINGSPAN]);
    await page.goto("/app/collection");

    await expect(page.getByText("Don't wish")).toBeVisible();
    await page.getByRole("button", { name: "Wishlist" }).click();
    await expect(page.getByText("Wishlist", { exact: true })).toBeVisible();

    await page.reload();

    await expect(page.getByText("Wishlist", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Don't wish" }).click();
    await expect(page.getByText("Don't wish")).toBeVisible();

    await page.reload();

    await expect(page.getByText("Don't wish")).toBeVisible();
  });
});
