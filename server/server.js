import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import { startKeepAlive } from './keepalive.js';
import authRouter from './routes/auth.js';
import oauthRouter from './routes/oauth.js';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import ordersRouter from './routes/orders.js';
import reviewsRouter from './routes/reviews.js';
import wishlistRouter from './routes/wishlist.js';
import adminRouter from './routes/admin.js';
import couponsRouter from './routes/coupons.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://auspify-task3-ecommerce.vercel.app',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'E-Commerce API is running',
    db: 'PostgreSQL via Prisma',
    version: '3.1',
    features: ['auth', 'oauth', 'products', 'cart', 'orders', 'reviews', 'wishlist', 'admin', 'coupons'],
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRouter);
app.use('/api/auth', oauthRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/admin', adminRouter);
app.use('/api/coupons', couponsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: 'Server error' });
});

async function start() {
  await connectDB();
  startKeepAlive();
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

start();