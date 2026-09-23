import express from 'express';
import prisma from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

// ============ POST /api/orders — checkout (user) ============
// Body: { shippingAddress: string, couponCode?: string }
router.post('/', requireAuth, async (req, res) => {
  try {
    const { shippingAddress, couponCode } = req.body;

    if (!shippingAddress || shippingAddress.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Shipping address is required (min 5 characters)',
      });
    }

    const order = await prisma.$transaction(async (tx) => {
      // 1. Load cart
      const cartItems = await tx.cartItem.findMany({
        where: { userId: req.user.id },
        include: { product: true },
      });

      if (cartItems.length === 0) throw { status: 400, message: 'Cart is empty' };

      // 2. Validate stock
      for (const item of cartItems) {
        if (item.product.stock < item.quantity) {
          throw {
            status: 400,
            message: `Not enough stock for "${item.product.name}". Only ${item.product.stock} left.`,
          };
        }
      }

      // 3. Compute subtotal
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      // 4. Apply coupon (if provided and valid)
      let discount = 0;
      let appliedCoupon = null;

      if (couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCode.toUpperCase().trim() },
        });

        if (
          coupon &&
          coupon.active &&
          (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
          coupon.usedCount < coupon.maxUses &&
          subtotal >= coupon.minOrder
        ) {
          discount = coupon.type === 'percent'
            ? (subtotal * coupon.value) / 100
            : coupon.value;
          discount = Math.min(discount, subtotal);
          appliedCoupon = coupon.code;
        }
      }

      const totalAmount = parseFloat((subtotal - discount).toFixed(2));

      // 5. Create order
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          totalAmount,
          discount: parseFloat(discount.toFixed(2)),
          couponCode: appliedCoupon,
          shippingAddress: shippingAddress.trim(),
          status: 'pending',
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true, images: true } },
            },
          },
        },
      });

      // 6. Decrement stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 7. Bump coupon usage
      if (appliedCoupon) {
        await tx.coupon.update({
          where: { code: appliedCoupon },
          data: { usedCount: { increment: 1 } },
        });
      }

      // 8. Clear cart
      await tx.cartItem.deleteMany({ where: { userId: req.user.id } });

      return newOrder;
    });

    res.status(201).json({ success: true, message: 'Order placed', data: order });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ success: false, error: err.message });
    }
    console.error(err);
    res.status(500).json({ success: false, error: 'Checkout failed' });
  }
});

// ============ GET /api/orders/my — current user's orders ============
router.get('/my', requireAuth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, images: true } },
          },
        },
      },
    });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// ============ GET /api/orders — all orders (admin only) ============
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, images: true } },
          },
        },
      },
    });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch orders' });
  }
});

// ============ GET /api/orders/:id — single order ============
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid order id' });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: { select: { id: true, name: true, images: true } },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Access denied' });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to fetch order' });
  }
});

// ============ PUT /api/orders/:id/status — update status (admin only) ============
router.put('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid order id' });
    }

    const { status } = req.body;
    if (!status || !STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status must be one of: ${STATUSES.join(', ')}`,
      });
    }

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: true,
      },
    });

    res.json({ success: true, data: order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to update order status' });
  }
});

// ============ DELETE /api/orders/:id — delete (admin only) ============
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid order id' });
    }

    const existing = await prisma.order.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    await prisma.order.delete({ where: { id } });
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to delete order' });
  }
});

export default router;