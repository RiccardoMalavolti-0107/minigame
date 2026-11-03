// @ts-check
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
});

async function play(squares, moves) {
    for (const [turn, square] of moves.entries()) {
        await squares.nth(square).click({ button: turn % 2 === 0 ? "left" : "right" });
    }
}

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

test("the same player cannot move twice", async ({ page }) => {
    const squares = page.locator(".square");

    await squares.nth(0).click();
    await squares.nth(1).click();

    await expect(squares.nth(1)).toHaveText("");
});

test("an occupied square cannot be changed", async ({ page }) => {
    const squares = page.locator(".square");

    await squares.nth(0).click();
    await squares.nth(0).click({ button: "right" });

    await expect(squares.nth(0)).toHaveText("X");
});

test("a win ends the game and prevents further moves", async ({ page }) => {
    const squares = page.locator(".square");

    await play(squares, [0, 3, 1, 4, 2]);
    await expect(page.getByText(/Vége\. X győzött\./)).toBeVisible();

    const boardAfterWin = await squares.allTextContents();
    await squares.nth(5).click({ button: "right" });
    await expect(squares).toHaveText(boardAfterWin);
});

test("a full board without a winning line is a draw", async ({ page }) => {
    const squares = page.locator(".square");

    await play(squares, [0, 1, 2, 4, 3, 5, 7, 6, 8]);

    await expect(page.getByText("Döntetlen! Nincs győztes.")).toBeVisible();
});

test("the reset button clears a finished game", async ({ page }) => {
    const squares = page.locator(".square");

    await play(squares, [0, 3, 1, 4, 2]);
    await page.getByRole("button", { name: "Ujra" }).click();

    await expect(squares).toHaveText(["", "", "", "", "", "", "", "", ""]);
});

test("only the most recent move is highlighted", async ({ page }) => {
    const squares = page.locator(".square");

    await squares.nth(0).click();
    await expect(squares.nth(0)).toHaveClass(/lastcell/);

    await squares.nth(1).click({ button: "right" });
    await expect(squares.nth(0)).not.toHaveClass(/lastcell/);
    await expect(squares.nth(1)).toHaveClass(/lastcell/);
});

test("emoji avatars appear correctly on the board", async ({ page }) => {
    const squares = page.locator(".square");

    await page.locator("#XPlayerAvatar").fill("😀");
    await page.locator("#OPlayerAvatar").fill("👩‍🚀");
    await page.locator("#set-avatar").click();
    await squares.nth(0).click();
    await squares.nth(1).click({ button: "right" });

    await expect(squares.nth(0)).toHaveText("😀");
    await expect(squares.nth(1)).toHaveText("👩‍🚀");
});
