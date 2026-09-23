import express from 'express';
import prisma from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// ============ GET /api/products/:productId/reviews — list reviews ============
// (mounted under /api/products so product id is in URL)
export async function listReviews(req, res) {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (isNaN(productId)) return res.status(400).json({ success: false, error: 'Invalid product id' });

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true } } },
    });

    const avg = reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

    res.json({
      success: true,
      count: reviews.length,
      average: parseFloat(avg.toFixed(1)),
      data: reviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to load reviews' });
  }
}

// ============ POST /api/products/:productId/reviews — add/update review (auth) ============
export async function upsertReview(req, res) {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (isNaN(productId)) return res.status(400).json({ success: false, error: 'Invalid product id' });

    const { rating, comment } = req.body;
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
    }
    if (!comment || comment.trim().length < 3) {
      return res.status(400).json({ success: false, error: 'Comment must be at least 3 characters' });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    // Upsert: one review per user per product
    const review = await prisma.review.upsert({
      where: { userId_productId: { userId: req.user.id, productId } },
      update: { rating, comment: comment.trim() },
      create: { userId: req.user.id, productId, rating, comment: comment.trim() },
      include: { user: { select: { id: true, name: true } } },
    });

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to save review' });
  }
}

// ============ DELETE /api/reviews/:id — delete own review (auth) ============
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid review id' });

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return res.status(404).json({ success: false, error: 'Review not found' });

    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    await prisma.review.delete({ where: { id } });
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to delete review' });
  }
});

export default router;