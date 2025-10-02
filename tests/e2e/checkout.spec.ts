// Scaffolded - E2E test for checkout flow
// Design choice: Comprehensive user journey testing

import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should complete checkout with Stripe', async ({ page }) => {
    // Add product to cart
    await page.click('[data-testid="product-card"]:first-child');
    await page.click('[data-testid="add-to-cart"]');
    
    // Go to cart
    await page.click('[data-testid="cart-icon"]');
    await expect(page.locator('[data-testid="cart-item"]')).toBeVisible();
    
    // Proceed to checkout
    await page.click('[data-testid="checkout-button"]');
    
    // Fill shipping information
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="address"]', '123 Main St');
    await page.fill('[name="city"]', 'New York');
    await page.fill('[name="postalCode"]', '10001');
    
    // Select payment method
    await page.click('[data-testid="payment-stripe"]');
    
    // Mock Stripe payment
    await page.fill('[data-testid="card-number"]', '4242424242424242');
    await page.fill('[data-testid="card-expiry"]', '12/25');
    await page.fill('[data-testid="card-cvc"]', '123');
    
    // Complete order
    await page.click('[data-testid="place-order"]');
    
    // Verify success
    await expect(page.locator('[data-testid="order-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="order-number"]')).toBeVisible();
  });

  test('should handle payment failure gracefully', async ({ page }) => {
    // Similar flow but with declined card
    // Implementation details...
  });
});
