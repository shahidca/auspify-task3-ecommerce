import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import prisma from '../db.js';

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

async function upsertOAuthUser({ provider, providerId, email, name, avatar }) {
  // Prefer existing user by providerId
  const providerField = provider === 'google' ? 'googleId' : 'githubId';
  const where = { [providerField]: providerId };

  let user = await prisma.user.findFirst({ where });

  if (!user && email) {
    // Fall back to match by email
    user = await prisma.user.findUnique({ where: { email } });
  }

  if (user) {
    // Link provider ID + update avatar if missing
    const data = {};
    if (provider === 'google' && !user.googleId) data.googleId = providerId;
    if (provider === 'github' && !user.githubId) data.githubId = providerId;
    if (!user.avatar && avatar) data.avatar = avatar;

    if (Object.keys(data).length > 0) {
      user = await prisma.user.update({ where: { id: user.id }, data });
    }
    return user;
  }

  // Create new user
  const randomPassword = await bcrypt.hash(crypto.randomUUID(), 10);
  return prisma.user.create({
    data: {
      name: name || 'New User',
      email: email || `${provider}_${providerId}@shahidshop.local`,
      password: randomPassword,
      [providerField]: providerId,
      avatar,
      role: 'customer',
    },
  });
}

/* ============================================================
   GOOGLE
   ============================================================ */
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value?.toLowerCase();
          const user = await upsertOAuthUser({
            provider: 'google',
            providerId: profile.id,
            email,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
          });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
  );

  router.get(
    '/google/callback',
    passport.authenticate('google', {
      session: false,
      failureRedirect: `${FRONTEND_URL}/login?error=google_failed`,
    }),
    (req, res) => {
      const token = signToken(req.user);
      res.redirect(`${FRONTEND_URL}/oauth/callback?token=${token}`);
    }
  );
} else {
  router.get('/google', (_req, res) =>
    res.status(503).json({ success: false, error: 'Google OAuth not configured' })
  );
}

/* ============================================================
   GITHUB
   ============================================================ */
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/auth/github/callback`,
        scope: ['user:email'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          let email = profile.emails?.[0]?.value?.toLowerCase();

          // GitHub sometimes hides email — fetch via API
          if (!email && _accessToken) {
            try {
              const resp = await fetch('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${_accessToken}`, 'User-Agent': 'shahidshop' },
              });
              const emails = await resp.json();
              const primary = emails.find((e) => e.primary) || emails[0];
              email = primary?.email?.toLowerCase();
            } catch { /* ignore */ }
          }

          const user = await upsertOAuthUser({
            provider: 'github',
            providerId: profile.id,
            email,
            name: profile.displayName || profile.username,
            avatar: profile.photos?.[0]?.value,
          });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  router.get(
    '/github',
    passport.authenticate('github', { scope: ['user:email'], session: false })
  );

  router.get(
    '/github/callback',
    passport.authenticate('github', {
      session: false,
      failureRedirect: `${FRONTEND_URL}/login?error=github_failed`,
    }),
    (req, res) => {
      const token = signToken(req.user);
      res.redirect(`${FRONTEND_URL}/oauth/callback?token=${token}`);
    }
  );
} else {
  router.get('/github', (_req, res) =>
    res.status(503).json({ success: false, error: 'GitHub OAuth not configured' })
  );
}

export default router;