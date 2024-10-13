import { expect, test } from "@playwright/test";
import {
  befriendUser,
  createUser,
  logInAsNewUser,
  sendFriendRequest,
} from "./utility";

test.describe("Friend requests on profile page", () => {
  test("can send friend request", async ({ page }) => {
    const myself = await logInAsNewUser(page.context());
    const otherUser = await createUser();

    page.goto(`/app/profile/${otherUser.id}`);
    await page.getByRole("button", { name: "Send friend request" }).click();
    await expect(
      page.getByRole("button", { name: "Withdraw your friend request" })
    ).toBeVisible();
  });
  test("can withdraw friend request", async ({ page }) => {
    const myself = await logInAsNewUser(page.context());
    const otherUser = await createUser();

    await sendFriendRequest(myself.id, otherUser.id);

    page.goto(`/app/profile/${otherUser.id}`);
    await page
      .getByRole("button", { name: "Withdraw your friend request" })
      .click();
    await expect(
      page.getByRole("button", { name: "Send friend request" })
    ).toBeVisible();
  });
  test("can end friendships", async ({ page }) => {
    const myself = await logInAsNewUser(page.context());
    const otherUser = await createUser();

    await befriendUser(myself.id, otherUser.id);

    page.goto(`/app/profile/${otherUser.id}`);
    await page.getByRole("button", { name: "End friendship" }).click();
    await expect(
      page.getByRole("button", { name: "Send friend request" })
    ).toBeVisible();
  });
  test("can accept friend request", async ({ page }) => {
    const myself = await logInAsNewUser(page.context());
    const otherUser = await createUser();

    await sendFriendRequest(otherUser.id, myself.id);

    page.goto(`/app/profile/${otherUser.id}`);
    await page
      .getByRole("button", { name: "Accept" })
      .click();
    await expect(
      page.getByRole("button", { name: "End friendship" })
    ).toBeVisible();
  });
  test("can deny friend request", async ({ page }) => {
    const myself = await logInAsNewUser(page.context());
    const otherUser = await createUser();

    await sendFriendRequest(otherUser.id, myself.id);

    page.goto(`/app/profile/${otherUser.id}`);
    await page
      .getByRole("button", { name: "Deny" })
      .click();
    await expect(
      page.getByRole("button", { name: "Send friend request" })
    ).toBeVisible();
  });
});
