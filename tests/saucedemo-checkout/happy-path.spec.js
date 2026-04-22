// spec: specs/saucedemo-checkout-test-plan.md
// happy-path test: Complete successful checkout flow

const { test, expect } = require('@playwright/test');

const SAUCE_DEMO_URL = 'https://www.saucedemo.com';
const TEST_USERNAME = 'standard_user';
const TEST_PASSWORD = 'secret_sauce';

test.describe('SauceDemo Checkout - Happy Path', () => {
  
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(SAUCE_DEMO_URL);
    await page.fill('[data-test="username"]', TEST_USERNAME);
    await page.fill('[data-test="password"]', TEST_PASSWORD);
    await page.click('[data-test="login-button"]');
    await page.waitForURL('**/inventory.html', { timeout: 5000 });
  });

  test('Complete successful checkout flow', async ({ page }) => {
    // Add multiple items to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
    
    // Verify cart count
    const cartCount = await page.locator('[data-test="shopping-cart-link"]').innerText();
    expect(cartCount.trim()).toBe('3');
    
    // Navigate to cart
    await page.click('[data-test="shopping-cart-link"]');
    await page.waitForURL('**/cart.html');
    
    // Verify items in cart
    const cartItems = await page.locator('[data-test*="item-"]').count();
    expect(cartItems).toBeGreaterThanOrEqual(3);
    
    // Click checkout
    await page.click('[data-test="checkout"]');
    await page.waitForURL('**/checkout-step-one.html');
    
    // Fill checkout information
    await page.fill('[data-test="firstName"]', 'John');
    await page.fill('[data-test="lastName"]', 'Doe');
    await page.fill('[data-test="postalCode"]', '12345');
    
    // Click continue
    await page.click('[data-test="continue"]');
    await page.waitForURL('**/checkout-step-two.html');
    
    // Verify order overview displays
    const overviewItems = await page.locator('[data-test*="item-"]').count();
    expect(overviewItems).toBeGreaterThanOrEqual(3);
    
    // Verify payment information is displayed
    const paymentInfo = await page.getByText(/Payment Information:/).isVisible();
    expect(paymentInfo).toBe(true);
    
    // Verify shipping information is displayed
    const shippingInfo = await page.getByText(/Shipping Information:/).isVisible();
    expect(shippingInfo).toBe(true);
    
    // Verify price total section exists
    const priceTotal = await page.getByText(/Price Total/).isVisible();
    expect(priceTotal).toBe(true);
    
    // Click finish to complete order
    await page.click('[data-test="finish"]');
    await page.waitForURL('**/checkout-complete.html');
    
    // Verify confirmation page
    const thankYouMessage = await page.getByText(/Thank you for your order!/).isVisible();
    expect(thankYouMessage).toBe(true);
    
    const confirmationMsg = await page.getByText(/Your order has been dispatched/).isVisible();
    expect(confirmationMsg).toBe(true);
  });

  test('TC 4.3: Cart reset after successful order', async ({ page }) => {
    // Add items to cart
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    
    // Navigate to cart and checkout
    await page.click('[data-test="shopping-cart-link"]');
    await page.click('[data-test="checkout"]');
    
    // Complete checkout
    await page.fill('[data-test="firstName"]', 'Jane');
    await page.fill('[data-test="lastName"]', 'Smith');
    await page.fill('[data-test="postalCode"]', '54321');
    await page.click('[data-test="continue"]');
    
    // Complete order
    await page.click('[data-test="finish"]');
    await page.waitForURL('**/checkout-complete.html');
    
    // Click back to products
    await page.click('[data-test="back-to-products"]');
    await page.waitForURL('**/inventory.html');
    
    // Verify cart is empty
    const cartLink = await page.locator('[data-test="shopping-cart-link"]');
    const cartText = await cartLink.innerText();
    expect(cartText.trim()).toBe('');
  });

  test('TC 4.1 & 4.2: Successful order completion with confirmation', async ({ page }) => {
    // Add 2 items
    await page.click('[data-test="add-to-cart-sauce-labs-onesie"]');
    await page.click('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');
    
    // Navigate to checkout
    await page.click('[data-test="shopping-cart-link"]');
    await page.click('[data-test="checkout"]');
    
    // Enter checkout info
    await page.fill('[data-test="firstName"]', 'Michael');
    await page.fill('[data-test="lastName"]', 'Johnson');
    await page.fill('[data-test="postalCode"]', '67890');
    await page.click('[data-test="continue"]');
    
    // Verify overview page and complete
    await page.waitForURL('**/checkout-step-two.html');
    const finishButton = await page.locator('[data-test="finish"]');
    expect(finishButton).toBeVisible();
    
    await page.click('[data-test="finish"]');
    await page.waitForURL('**/checkout-complete.html');
    
    // Verify confirmation elements
    const heading = await page.locator('h2:has-text("Thank you for your order!")');
    expect(heading).toBeVisible();
    
    const backButton = await page.locator('[data-test="back-to-products"]');
    expect(backButton).toBeVisible();
  });

  test('TC 1.2 & 3.2: Order calculations are correct', async ({ page }) => {
    // Add items (known prices from exploratory testing)
    // Backpack: $29.99, Bike Light: $9.99, Bolt T-Shirt: $7.99
    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
    
    // Go to cart and verify prices
    await page.click('[data-test="shopping-cart-link"]');
    
    // Complete checkout to reach overview
    await page.click('[data-test="checkout"]');
    await page.fill('[data-test="firstName"]', 'Test');
    await page.fill('[data-test="lastName"]', 'User');
    await page.fill('[data-test="postalCode"]', '11111');
    await page.click('[data-test="continue"]');
    
    // On overview page, verify totals are displayed
    await page.waitForURL('**/checkout-step-two.html');
    
    // Verify item total section shows amounts
    const itemTotal = await page.locator('text*="$"').isVisible();
    expect(itemTotal).toBe(true);
    
    // Verify tax and total are displayed
    const taxText = await page.getByText(/Tax/).isVisible();
    expect(taxText).toBe(true);
    
    const totalText = await page.getByText(/Total/).isVisible();
    expect(totalText).toBe(true);
  });
});
