import { test, expect } from '@playwright/test';

test.describe('Basic User Flow', () => {
  test('should navigate to home page and see products', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Camera Glaze Forge/);
    
    // Check if products are loaded
    await expect(page.locator('.product-card')).toBeVisible();
  });

  test('should open product details', async ({ page }) => {
    await page.goto('/');
    await page.locator('.product-card').first().click();
    
    // Check if product details are displayed
    await expect(page.locator('#product-main-image')).toBeVisible();
    await expect(page.locator('.product-title')).toBeVisible();
  });

  test('should add product to cart', async ({ page }) => {
    await page.goto('/');
    await page.locator('.product-card').first().click();
    
    // Add to cart
    await page.locator('button:has-text("Add to Cart")').click();
    
    // Verify cart is updated
    await expect(page.locator('#cart-count')).toBeVisible();
    await expect(page.locator('#cart-count')).not.toHaveText('0');
  });

  test('should complete checkout process', async ({ page }) => {
    // Add item to cart first
    await page.goto('/');
    await page.locator('.product-card').first().click();
    await page.locator('button:has-text("Add to Cart")').click();
    
    // Go to cart
    await page.locator('#cart-button').click();
    
    // Proceed to checkout
    await page.locator('button:has-text("Checkout")').click();
    
    // Verify we're on checkout page
    await expect(page).toHaveURL(/\/checkout/);
  });
});