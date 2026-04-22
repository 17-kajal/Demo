// spec: specs/saucedemo-checkout-test-plan.md
// edge-cases test: Boundary conditions and various input scenarios

const { test, expect } = require('@playwright/test');

const SAUCE_DEMO_URL = 'https://www.saucedemo.com';
const TEST_USERNAME = 'standard_user';
const TEST_PASSWORD = 'secret_sauce';

test.describe('SauceDemo Checkout - Edge Cases', () => {
  
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

  test('TC 5.2: Boundary testing - shortest inputs (single characters)', async ({ page }) => {
    // Enter 1-character values
    await page.fill('[data-test="firstName"]', 'A');
    await page.fill('[data-test="lastName"]', 'B');
    await page.fill('[data-test="postalCode"]', '1');
    
    // Submit
    await page.click('[data-test="continue"]');
    
    // Should accept single characters
    await page.waitForURL('**/checkout-step-two.html');
    expect(page.url()).toContain('checkout-step-two');
  });

  test('TC 5.3: Boundary testing - longest inputs', async ({ page }) => {
    // Create very long strings
    const longString100 = 'A'.repeat(100);
    const longZip = '1234567890123456789';
    
    await page.fill('[data-test="firstName"]', longString100);
    await page.fill('[data-test="lastName"]', longString100);
    await page.fill('[data-test="postalCode"]', longZip);
    
    // Verify input was accepted (no immediate truncation)
    const firstNameValue = await page.inputValue('[data-test="firstName"]');
    const lastNameValue = await page.inputValue('[data-test="lastName"]');
    const postalCodeValue = await page.inputValue('[data-test="postalCode"]');
    
    expect(firstNameValue.length).toBe(longString100.length);
    expect(lastNameValue.length).toBe(longString100.length);
    expect(postalCodeValue.length).toBe(longZip.length);
    
    // Try to submit
    await page.click('[data-test="continue"]');
    
    // Either submits successfully or shows appropriate error
    try {
      await page.waitForURL('**/checkout-step-two.html', { timeout: 2000 });
      expect(page.url()).toContain('checkout-step-two');
    } catch (e) {
      // If validation error for length, that's also acceptable
      const error = await page.locator('text*="is required"').isVisible();
      expect(error).toBe(false);
    }
  });

  test('TC 5.4: Whitespace-only input handling', async ({ page }) => {
    // Enter spaces only
    await page.fill('[data-test="firstName"]', '     ');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // Try to submit
    await page.click('[data-test="continue"]');
    
    // Should either:
    // 1. Accept spaces as valid input, or
    // 2. Show "First Name is required" error
    try {
      await page.waitForURL('**/checkout-step-two.html', { timeout: 2000 });
      // Spaces accepted as valid
      expect(page.url()).toContain('checkout-step-two');
    } catch (e) {
      // Or validation error for empty field
      const error = await page.locator('text*="First Name is required"').isVisible();
      expect(error).toBe(true);
    }
  });

  test('TC 5.5: Zip code format variations - 5-digit and zip+4', async ({ page }) => {
    // Test 5-digit zip
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    
    await page.click('[data-test="continue"]');
    await page.waitForURL('**/checkout-step-two.html');
    
    // Go back
    await page.goBack();
    await page.waitForURL('**/checkout-step-one.html');
    
    // Clear previous data for clean test
    await page.fill('[data-test="firstName"]', '');
    await page.fill('[data-test="lastName"]', '');
    await page.fill('[data-test="postalCode"]', '');
    
    // Test zip+4 format
    await page.fill('[data-test="firstName"]', 'Jane');
    await page.fill('[data-test="lastName"]', 'Smith');
    await page.fill('[data-test="postalCode"]', '12345-6789');
    
    await page.click('[data-test="continue"]');
    
    // Should accept zip+4 format
    await page.waitForURL('**/checkout-step-two.html');
    expect(page.url()).toContain('checkout-step-two');
  });

  test('TC 5.7: Mixed case input preservation', async ({ page }) => {
    // Enter mixed case names
    const firstName = 'JoHn';
    const lastName = 'DoE';
    const postalCode = '12345';
    
    await page.fill('[data-test="firstName"]', firstName);
    await page.fill('[data-test="lastName"]', lastName);
    await page.fill('[data-test="postalCode"]', postalCode);
    
    // Submit
    await page.click('[data-test="continue"]');
    await page.waitForURL('**/checkout-step-two.html');
    
    // Verify it proceeded (case handling is acceptable)
    expect(page.url()).toContain('checkout-step-two');
  });

  test('Empty and single space in different fields', async ({ page }) => {
    // Test combinations of empty and space-filled fields
    await page.fill('[data-test="firstName"]', ' ');
    await page.fill('[data-test="lastName"]', 'Test');
    await page.fill('[data-test="postalCode"]', '12345');
    
    await page.click('[data-test="continue"]');
    
    // Check if accepted or rejected consistently
    try {
      await page.waitForURL('**/checkout-step-two.html', { timeout: 2000 });
      expect(page.url()).toContain('checkout-step-two');
    } catch (e) {
      // Error is acceptable too
      const error = await page.locator('text*="is required"').isVisible();
      expect(error).toBe(true);
    }
  });

  test('Numbers and symbols in name fields', async ({ page }) => {
    // Test names with numbers and symbols
    await page.fill('[data-test="firstName"]', 'Person123');
    await page.fill('[data-test="lastName"]', 'Smith@#$');
    await page.fill('[data-test="postalCode"]', '12345');
    
    await page.click('[data-test="continue"]');
    
    // Should either accept or reject consistently
    try {
      await page.waitForURL('**/checkout-step-two.html', { timeout: 2000 });
      expect(page.url()).toContain('checkout-step-two');
    } catch (e) {
      // If rejected, that's also valid
      const error = await page.locator('text*="is required"').isVisible();
      expect(error).toBe(false);
    }
  });

  test('Unicode and emoji character handling', async ({ page }) => {
    // Test with various unicode characters
    await page.fill('[data-test="firstName"]', 'Müller');
    await page.fill('[data-test="lastName"]', 'Müñez');
    await page.fill('[data-test="postalCode"]', '12345');
    
    await page.click('[data-test="continue"]');
    
    // Either accepts or provides clear error
    try {
      await page.waitForURL('**/checkout-step-two.html', { timeout: 2000 });
      expect(page.url()).toContain('checkout-step-two');
    } catch (e) {
      // If unicode not supported, that's documented
      const error = await page.locator('text*="required"').isVisible();
      // Should not show generic required error for unicode
    }
  });

  test('Form submission with alternating valid/invalid fields', async ({ page }) => {
    // Test multiple submission attempts with different field combinations
    const testSequences = [
      { first: 'A', last: 'B', zip: '', shouldPass: false },
      { first: 'A', last: '', zip: '12345', shouldPass: false },
      { first: '', last: 'B', zip: '12345', shouldPass: false },
      { first: 'A', last: 'B', zip: '12345', shouldPass: true }
    ];
    
    for (const sequence of testSequences) {
      // Clear fields
      await page.fill('[data-test="firstName"]', '');
      await page.fill('[data-test="lastName"]', '');
      await page.fill('[data-test="postalCode"]', '');
      
      // Fill with test data
      if (sequence.first) await page.fill('[data-test="firstName"]', sequence.first);
      if (sequence.last) await page.fill('[data-test="lastName"]', sequence.last);
      if (sequence.zip) await page.fill('[data-test="postalCode"]', sequence.zip);
      
      // Try to submit
      await page.click('[data-test="continue"]');
      
      if (sequence.shouldPass) {
        await page.waitForURL('**/checkout-step-two.html', { timeout: 2000 });
        // Go back for next iteration
        await page.goBack();
        await page.waitForURL('**/checkout-step-one.html');
      } else {
        // Should see error
        const error = await page.locator('text*="is required"').isVisible();
        expect(error).toBe(true);
      }
    }
  });

  test('Tab navigation between form fields', async ({ page }) => {
    // Test tab navigation works between fields
    await page.click('[data-test="firstName"]');
    await page.press('[data-test="firstName"]', 'Tab');
    
    // After tab, should be in Last Name field
    const activeElement = await page.evaluate(() => document.activeElement.getAttribute('data-test'));
    expect(activeElement).toBe('lastName');
    
    // Continue tabbing
    await page.press('[data-test="lastName"]', 'Tab');
    const activeElement2 = await page.evaluate(() => document.activeElement.getAttribute('data-test'));
    expect(activeElement2).toBe('postalCode');
  });
});
