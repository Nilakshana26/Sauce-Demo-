import { Selector } from 'testcafe';
import faker from 'faker';

fixture('Sauce Demo')
  .page('https://www.saucedemo.com')
  .beforeEach(async (t) => {
    // Login to the system
    await t.typeText('#user-name', 'performance_glitch_user')
      .typeText('#password', 'secret_sauce')
      .click('#login-button');
  });

test('Add two products to cart and complete checkout', async (t) => {
  // Check price of product
  const fleeceJacketPrice = await Selector('.inventory_item_price').withText('$49.99').innerText;

  // Add any two products into the cart
  const productAddToCartButtons = await Selector('.btn_inventory');
  await t.click(productAddToCartButtons.nth(0)).click(productAddToCartButtons.nth(1));

  // Verify if the selected items are in the cart
  await t.click('.shopping_cart_link');
  const cartItems = await Selector('.cart_item');
  await t.expect(cartItems.count).eql(2);

  // Click checkout button
  await t.click('.checkout_button');

  // Provide random firstname, lastname and zip code in the next page
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const zipCode = faker.address.zipCode();
  await t.typeText('#first-name', firstName)
    .typeText('#last-name', lastName)
    .typeText('#postal-code', zipCode);

  // Click continue button
  await t.click('.checkout_buttons .btn_primary');

  // Click finish
  await t.click('.checkout_buttons .btn_action');

  // Assert that the user has completed checkout
  const thankYouMessage = await Selector('.complete-header').innerText;
  await t.expect(thankYouMessage).eql('THANK YOU FOR YOUR ORDER');
});

