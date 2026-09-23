import express from 'express';
import prisma from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ============ POST /api/coupons/validate — check a code (auth) ============
// Body: { code: string, subtotal: number }
router.post('/validate', requireAuth, async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ success: false, error: 'Coupon code required' });

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase().trim() } });

    if (!coupon) return res.status(404).json({ success: false, error: 'Invalid coupon code' });
    if (!coupon.active) return res.status(400).json({ success: false, error: 'Coupon is no longer active' });
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return res.status(400).json({ success: false, error: 'Coupon has expired' });
    }
    if (coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, error: 'Coupon usage limit reached' });
    }
    if (subtotal < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        error: `Minimum order $${coupon.minOrder.toFixed(2)} required`,
      });
    }

    const discount = coupon.type === 'percent'
      ? (subtotal * coupon.value) / 100
      : coupon.value;

    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        discount: parseFloat(Math.min(discount, subtotal).toFixed(2)),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to validate coupon' });
  }
});

// ============ GET /api/coupons — list all (admin) ============
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, count: coupons.length, data: coupons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to load coupons' });
  }
});

// ============ POST /api/coupons — create (admin) ============
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { code, description, type, value, minOrder, maxUses, expiresAt } = req.body;

    if (!code || !description || !type || value === undefined) {
      return res.status(400).json({ success: false, error: 'Code, description, type and value are required' });
    }
    if (!['percent', 'fixed'].includes(type)) {
      return res.status(400).json({ success: false, error: 'Type must be "percent" or "fixed"' });
    }
    if (typeof value !== 'number' || value <= 0) {
      return res.status(400).json({ success: false, error: 'Value must be positive' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        description: description.trim(),
        type,
        value,
        minOrder: typeof minOrder === 'number' ? minOrder : 0,
        maxUses: typeof maxUses === 'number' ? maxUses : 100,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.status(201).json({ success: true, data: coupon });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ success: false, error: 'Coupon code already exists' });
    }
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to create coupon' });
  }
});

// ============ PUT /api/coupons/:id — update (admin) ============
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid id' });

    const { active, maxUses, expiresAt, description } = req.body;
    const data = {};
    if (active !== undefined) data.active = !!active;
    if (maxUses !== undefined) data.maxUses = maxUses;
    if (description !== undefined) data.description = description.trim();
    if (expiresAt !== undefined) data.expiresAt = expiresAt ? new Date(expiresAt) : null;

    const coupon = await prisma.coupon.update({ where: { id }, data });
    res.json({ success: true, data: coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to update coupon' });
  }
});

// ============ DELETE /api/coupons/:id (admin) ============
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid id' });

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, error: 'Coupon not found' });

    await prisma.coupon.delete({ where: { id } });
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to delete coupon' });
  }
});

export default router;