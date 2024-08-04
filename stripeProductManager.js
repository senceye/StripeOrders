// Load environment variables from .env file
require('dotenv').config();

// Import Stripe
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Use the secret key from .env

// StripeService class
class StripeService {
  constructor(apiKey) {
    this.stripe = Stripe(apiKey);
  }

  async createProduct(name, description, images) {
    try {
      const product = await this.stripe.products.create({
        name,
        description,
        images,
      });
      console.log('Product created successfully:', product);
      return product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      const deleted = await this.stripe.products.del(productId);
      console.log('Product deleted successfully:', deleted);
      return deleted;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async createPrice(productId, unitAmount, currency) {
    try {
      const price = await this.stripe.prices.create({
        unit_amount: unitAmount,
        currency,
        product: productId,
      });
      console.log('Price created successfully:', price);
      return price;
    } catch (error) {
      console.error('Error creating price:', error);
      throw error;
    }
  }

  async createCheckoutSession(priceId, successUrl, cancelUrl) {
    try {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
      });
      console.log('Checkout Session created successfully:', session);
      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
}

// Export StripeService class
module.exports = StripeService;
