import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('has title in home overlay', async ({ page }) => {
  await expect(page).toHaveTitle(/amazon mining watch/i);
  await expect(page.locator('h1')).toContainText(
    /track mining in the rainforest/i
  );
});

test('overlay starts with loading state', async ({ page }) => {
  await expect(page.getByText(/loading/i)).toBeVisible();
});

test('explore map button hiddes the overlay', async ({ page }) => {
  await page.getByRole('link', { name: /explore map/i }).click();
  await expect(
    page.getByText(/track mining in the rainforest/i)
  ).not.toBeVisible();
});

test('explore map mode shows area and year buttons', async ({ page }) => {
  await page.getByRole('link', { name: /explore map/i }).click();
  await expect(page.getByText(/area affected/i)).toBeVisible();
  await expect(page.getByText(/2018/i)).toBeVisible();
  // await expect(page.getByRole('radio', { name: /2023/i })).toBeVisible();
  await expect(page.locator('span').getByText(/2023/i)).toHaveCount(2);
  await expect(page.getByText(/yearly/i)).toBeVisible();
  await expect(page.getByText(/hi-res/i)).toBeVisible();
});
