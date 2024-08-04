// index.js
require('dotenv').config();
const readline = require('readline');
const StripeService = require('./stripeProductManager');

// Product and Price classes
class Product {
  constructor(name, description, images) {
    this.name = name;
    this.description = description;
    this.images = images;
  }
}

class Price {
  constructor(unitAmount, currency) {
    this.unitAmount = unitAmount;
    this.currency = currency;
  }
}

// Initialize readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
};

async function main() {
  const stripeService = new StripeService(process.env.STRIPE_TOKEN);

  try {
    const action = await askQuestion('What would you like to do? (create [1] / delete [2]): ');

    if (action.toLowerCase() === '1') {
      const name = await askQuestion('Enter product name: ');
      const description = await askQuestion('Enter product description: ');
      const images = await askQuestion('Enter product image URL: ');
      const unitAmount = parseInt(await askQuestion('Enter product price (in smallest currency unit, e.g., cents): '), 10);
      const currency = await askQuestion('Enter currency (e.g., usd): ');
      const successUrl = await askQuestion('Enter success URL: ');
      const cancelUrl = await askQuestion('Enter cancel URL: ');

      const product = new Product(name, description, [images]);
      const createdProduct = await stripeService.createProduct(product.name, product.description, product.images);

      const price = new Price(unitAmount, currency);
      const createdPrice = await stripeService.createPrice(createdProduct.id, price.unitAmount, price.currency);

      const session = await stripeService.createCheckoutSession(createdPrice.id, successUrl, cancelUrl);

      console.log('Checkout URL:', session.url);
    } else if (action.toLowerCase() === '2') {
      const productId = await askQuestion('Enter product ID to delete: ');
      await stripeService.deleteProduct(productId);
      console.log('Product deleted successfully');
    } else {
      console.log('Invalid action. Please choose "Create Product" or "Delete Product".');
    }
  } catch (error) {
    console.error('Error in main function:', error);
  } finally {
    rl.close();
  }
}

// Run the main function
main();
