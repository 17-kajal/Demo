# SauceDemo E-Commerce Checkout Test Plan

## Overview
Comprehensive test plan for the SauceDemo e-commerce checkout process (https://www.saucedemo.com) covering cart review, checkout information entry, order overview, order completion, and error handling scenarios.

**Test Credentials:** Username: standard_user | Password: secret_sauce

---

## Test Suite 1: Cart Review and Navigation

### TC 1.1: Display items in cart with correct details
**Steps:**
1. Login with username: standard_user, password: secret_sauce
2. Add at least 3 different items to cart
3. Navigate to the cart page
4. Verify each item displays: name, price, quantity selector, remove button

**Expected Results:**
- Cart loads successfully
- All items display with correct details
- Item prices match catalog
- Remove buttons are functional

---

### TC 1.2: View cart summary and totals
**Steps:**
1. Add items with varying quantities
2. Navigate to cart page
3. Verify subtotal calculation: sum of (price × quantity)
4. Verify total displays correctly

**Expected Results:**
- Subtotal is correct
- Total is accurate
- Item count updates on removal
- Totals recalculate automatically

---

### TC 1.3: Navigation from cart to checkout
**Steps:**
1. Add items to cart
2. Navigate to cart page
3. Click Checkout button
4. Verify Continue Shopping button works

**Expected Results:**
- Checkout Information page displays
- Continue Shopping returns to products

---

### TC 1.4: Back button and navigation controls from cart
**Steps:**
1. Navigate to cart from products
2. Click browser back button
3. Click Continue Shopping if available

**Expected Results:**
- Navigate back to products page
- Cart data is preserved
- Continue Shopping returns to products

---

## Test Suite 2: Checkout Information Entry

### TC 2.1: Successfully enter valid checkout information
**Test Data:** First Name: John | Last Name: Doe | Zip: 12345

**Steps:**
1. Login with standard_user / secret_sauce
2. Add 1+ items to cart
3. Navigate to cart and click Checkout
4. Enter all required fields
5. Click Continue

**Expected Results:**
- Form validates successfully
- Navigate to Order Overview page
- Information is preserved

---

### TC 2.2: Error on empty First Name
**Steps:**
1. Go to Checkout Information page with cart items
2. Leave First Name empty
3. Enter Last Name: Doe, Zip: 12345
4. Click Continue

**Expected Results:**
- Error: "First Name is required"
- Form does not submit
- User remains on form page

---

### TC 2.3: Error on empty Last Name
**Steps:**
1. Go to Checkout Information page
2. Enter First Name: John, Zip: 12345
3. Leave Last Name empty
4. Click Continue

**Expected Results:**
- Error: "Last Name is required"
- Form does not submit

---

### TC 2.4: Error on empty Zip Code
**Steps:**
1. Go to Checkout Information page
2. Enter First Name: John, Last Name: Doe
3. Leave Zip Code empty
4. Click Continue

**Expected Results:**
- Error: "Zip Code is required"
- Form does not submit

---

### TC 2.5: Error on all empty fields
**Steps:**
1. Go to Checkout Information page
2. Click Continue without entering anything

**Expected Results:**
- Multiple error messages display
- Form does not submit
- User remains on form

---

### TC 2.6: Input with special characters
**Test Data:** First: Jean-Claude | Last: O'Brien | Zip: 12345-6789

**Steps:**
1. Enter names with hyphens and apostrophes
2. Enter extended zip format
3. Click Continue

**Expected Results:**
- Form accepts all special characters
- Navigate to Overview page

---

### TC 2.7: Input with very long strings
**Test Data:** First: 50+ chars | Last: 50+ chars | Zip: 123456789012345

**Steps:**
1. Enter very long text in all fields
2. Click Continue

**Expected Results:**
- Fields accept input without truncation
- Form submits with data preserved

---

### TC 2.8: Numeric-only First Name
**Test Data:** First: 12345 | Last: Doe | Zip: 12345

**Steps:**
1. Enter numeric First Name
2. Enter other fields
3. Click Continue

**Expected Results:**
- Form accepts numeric names
- Navigate to Overview succeeds

---

### TC 2.9: Cancel checkout and return to shopping
**Steps:**
1. Go to Checkout Information page
2. Click Cancel or browser back
3. Return to checkout later

**Expected Results:**
- Return to cart/products
- Previous info not saved
- Form fields empty on return

---

## Test Suite 3: Order Overview and Validation

### TC 3.1: Order overview displays items and shipping
**Steps:**
1. Complete checkout info with John | Doe | 12345
2. Verify all cart items display with details
3. Verify shipping section displays
4. Verify payment section displays

**Expected Results:**
- Overview page loads
- Items show: name, price, quantity
- Shipping and payment sections visible

---

### TC 3.2: Order overview calculations correct
**Steps:**
1. View overview page
2. Verify Subtotal = sum of (price × qty)
3. Verify Tax calculation
4. Verify Total = Subtotal + Tax

**Expected Results:**
- Subtotal correct
- Tax calculated properly
- Total matches manual calculation

---

### TC 3.3: Order overview navigation options
**Steps:**
1. Go to Order Overview page
2. Verify Finish button exists
3. Verify Cancel button exists
4. Click Cancel

**Expected Results:**
- Both buttons visible and clickable
- Cancel returns to products
- Checkout cancelled

---

### TC 3.4: Multiple items display on overview
**Steps:**
1. Add 5+ different items to cart
2. Complete checkout form
3. Verify all items display
4. Verify quantities correct

**Expected Results:**
- All items listed
- No duplicates
- Quantities accurate

---

## Test Suite 4: Order Completion and Confirmation

### TC 4.1: Successful order completion
**Steps:**
1. Complete cart, form, and review
2. Click Finish button
3. Verify redirect to confirmation page
4. Verify thank you message

**Expected Results:**
- Order processed successfully
- Confirmation page loads
- URL changes to thank you page
- Thank you message displays

---

### TC 4.2: Confirmation page elements
**Steps:**
1. Complete full checkout
2. Verify success message
3. Verify confirmation number if shown
4. Click Back Home / Continue Shopping
5. Verify return to products

**Expected Results:**
- Confirmation message displays
- Confirmation ID shown (if applicable)
- Button present and clickable
- Returns to products page

---

### TC 4.3: Cart reset after successful order
**Steps:**
1. Complete checkout to confirmation
2. Go back to products page
3. Check cart icon/count

**Expected Results:**
- Products page loads
- Cart is empty
- Cart count shows 0

---

### TC 4.4: Order details retained through confirmation
**Steps:**
1. Add specific items with quantities
2. Review order details
3. Complete order
4. Check confirmation matches review

**Expected Results:**
- Items in confirmation match review
- Quantities correct
- Totals match

---

## Test Suite 5: Error Handling and Edge Cases

### TC 5.1: Form data preserved on validation error
**Steps:**
1. Go to checkout form
2. Trigger error (empty field)
3. Verify data in other fields preserved

**Expected Results:**
- Error displays
- Entered data still visible in fields

---

### TC 5.2: Boundary testing - shortest inputs
**Test Data:** First: A | Last: B | Zip: 1

**Steps:**
1. Enter 1-character values
2. Click Continue

**Expected Results:**
- Single characters accepted
- No minimum length error
- Submits successfully

---

### TC 5.3: Boundary testing - longest inputs
**Test Data:** First: 100+ chars | Last: 100+ chars | Zip: 20+ digits

**Steps:**
1. Enter very long strings
2. Click Continue

**Expected Results:**
- No truncation error
- Accepts all input
- Submits or shows limit error consistently

---

### TC 5.4: Whitespace-only input handling
**Test Data:** First: '     ' (spaces only)

**Steps:**
1. Enter spaces in First Name
2. Click Continue

**Expected Results:**
- Either accepts or shows "required" error
- Behavior consistent

---

### TC 5.5: Zip code format variations
**Test Data:** 12345 (5-digit) and 12345-6789 (zip+4)

**Steps:**
1. Enter 5-digit zip
2. Click Continue and return
3. Enter zip+4 format
4. Click Continue

**Expected Results:**
- Both formats accepted
- Both process successfully

---

### TC 5.6: International character handling
**Test Data:** First: François | Last: José

**Steps:**
1. Enter names with accents
2. Click Continue

**Expected Results:**
- Accented characters accepted
- Characters preserved in submission

---

### TC 5.7: Mixed case input preservation
**Test Data:** First: JoHn | Last: DoE

**Steps:**
1. Enter mixed case names
2. Click Continue
3. Check confirmation

**Expected Results:**
- Mixed case accepted
- Case preserved or consistently transformed
- Confirmation shows consistent formatting

---

## Test Coverage Summary
- **Happy Path:** 1 test
- **Negative Scenarios:** 5 tests  
- **Edge Cases:** 7 tests
- **Navigation:** 4 tests
- **UI Validation:** 8 tests
- **Total:** 30 comprehensive test cases

## Prerequisites
- Application: https://www.saucedemo.com
- Credentials: standard_user / secret_sauce
- Browser: Chrome/Chromium (latest)
- Clear cache/cookies before tests
- Verify network connectivity

## Assumptions
- Application is accessible and functional
- Login credentials remain valid
- Products available in inventory
- All form fields visible and accessible
- Error messages display clearly
