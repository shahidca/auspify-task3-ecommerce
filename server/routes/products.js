import express from 'express';
import prisma from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { listReviews, upsertReview } from './reviews.js';

const router = express.Router();

// ============ GET /api/products — list all (public) ============
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, featured } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const orderBy =
      sort === 'price_asc' ? { price: 'asc' } :
      sort === 'price_desc' ? { price: 'desc' } :
      sort === 'oldest' ? { createdAt: 'asc' } :
      { createdAt: 'desc' };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true } },
      },
    });

    const withRatings = products.map((p) => {
      const avg = p.reviews.length
        ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
        : 0;
      const { reviews, ...rest } = p;
      return {
        ...rest,
        ratingAverage: parseFloat(avg.toFixed(1)),
        reviewCount: p._count.reviews,
      };
    });

    res.json({ success: true, count: withRatings.length, data: withRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
});

// ============ GET /api/products/categories ============
router.get('/categories', async (req, res) => {
  try {
    const rows = await prisma.product.groupBy({
      by: ['category'],
      _count: { category: true },
      orderBy: { category: 'asc' },
    });
    res.json({
      success: true,
      data: rows.map((r) => ({ name: r.category, count: r._count.category })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch categories' });
  }
});

// ============ GET /api/products/:id/related — same-category products ============
// Must be defined BEFORE /:id
router.get('/:id/related', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid product id' });

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    const related = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: id },
      },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: {
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true } },
      },
    });

    const shaped = related.map((p) => {
      const avg = p.reviews.length
        ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
        : 0;
      const { reviews, ...rest } = p;
      return {
        ...rest,
        ratingAverage: parseFloat(avg.toFixed(1)),
        reviewCount: p._count.reviews,
      };
    });

    res.json({ success: true, count: shaped.length, data: shaped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch related products' });
  }
});

// ============ GET /api/products/:id ============
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid product id' });

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true } },
      },
    });
    if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

    const avg = product.reviews.length
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : 0;

    const { reviews, ...rest } = product;
    res.json({
      success: true,
      data: {
        ...rest,
        ratingAverage: parseFloat(avg.toFixed(1)),
        reviewCount: product._count.reviews,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
});

// ============ Reviews nested under product ============
router.get('/:productId/reviews', listReviews);
router.post('/:productId/reviews', requireAuth, upsertReview);

// ============ POST /api/products (admin) ============
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category, stock, images, featured } = req.body;

    if (!name || !description || !category) {
      return res.status(400).json({ success: false, error: 'Name, description and category are required' });
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(400).json({ success: false, error: 'Price must be a positive number' });
    }
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ success: false, error: 'Stock must be a positive number' });
    }
    if (!Array.isArray(images) || images.filter(Boolean).length === 0) {
      return res.status(400).json({ success: false, error: 'At least one image URL is required' });
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price,
        category: category.trim(),
        stock,
        images: images.filter(Boolean).slice(0, 5),
        featured: !!featured,
      },
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
});

// ============ PUT /api/products/:id (admin) ============
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid product id' });

    const { name, description, price, category, stock, images, featured } = req.body;
    const data = {};

    if (name !== undefined) data.name = name.trim();
    if (description !== undefined) data.description = description.trim();
    if (category !== undefined) data.category = category.trim();
    if (featured !== undefined) data.featured = !!featured;
    if (price !== undefined) {
      if (typeof price !== 'number' || price < 0) return res.status(400).json({ success: false, error: 'Price must be positive' });
      data.price = price;
    }
    if (stock !== undefined) {
      if (typeof stock !== 'number' || stock < 0) return res.status(400).json({ success: false, error: 'Stock must be positive' });
      data.stock = stock;
    }
    if (images !== undefined) {
      if (!Array.isArray(images)) return res.status(400).json({ success: false, error: 'Images must be an array' });
      const clean = images.filter(Boolean).slice(0, 5);
      if (clean.length === 0) return res.status(400).json({ success: false, error: 'At least one image URL is required' });
      data.images = clean;
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, error: 'Product not found' });

    const product = await prisma.product.update({ where: { id }, data });
    res.json({ success: true, data: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
});

// ============ DELETE /api/products/:id (admin) ============
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid product id' });

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, error: 'Product not found' });

    await prisma.product.delete({ where: { id } });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
});

export default router;