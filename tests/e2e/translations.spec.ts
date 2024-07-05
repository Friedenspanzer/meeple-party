import { Page, expect, test } from "@playwright/test";
import { Role } from "@prisma/client";
import {
  addGamesToCollection,
  befriendUser,
  createUser,
  logInAsNewUser,
} from "./utility";

const WINGSPAN = 266192;

test.describe("Game name translations", () => {
  test.beforeEach(async ({ page }) => {
    const user = await logInAsNewUser(page.context(), Role.USER);
    await addGamesToCollection(user.id, [WINGSPAN]);
  });
  test("is translated on game detail page", async ({ page }) => {
    await page.goto(`/app/game/${WINGSPAN}`);
    await expect(page.getByText("Wingspan", { exact: true })).toBeVisible();

    await setPageToGerman(page);

    await page.goto(`/app/game/${WINGSPAN}`);
    await expect(page.getByText("Flügelschlag", { exact: true })).toBeVisible();
  });
  test("is translated in collection", async ({ page }) => {
    await page.goto("/app/collection");
    await expect(page.getByText("Wingspan", { exact: true })).toBeVisible();

    await setPageToGerman(page);

    await page.goto("/app/collection");
    await expect(page.getByText("Flügelschlag", { exact: true })).toBeVisible();
  });
  test("is translated in friend collection updates", async ({ page }) => {
    const me = await logInAsNewUser(page.context());
    const friend = await createUser();
    await addGamesToCollection(friend.id, [WINGSPAN]);
    await befriendUser(me.id, friend.id);

    await page.goto("/app/friends");
    await expect(
      page.getByText(`${friend.name} now owns Wingspan`, { exact: true })
    ).toBeVisible();

    await setPageToGerman(page);

    await page.goto("/app/friends");
    await expect(
      page.getByText(`${friend.name} hat Flügelschlag`, { exact: true })
    ).toBeVisible();
  });
});

async function setPageToGerman(page: Page) {
  await page.goto("/app/profile/edit/settings");
  await page.getByRole("button", { name: "German" }).first().click();
}
