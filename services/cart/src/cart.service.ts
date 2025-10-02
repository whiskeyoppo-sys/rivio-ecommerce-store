// Scaffolded - Redis-backed cart service
// Design choice: Redis for performance and session persistence

import Redis from 'ioredis';

export class CartService {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  async getCart(userId: string): Promise<any> {
    const cartKey = `cart:${userId}`;
    const cart = await this.redis.get(cartKey);
    return cart ? JSON.parse(cart) : { items: [] };
  }

  async addItem(userId: string, item: any): Promise<void> {
    const cart = await this.getCart(userId);
    
    // Check if item exists
    const existingItemIndex = cart.items.findIndex(
      (i: any) => i.productId === item.productId && i.variantId === item.variantId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += item.quantity;
    } else {
      // Add new item
      cart.items.push(item);
    }

    // Save to Redis with 7-day expiry
    const cartKey = `cart:${userId}`;
    await this.redis.setex(cartKey, 604800, JSON.stringify(cart));
  }

  async removeItem(userId: string, itemId: string): Promise<void> {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter((i: any) => i.id !== itemId);
    
    const cartKey = `cart:${userId}`;
    await this.redis.setex(cartKey, 604800, JSON.stringify(cart));
  }

  async clearCart(userId: string): Promise<void> {
    const cartKey = `cart:${userId}`;
    await this.redis.del(cartKey);
  }
}
