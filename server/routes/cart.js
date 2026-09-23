import express from 'express';
import prisma from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Helper: fetch user's cart with product details
async function getCartWithTotals(userId) {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          images: true,
          category: true,
          stock: true,
        },
      },
    },
  });

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    subtotal: parseFloat(subtotal.toFixed(2)),
    itemCount,
  };
}

// ============ GET /api/cart — get current user's cart ============
router.get('/', requireAuth, async (req, res) => {
  try {
    const cart = await getCartWithTotals(req.user.id);
    res.json({ success: true, ...cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch cart' });
  }
});

// ============ POST /api/cart — add item to cart ============
// Body: { productId: number, quantity?: number }
router.post('/', requireAuth, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId || typeof productId !== 'number') {
      return res.status(400).json({ success: false, error: 'productId is required' });
    }
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ success: false, error: 'Quantity must be at least 1' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: `Only ${product.stock} item(s) in stock`,
      });
    }

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          error: `Only ${product.stock} item(s) in stock`,
        });
      }
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: { userId: req.user.id, productId, quantity },
      });
    }

    const cart = await getCartWithTotals(req.user.id);
    res.status(201).json({ success: true, message: 'Added to cart', ...cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to add to cart' });
  }
});

// ============ PUT /api/cart/:productId — update quantity ============
// Body: { quantity: number }  — if 0, item is removed
router.put('/:productId', requireAuth, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    const { quantity } = req.body;

    if (isNaN(productId)) {
      return res.status(400).json({ success: false, error: 'Invalid productId' });
    }
    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ success: false, error: 'Quantity must be 0 or more' });
    }

    if (quantity === 0) {
      await prisma.cartItem.deleteMany({
        where: { userId: req.user.id, productId },
      });
      const cart = await getCartWithTotals(req.user.id);
      return res.json({ success: true, message: 'Removed from cart', ...cart });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        error: `Only ${product.stock} item(s) in stock`,
      });
    }

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Item not in cart' });
    }

    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity },
    });

    const cart = await getCartWithTotals(req.user.id);
    res.json({ success: true, message: 'Cart updated', ...cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to update cart' });
  }
});

// ============ DELETE /api/cart/:productId — remove single item ============
router.delete('/:productId', requireAuth, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (isNaN(productId)) {
      return res.status(400).json({ success: false, error: 'Invalid productId' });
    }

    const result = await prisma.cartItem.deleteMany({
      where: { userId: req.user.id, productId },
    });

    if (result.count === 0) {
      return res.status(404).json({ success: false, error: 'Item not in cart' });
    }

    const cart = await getCartWithTotals(req.user.id);
    res.json({ success: true, message: 'Item removed', ...cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to remove item' });
  }
});

// ============ DELETE /api/cart — clear entire cart ============
router.delete('/', requireAuth, async (req, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.user.id } });
    res.json({ success: true, message: 'Cart cleared', items: [], subtotal: 0, itemCount: 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to clear cart' });
  }
});

export default router;