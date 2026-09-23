<div align="center">

# 🛒 ShahidShop

### A modern, production-ready full-stack e-commerce platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit-6366f1?style=for-the-badge)](https://auspify-task3-ecommerce.vercel.app)
[![API](https://img.shields.io/badge/🔌_Live_API-Healthy-22d3ee?style=for-the-badge)](https://auspify-task3-ecommerce.onrender.com)
[![GitHub](https://img.shields.io/badge/⭐_GitHub-Star_Repo-181717?style=for-the-badge&logo=github)](https://github.com/shahidca/auspify-task3-ecommerce)
[![License](https://img.shields.io/badge/📄_License-MIT-f472b6?style=for-the-badge)](LICENSE)

<br />

<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=react-router&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white" />
<img src="https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" />

</div>

---

## 📖 About

**ShahidShop** is a full-featured e-commerce platform with a modern storefront and a powerful admin dashboard. It was built as **Task 3** of the Full Stack Development Internship at Auspify Technologies.

The project demonstrates end-to-end development: from database schema design and REST API architecture to a polished, responsive frontend with authentication, cart management, order processing, and an admin panel.

### 🔗 Quick Links

| | Link |
|---|---|
| 🌐 **Live Site** | [auspify-task3-ecommerce.vercel.app](https://auspify-task3-ecommerce.vercel.app) |
| 🔌 **Live API** | [auspify-task3-ecommerce.onrender.com](https://auspify-task3-ecommerce.onrender.com) |
| 💻 **Frontend Repo** | [github.com/shahidca/auspify-task3-ecommerce](https://github.com/shahidca/auspify-task3-ecommerce) |
| 📊 **API Health Check** | [auspify-task3-ecommerce.onrender.com](https://auspify-task3-ecommerce.onrender.com) |

> ⏱️ **Note:** The backend runs on Render's free tier, which sleeps after 15 minutes of inactivity. The first request after a sleep may take up to 30 seconds. Just refresh.

---

## ✨ Features

### 🛍️ Storefront
- **42 products** across **7 categories** (Electronics, Fashion, Home, Sports, Books, Beauty, Toys)
- **Multi-image product gallery** with thumbnail navigation and hover arrows
- **Smart search** with live dropdown suggestions (debounced, images + prices)
- **Advanced filtering** — by category, price range
- **Sorting** — newest, oldest, price low→high, price high→low
- **Featured / New Arrivals / Trending** sections
- **Related products** based on shared category
- **Product reviews** with 1–5 star ratings
- **Share buttons** — Twitter, Facebook, LinkedIn, copy link

### 🛒 Shopping Experience
- **Cart** with live quantity controls, stock validation, and hover animations
- **Free shipping progress bar** ($100 threshold)
- **Wishlist** with heart toggle
- **Recently viewed** products (localStorage)
- **Coupon system** — percent & fixed discounts
- **Checkout** with atomic transactions (Prisma `$transaction`)
- **Order timeline** — Pending → Paid → Shipped → Delivered
- **Printable invoice**
- **Order history** with status badges

### 👤 User Accounts
- **Email + password** registration & login (JWT + bcryptjs)
- **Google OAuth** sign-in
- **GitHub OAuth** sign-in
- **Profile management** — name, phone, address
- **Password change** with current password verification
- **Role-based access** — customer vs admin

### 🛠️ Admin Dashboard
- **Real-time stats** — products, users, orders, revenue, pending, low stock
- **Product CRUD** — create, edit, delete with multi-image URLs (up to 5)
- **Order management** — filter by status, update order status
- **Coupon management** — CRUD for promotional codes

### 🎨 Design & UX
- **Dark / Light theme** with system preference detection & persistence
- **Fully responsive** — mobile, tablet, desktop
- **Glassmorphism** UI with gradients and blur
- **Aurora orbs** and animated backgrounds
- **Animated counters**, marquees, fade-ins
- **Skeleton loaders** for all async content
- **Toast notifications** — success, error, info, warning
- **Breadcrumbs**, **back-to-top**, **live search**
- **Custom favicon** and **SEO meta tags** (Open Graph + Twitter cards)

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| **React 18** | UI library |
| **Vite** | Build tool & dev server |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client with interceptors |
| **Context API** | Global state (auth, cart, wishlist, theme, toast) |
| **Custom CSS** | Themed design system with CSS variables |

### Backend
| Tech | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Express.js** | Web framework |
| **Prisma ORM** | Database toolkit |
| **PostgreSQL** | Relational database |
| **JWT** | Stateless authentication |
| **bcryptjs** | Password hashing |
| **Passport.js** | OAuth strategies (Google + GitHub) |
| **Helmet-style CORS** | Origin allowlist |

### Infrastructure
| Tech | Purpose |
|---|---|
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |
| **Neon** | Serverless PostgreSQL |
| **GitHub** | Version control |

---

## 📸 Screenshots

> 💡 To add screenshots: run the app, take screenshots of each page, upload to `docs/screenshots/`, then reference them here.

| | |
|---|---|
| **Home** — hero, category cards, featured products | **Products** — grid with filters sidebar |
| **Product Detail** — image gallery, reviews | **Cart** — item cards, free shipping bar |
| **Checkout** — coupon input, order summary | **Order Detail** — timeline + invoice |
| **Admin** — stats cards, product table | **Profile** — tabs (info + password) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **PostgreSQL** database (local or [Neon](https://neon.tech) free tier)
- **Google OAuth** credentials ([setup guide](https://console.cloud.google.com/apis/credentials))
- **GitHub OAuth** app ([setup guide](https://github.com/settings/developers))

### 1. Clone the repository

```bash
git clone https://github.com/shahidca/auspify-task3-ecommerce.git
cd auspify-task3-ecommerce
