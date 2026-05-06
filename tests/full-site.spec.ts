import { test, expect } from '@playwright/test';

test.describe('RuangRiung Website E2E Test', () => {
  
  test('Home page should load correctly', async ({ page }) => {
    await page.goto('/');
    // Check for the main title
    await expect(page.getByRole('heading', { name: /RUANGRIUNG/i })).toBeVisible();
    // Use a more flexible check for the subtitle
    await expect(page.getByText(/Transformasikan imajinasi Anda/i).first()).toBeVisible();
  });

  test('ID Card Generator page should be accessible', async ({ page }) => {
    await page.goto('/id-card-generator');
    await expect(page).toHaveURL(/\/id-card-generator/);
    await expect(page.locator('body')).not.toContainText('404');
  });

  test('UMKM page should be accessible', async ({ page }) => {
    await page.goto('/umkm');
    await expect(page).toHaveURL(/\/umkm/);
    await expect(page.locator('body')).not.toContainText('404');
  });

  test('Storyteller page should be accessible', async ({ page }) => {
    await page.goto('/storyteller');
    await expect(page).toHaveURL(/\/storyteller/);
    await expect(page.locator('body')).not.toContainText('404');
  });

  test('UniqueArtName page should be accessible', async ({ page }) => {
    await page.goto('/UniqueArtName');
    await expect(page).toHaveURL(/\/UniqueArtName/);
    await expect(page.locator('body')).not.toContainText('404');
  });

  test('Konten Kreator page should be accessible', async ({ page }) => {
    await page.goto('/konten-kreator');
    await expect(page).toHaveURL(/\/konten-kreator/);
  });

  test('Battle Ignite Friendship page should be accessible', async ({ page }) => {
    await page.goto('/battle-ignite-friendship');
    await expect(page).toHaveURL(/\/battle-ignite-friendship/);
  });

  test('Check links to articles and community', async ({ page }) => {
    await page.goto('/');
    const fbLink = page.locator('a[href*="facebook.com"]').first();
    await expect(fbLink).toBeVisible();
    
    // Check for FAQ section
    await expect(page.getByText('FAQ', { exact: false }).first()).toBeVisible();
  });
});
