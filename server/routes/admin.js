import express from 'express';
import prisma from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

// ============ GET /api/admin/stats — dashboard summary ============
router.get('/stats', async (req, res) => {
  try {
    const [
      totalProducts,
      totalUsers,
      totalOrders,
      revenueAgg,
      pendingOrders,
      lowStock,
      recentOrders,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ['paid', 'shipped', 'delivered'] } },
      }),
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.product.count({ where: { stock: { lt: 5 } } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue: parseFloat((revenueAgg._sum.totalAmount || 0).toFixed(2)),
        pendingOrders,
        lowStockProducts: lowStock,
        recentOrders,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to load stats' });
  }
});

export default router;