// README for SauceDemo Checkout Test Suite
// This file documents all the test files created

/*
SAUCEDEMO CHECKOUT TEST SUITE - COMPLETE DOCUMENTATION
=====================================================

## Created Test Files

### 1. happy-path.spec.js
Tests the complete successful checkout flow and order completion
- TC 4.1 & 4.2: Complete successful order with confirmation
- TC 4.3: Cart reset after successful order
- TC 1.2 & 3.2: Order calculations (totals, tax)
- Covers: Login → Add Items → Cart → Checkout Form → Review → Confirmation

### 2. form-validation.spec.js
Tests all checkout form validation scenarios
- TC 2.1: Valid checkout information submission
- TC 2.2: Empty First Name error handling
- TC 2.3: Empty Last Name error handling
- TC 2.4: Empty Zip Code error handling
- TC 2.5: All empty fields validation
- TC 2.8: Numeric-only First Name acceptance
- TC 2.9: Form data preservation on validation error
- Covers: Required field validation, error messages, field preservation

### 3. special-characters.spec.js
Tests handling of special characters in form inputs
- TC 2.6: Apostrophes and hyphens in names (Jean-Claude, O'Brien)
- TC 5.6: International accented characters (François, José)
- Multiple special character combinations
- Various postal code formats (standard, zip+4)
- Covers: Character encoding, punctuation, international text

### 4. order-overview.spec.js
Tests order summary page display and calculations
- TC 3.1: Order overview displays all required sections
- TC 3.2: Price calculation validation (subtotal, tax, total)
- TC 3.3: Navigation buttons on overview page
- TC 3.4: Multiple items display with correct quantities
- TC 4.4: Order details retained through confirmation
- Price display validation with multiple items
- Covers: Summary page, calculations, navigation, data consistency

### 5. edge-cases.spec.js
Tests boundary conditions and edge case scenarios
- TC 5.2: Single character inputs (A, B, 1)
- TC 5.3: Very long string inputs (100+ characters)
- TC 5.4: Whitespace-only input handling
- TC 5.5: Multiple zip code formats (5-digit, zip+4)
- TC 5.7: Mixed case name handling (JoHn, DoE)
- Numbers and symbols in names
- Unicode/international characters
- Tab navigation between form fields
- Covers: Input boundaries, format variations, keyboard navigation

## Test Credentials
- Username: standard_user
- Password: secret_sauce
- URL: https://www.saucedemo.com

## Running the Tests

### Run all tests
npx playwright test tests/saucedemo-checkout/

### Run specific test file
npx playwright test tests/saucedemo-checkout/happy-path.spec.js
npx playwright test tests/saucedemo-checkout/form-validation.spec.js
npx playwright test tests/saucedemo-checkout/special-characters.spec.js
npx playwright test tests/saucedemo-checkout/order-overview.spec.js
npx playwright test tests/saucedemo-checkout/edge-cases.spec.js

### Run with specific browser
npx playwright test tests/saucedemo-checkout/ --project=chromium
npx playwright test tests/saucedemo-checkout/ --project=firefox

### Run with UI mode (interactive)
npx playwright test tests/saucedemo-checkout/ --ui

### Run in debug mode
npx playwright test tests/saucedemo-checkout/ --debug

### View test report
npx playwright show-report

## Test Coverage Summary

Total Tests: 35+
- Happy Path: 4 tests
- Form Validation: 8 tests
- Special Characters: 7 tests
- Order Overview: 6 tests
- Edge Cases: 10+ tests

Coverage Areas:
✓ Login & Authentication
✓ Add to Cart functionality
✓ Cart management & display
✓ Checkout form validation
✓ Form error handling
✓ Special character support
✓ International text support
✓ Order summary & calculations
✓ Price totals & tax calculation
✓ Order confirmation
✓ Cart reset after order
✓ Edge cases & boundary conditions
✓ Tab navigation
✓ Data preservation

## Key Selectors Used

Login Page:
- [data-test="username"] - Username input
- [data-test="password"] - Password input
- [data-test="login-button"] - Login button

Inventory Page:
- [data-test="add-to-cart-{product-id}"] - Add to cart buttons
- [data-test="shopping-cart-link"] - Shopping cart link

Cart Page:
- [data-test="continue-shopping"] - Continue shopping button
- [data-test="checkout"] - Checkout button

Checkout Form (Step 1):
- [data-test="firstName"] - First name input
- [data-test="lastName"] - Last name input
- [data-test="postalCode"] - Postal code input
- [data-test="continue"] - Continue button

Order Overview (Step 2):
- [data-test="finish"] - Finish/Complete button
- [data-test="back-to-products"] - Return to products

## Best Practices Implemented

✓ beforeEach hooks for test setup (login)
✓ Explicit waits for navigation
✓ Page URL verification
✓ Accessibility-focused selectors (data-test attributes)
✓ Error message verification
✓ Input preservation testing
✓ Multiple assertion types
✓ Test data organization
✓ Clear test names matching test plan
✓ Comprehensive error handling

## Notes

- All tests use the provided test credentials (standard_user / secret_sauce)
- Tests are designed to run against https://www.saucedemo.com
- Playwright will automatically retry failed tests (configured in playwright.config.js)
- Tests generate HTML reports in playwright-report/ directory
- Tests use chromium, firefox, and webkit by default
- Timeout is 30 seconds per test (Playwright default)

## Expected Results

All 35+ tests should pass successfully. If any tests fail:
1. Check network connectivity to saucedemo.com
2. Verify credentials are still valid
3. Check Playwright version compatibility
4. Review test output and error messages
5. Run tests in debug mode for investigation

## References

Test Plan: specs/saucedemo-checkout-test-plan.md
Exploratory Testing Results: exploratory-testing-results.md
Playwright Docs: https://playwright.dev/docs/intro
*/
