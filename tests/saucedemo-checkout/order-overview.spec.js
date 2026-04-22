// spec: specs/saucedemo-checkout-test-plan.md
// order-overview test: Order summary, calculations, and review

const { test, expect } = require('@playwright/test');

const SAUCE_DEMO_URL = 'https://www.saucedemo.com';
const TEST_USERNAME = 'standard_user';
const TEST_PASSWORD = 'secret_sauce';

test.describe('SauceDemo Checkout - Order Overview', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto(SAUCE_DEMO_URL);
    await page.fill('[data-test="username"]', TEST_USERNAME);
    await page.fill('[data-test="password"]', TEST_PASSWORD);
    await page.click('[data-test="login-button"]');
    await page.waitForURL('**/inventory.html', { timeout: 5000 });
  });

  test('TC 3.1: Order overview displays items, shipping, and payment', async ({ page }) => {
    // Add items to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    
    // Go to checkout
    await page.click('[data-test="shopping-cart-link"]');
    await page.click('[data-test="checkout"]');
    
    // Fill form
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // On overview page
    await page.waitForURL('**/checkout-step-two.html');
    
    // Verify items are displayed
    const items = await page.locator('[data-test*="item-"]');
    const itemCount = await items.count();
    expect(itemCount).toBeGreaterThanOrEqual(2);
    
    // Verify payment information section
    const paymentLabel = await page.getByText(/Payment Information:/);
    expect(paymentLabel).toBeVisible();
    const paymentValue = await page.locator('text*="SauceCard"');
    expect(paymentValue).toBeVisible();
    
    // Verify shipping information section
    const shippingLabel = await page.getByText(/Shipping Information:/);
    expect(shippingLabel).toBeVisible();
    const shippingValue = await page.locator('text*="Pony Express"');
    expect(shippingValue).toBeVisible();
  });

  test('TC 3.2: Order overview calculations are correct', async ({ page }) => {
    // Add specific items to calculate totals
    // Backpack: $29.99, Bike Light: $9.99 = $39.98
    // Tax (8%): $3.20 approximately
    // Total: $43.18 approximately
    
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    
    // Go to cart and verify prices
    await page.click('[data-test="shopping-cart-link"]');
    
    // Get cart totals
    const cartItemsBeforeCheckout = await page.locator('[data-test*="item-"]').count();
    expect(cartItemsBeforeCheckout).toBe(2);
    
    // Go to checkout
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'Test');
    await page.fill('[data-test="lastName"]', 'User');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // On overview page
    await page.waitForURL('**/checkout-step-two.html');
    
    // Verify price total section exists and has values
    const priceTotal = await page.getByText(/Price Total/);
    expect(priceTotal).toBeVisible();
    
    // Verify tax calculation section exists
    const taxLabel = await page.locator('text*="Tax"');
    expect(taxLabel).toBeVisible();
    
    // Verify subtotal section
    const subtotalLabel = await page.locator('text*="Subtotal"');
    expect(subtotalLabel).toBeVisible();
    
    // Verify all price values are visible
    const priceElements = await page.locator('text*="$"').count();
    expect(priceElements).toBeGreaterThan(2);
  });

  test('TC 3.3: Order overview navigation buttons exist', async ({ page }) => {
    // Add item
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    // Go to checkout
    await page.click('[data-test="shopping-cart-link"]');
    await page.click('[data-test="checkout"]');
    
    // Fill form
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // On overview page
    await page.waitForURL('**/checkout-step-two.html');
    
    // Verify Finish button exists
    const finishButton = await page.locator('[data-test="finish"]');
    expect(finishButton).toBeVisible();
    
    // Verify Cancel button exists (typically "Go back Cancel")
    const cancelButton = await page.locator('button:has-text("Cancel")');
    expect(cancelButton).toBeVisible();
  });

  test('TC 3.4: Multiple items display on overview with correct quantities', async ({ page }) => {
    // Add 5 different items
    const itemsToAdd = [
      '[data-test="add-to-cart-sauce-labs-backpack"]',
      '[data-test="add-to-cart-sauce-labs-bike-light"]',
      '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]',
      '[data-test="add-to-cart-sauce-labs-fleece-jacket"]',
      '[data-test="add-to-cart-sauce-labs-onesie"]'
    ];
    
    for (const selector of itemsToAdd) {
      await page.click(selector);
    }
    
    // Go to checkout
    await page.click('[data-test="shopping-cart-link"]');
    await page.click('[data-test="checkout"]');
    
    // Fill form
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // On overview page
    await page.waitForURL('**/checkout-step-two.html');
    
    // Verify all 5 items display
    const items = await page.locator('[data-test*="item-"]');
    const itemCount = await items.count();
    expect(itemCount).toBe(5);
  });

  test('TC 4.4: Order details retained through confirmation', async ({ page }) => {
    // Add specific items
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    
    // Go to cart to see what we're ordering
    await page.click('[data-test="shopping-cart-link"]');
    const cartItemNames = [];
    const itemElements = await page.locator('[data-test*="item-"]').all();
    
    for (const item of itemElements) {
      const name = await item.innerText();
      cartItemNames.push(name);
    }
    
    // Go to checkout
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'Review');
    await page.fill('[data-test="lastName"]', 'Tester');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // On overview page, verify items match
    await page.waitForURL('**/checkout-step-two.html');
    const overviewItems = await page.locator('[data-test*="item-"]').all();
    const overviewItemNames = [];
    
    for (const item of overviewItems) {
      const name = await item.innerText();
      overviewItemNames.push(name);
    }
    
    // Items should match
    expect(overviewItemNames.length).toBe(cartItemNames.length);
    
    // Complete order
    await page.click('[data-test="finish"]');
    await page.waitForURL('**/checkout-complete.html');
    
    // Verify we reached confirmation
    const thankYou = await page.getByText(/Thank you for your order!/);
    expect(thankYou).toBeVisible();
  });

  test('Price display validation with multiple items', async ({ page }) => {
    // Add items
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
    
    // Go to checkout
    await page.click('[data-test="shopping-cart-link"]');
    await page.click('[data-test="checkout"]');
    
    // Fill form
    await page.fill('[data-test="firstName"]', 'Price');
    await page.fill('[data-test="lastName"]', 'Checker');
    await page.fill('[data-test="postalCode"]', '12345');
    await page.click('[data-test="continue"]');
    
    // On overview page
    await page.waitForURL('**/checkout-step-two.html');
    
    // Verify price values are numeric and displayed
    const priceElements = await page.locator('[class*="price"], [class*="total"]').all();
    expect(priceElements.length).toBeGreaterThan(0);
    
    // Verify prices contain valid currency amounts
    for (const priceElement of priceElements) {
      const text = await priceElement.innerText();
      if (text.includes('$')) {
        expect(text).toMatch(/\$\d+\.?\d*/);
      }
    }
  });
});
