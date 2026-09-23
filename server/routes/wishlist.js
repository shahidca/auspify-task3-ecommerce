import express from 'express';
import prisma from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes require login
router.use(requireAuth);

// ============ GET /api/wishlist — current user's wishlist ============
router.get('/', async (req, res) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { product: true },
    });
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to load wishlist' });
  }
});

// ============ POST /api/wishlist/:productId — toggle ============
router.post('/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (isNaN(productId)) return res.status(400).json({ success: false, error: 'Invalid product id' });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return res.json({ success: true, added: false, message: 'Removed from wishlist' });
    }

    await prisma.wishlistItem.create({
      data: { userId: req.user.id, productId },
    });
    res.status(201).json({ success: true, added: true, message: 'Added to wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to update wishlist' });
  }
});

// ============ DELETE /api/wishlist/:productId — remove ============
router.delete('/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (isNaN(productId)) return res.status(400).json({ success: false, error: 'Invalid product id' });

    const result = await prisma.wishlistItem.deleteMany({
      where: { userId: req.user.id, productId },
    });

    if (result.count === 0) {
      return res.status(404).json({ success: false, error: 'Not in wishlist' });
    }
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to remove' });
  }
});

export default router;