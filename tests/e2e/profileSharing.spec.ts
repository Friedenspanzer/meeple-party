import { expect, test } from "@playwright/test";
import { logInAsNewUser } from "./utility";

test.describe("Profile sharing", () => {
  test("can share my own profile", async ({ page, browserName }) => {
    test.skip(
      browserName === "webkit",
      "Webkit supports the share sheet and sharing works differently."
    );

    const me = await logInAsNewUser(page.context());

    await page.goto(`/app/profile/${me.id}`);

    const button = await page.getByRole("button", {
      name: "Share your profile",
    });
    await expect(button).toBeVisible();
    await button.click();

    await expect(page.getByRole("textbox")).toHaveValue(
      `http://127.0.0.1:3000/profile/${me.id}`
    );
  });
});
