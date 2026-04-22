// spec: specs/saucedemo-checkout-test-plan.md
// special-characters test: Handling special characters in names

const { test, expect } = require('@playwright/test');

const SAUCE_DEMO_URL = 'https://www.saucedemo.com';
const TEST_USERNAME = 'standard_user';
const TEST_PASSWORD = 'secret_sauce';

test.describe('SauceDemo Checkout - Special Characters', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login and add item to cart
    await page.goto(SAUCE_DEMO_URL);
    await page.fill('[data-test="username"]', TEST_USERNAME);
    await page.fill('[data-test="password"]', TEST_PASSWORD);
    await page.click('[data-test="login-button"]');
    await page.waitForURL('**/inventory.html', { timeout: 5000 });
    
    // Add item to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    // Navigate to checkout form
    await page.click('[data-test="shopping-cart-link"]');
    await page.click('[data-test="checkout"]');
    await page.waitForURL('**/checkout-step-one.html', { timeout: 5000 });
  });

  test('TC 2.6: Input with special characters (apostrophe and hyphen)', async ({ page }) => {
    // Test data with special characters
    await page.fill('[data-test="firstName"]', 'Jean-Claude');
    await page.fill('[data-test="lastName"]', 'O\'Brien');
    await page.fill('[data-test="postalCode"]', '12345-6789');
    
    // Submit
    await page.click('[data-test="continue"]');
    
    // Should successfully proceed to overview
    await page.waitForURL('**/checkout-step-two.html');
    expect(page.url()).toContain('checkout-step-two');
  });

  test('TC 5.6: International character handling (accented characters)', async ({ page }) => {
    // Test with accented characters
    await page.fill('[data-test="firstName"]', 'François');
    await page.fill('[data-test="lastName"]', 'José');
    await page.fill('[data-test="postalCode"]', '75001');
    
    // Submit
    await page.click('[data-test="continue"]');
    
    // Should successfully proceed
    await page.waitForURL('**/checkout-step-two.html');
    expect(page.url()).toContain('checkout-step-two');
  });

  test('O\'Connor-Smith with extended zip format', async ({ page }) => {
    // Test with complex name and zip format
    await page.fill('[data-test="firstName"]', 'Mary');
    await page.fill('[data-test="lastName"]', 'O\'Connor-Smith');
    await page.fill('[data-test="postalCode"]', '54321-9876');
    
    // Submit
    await page.click('[data-test="continue"]');
    
    // Should successfully proceed
    await page.waitForURL('**/checkout-step-two.html');
    expect(page.url()).toContain('checkout-step-two');
  });

  test('Multiple special characters in names', async ({ page }) => {
    // Test with various special characters
    await page.fill('[data-test="firstName"]', 'Jean-Paul');
    await page.fill('[data-test="lastName"]', 'D\'Artagnan-Smith');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // Submit
    await page.click('[data-test="continue"]');
    
    // Should successfully proceed
    await page.waitForURL('**/checkout-step-two.html');
    expect(page.url()).toContain('checkout-step-two');
  });

  test('Numeric characters in postal code variations', async ({ page }) => {
    // Test different postal code formats
    const testCases = [
      { firstName: 'Test', lastName: 'User', zip: '12345' },
      { firstName: 'Test', lastName: 'User', zip: '12345-6789' },
      { firstName: 'Test', lastName: 'User', zip: 'A1B2C3' }
    ];
    
    for (const testCase of testCases) {
      await page.fill('[data-test="firstName"]', testCase.firstName);
      await page.fill('[data-test="lastName"]', testCase.lastName);
      await page.fill('[data-test="postalCode"]', testCase.zip);
      
      await page.click('[data-test="continue"]');
      
      // Should proceed or show validation error (both are valid behaviors)
      try {
        await page.waitForURL('**/checkout-step-two.html', { timeout: 3000 });
      } catch (e) {
        // If validation error, that's also acceptable
        const error = await page.locator('text*="is required"').isVisible();
        expect(error).toBe(false); // Shouldn't be "required" error for special chars
      }
      
      // Go back to form for next iteration
      if (page.url().includes('checkout-step-two')) {
        await page.goBack();
        await page.waitForURL('**/checkout-step-one.html');
      }
    }
  });

  test('Names with punctuation marks', async ({ page }) => {
    // Test with common punctuation
    await page.fill('[data-test="firstName"]', 'Mary-Ann');
    await page.fill('[data-test="lastName"]', 'St. James');
    await page.fill('[data-test="postalCode"]', '90210');
    
    // Submit
    await page.click('[data-test="continue"]');
    
    // Should successfully proceed
    await page.waitForURL('**/checkout-step-two.html');
    expect(page.url()).toContain('checkout-step-two');
  });

  test('Mixed special characters with numbers', async ({ page }) => {
    // Test mixed special characters and numbers
    await page.fill('[data-test="firstName"]', 'José-María');
    await page.fill('[data-test="lastName"]', 'García O\'Donnell');
    await page.fill('[data-test="postalCode"]', '28001');
    
    // Submit
    await page.click('[data-test="continue"]');
    
    // Should successfully proceed
    await page.waitForURL('**/checkout-step-two.html');
    expect(page.url()).toContain('checkout-step-two');
  });
});
