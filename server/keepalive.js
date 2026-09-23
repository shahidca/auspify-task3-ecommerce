import prisma from './db.js';

// Ping the DB every 4 minutes to keep Neon awake during dev
export function startKeepAlive(intervalMs = 4 * 60 * 1000) {
  const t = setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      // ignore — Prisma will reconnect on the next real query
    }
  }, intervalMs);

  // Don't keep the Node process alive just for this
  t.unref?.();
  return () => clearInterval(t);
}