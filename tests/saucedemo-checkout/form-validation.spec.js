// spec: specs/saucedemo-checkout-test-plan.md
// form-validation test: Required field validation

const { test, expect } = require('@playwright/test');

const SAUCE_DEMO_URL = 'https://www.saucedemo.com';
const TEST_USERNAME = 'standard_user';
const TEST_PASSWORD = 'secret_sauce';

test.describe('SauceDemo Checkout - Form Validation', () => {
  
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

  test('TC 2.2: Error on empty First Name', async ({ page }) => {
    // Leave First Name empty, fill other fields
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // Try to submit
    await page.click('[data-test="continue"]');
    
    // Verify error message
    const errorMsg = await page.getByText(/First Name is required/).isVisible();
    expect(errorMsg).toBe(true);
    
    // Verify still on form page
    await page.waitForURL('**/checkout-step-one.html');
    expect(page.url()).toContain('checkout-step-one');
  });

  test('TC 2.3: Error on empty Last Name', async ({ page }) => {
    // Fill First Name and Zip, leave Last Name empty
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // Try to submit
    await page.click('[data-test="continue"]');
    
    // Verify error message
    const errorMsg = await page.getByText(/Last Name is required/).isVisible();
    expect(errorMsg).toBe(true);
    
    // Verify still on form page
    expect(page.url()).toContain('checkout-step-one');
  });

  test('TC 2.4: Error on empty Zip Code', async ({ page }) => {
    // Fill name fields, leave Zip empty
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    
    // Try to submit
    await page.click('[data-test="continue"]');
    
    // Verify error message
    const errorMsg = await page.getByText(/Postal Code is required/).isVisible();
    expect(errorMsg).toBe(true);
    
    // Verify still on form page
    expect(page.url()).toContain('checkout-step-one');
  });

  test('TC 2.5: Error on all empty fields', async ({ page }) => {
    // Click continue without filling anything
    await page.click('[data-test="continue"]');
    
    // Verify error message appears (typically shows first field error)
    const errorMsg = await page.getByText(/is required/).isVisible();
    expect(errorMsg).toBe(true);
    
    // Verify still on form page
    expect(page.url()).toContain('checkout-step-one');
  });

  test('TC 2.9: Form data preserved on validation error', async ({ page }) => {
    // Fill First Name and Leave Last Name empty
    const firstName = 'Robert';
    const postalCode = '99999';
    
    await page.fill('[data-test="firstName"]', firstName);
    await page.fill('[data-test="postalCode"]', postalCode);
    
    // Try to submit (will fail due to missing Last Name)
    await page.click('[data-test="continue"]');
    
    // Verify error
    const errorMsg = await page.getByText(/Last Name is required/).isVisible();
    expect(errorMsg).toBe(true);
    
    // Verify First Name data is preserved
    const firstNameValue = await page.inputValue('[data-test="firstName"]');
    expect(firstNameValue).toBe(firstName);
    
    // Verify Postal Code data is preserved
    const postalCodeValue = await page.inputValue('[data-test="postalCode"]');
    expect(postalCodeValue).toBe(postalCode);
    
    // Verify Last Name is still empty
    const lastNameValue = await page.inputValue('[data-test="lastName"]');
    expect(lastNameValue).toBe('');
  });

  test('TC 5.1: Form data cleared after successful submission', async ({ page }) => {
    // Fill all fields
    await page.fill('[data-test="firstName"]', 'Alice');
    await page.fill('[data-test="lastName"]', 'Wonder');
    await page.fill('[data-test="postalCode"]', '11111');
    
    // Submit successfully
    await page.click('[data-test="continue"]');
    await page.waitForURL('**/checkout-step-two.html');
    
    // Go back (if using browser back or Cancel button)
    await page.goBack();
    await page.waitForURL('**/checkout-step-one.html');
    
    // Previous form data should not be retained (new checkout)
    const firstNameValue = await page.inputValue('[data-test="firstName"]');
    const lastNameValue = await page.inputValue('[data-test="lastName"]');
    const postalCodeValue = await page.inputValue('[data-test="postalCode"]');
    
    // Fields should be empty (fresh checkout)
    expect(firstNameValue).toBe('');
    expect(lastNameValue).toBe('');
    expect(postalCodeValue).toBe('');
  });

  test('TC 2.1: Successfully enter valid checkout information', async ({ page }) => {
    // Enter valid data
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // Click continue
    await page.click('[data-test="continue"]');
    
    // Should navigate to overview page
    await page.waitForURL('**/checkout-step-two.html');
    expect(page.url()).toContain('checkout-step-two');
  });

  test('TC 2.8: Numeric-only First Name is accepted', async ({ page }) => {
    // Enter numeric First Name
    await page.fill('[data-test="firstName"]', '12345');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // Submit
    await page.click('[data-test="continue"]');
    
    // Should successfully proceed
    await page.waitForURL('**/checkout-step-two.html');
    expect(page.url()).toContain('checkout-step-two');
  });
});
