// @ts-check
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

test("the board has 9 squares", async ({ page }) => {
    const squares = page.locator(".square");
    await expect(squares).toHaveCount(9);
});

test("players take turns", async ({ page }) => {
    const squares = page.locator(".square");
    let texts;

    await squares.nth(0).click();
    texts = await squares.nth(0).textContent();
    expect(texts).toEqual("X");

    await squares.nth(1).click({ button: "right" });
    texts = await squares.nth(1).textContent();
    expect(texts).toEqual("O");
});
