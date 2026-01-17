import { test, expect } from "@playwright/test";

test("should not make infinite hashtag endpoint requests", async ({ page }) => {
      const requests = [];

      page.on("request", (request) => {
            if (request.url().includes("/hashtag/do") &&
                  request.resourceType() === "fetch") {
                  requests.push(request);
            }
      });

      // Clear localStorage for clean state
      await page.goto("/");
      await page.evaluate(() => localStorage.clear());

      // Navigate to hashtag page
      await page.goto("#/hashtag/do");

      // Wait to see if multiple requests are made
      await page.waitForTimeout(500);

      // Should only attempt 1 request (even if it fails)
      expect(requests.length).toEqual(1);
});

test("should not loop when hashtag has no blooms", async ({ page }) => {
      const requests = [];

      page.on("request", (request) => {
            if (request.url().includes("/hashtag/nonexistent") &&
                  request.resourceType() === "fetch") {
                  requests.push(request);
            }
      });

      await page.goto("/");
      await page.evaluate(() => localStorage.clear());

      await page.goto("#/hashtag/nonexistent");
      await page.waitForTimeout(500);

      expect(requests.length).toEqual(1);
});