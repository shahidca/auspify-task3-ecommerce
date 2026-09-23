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
| 💻 **Source Code** | [github.com/shahidca/auspify-task3-ecommerce](https://github.com/shahidca/auspify-task3-ecommerce) |
| 📊 **API Health** | [auspify-task3-ecommerce.onrender.com](https://auspify-task3-ecommerce.onrender.com) |

> ⏱️ **Note:** The backend runs on Render's free tier, which sleeps after 15 minutes of inactivity. The first request after a sleep may take up to 30 seconds. Just refresh.

---

## 👨‍💻 About Me

<div align="center">

### Md. Shahid Hossain

**Full Stack Web Developer · Satkhira, Bangladesh**

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-6366f1?style=flat-square&logo=googlechrome&logoColor=white)](https://shahidca.github.io/auspify-task-1-portfolio/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/md-shahid-hossain-ca)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/shahidca)
[![Email](https://img.shields.io/badge/Email-Contact-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:mdshahidca123@gmail.com)

</div>

I'm a Full Stack Web Developer based in Satkhira, Bangladesh. I build scalable, user-centric web applications using modern JavaScript and TypeScript. I specialize in React, Next.js, Node.js, and PostgreSQL — with a strong focus on clean architecture, performance, and production-ready code.

I have hands-on experience designing REST APIs, implementing secure authentication (JWT, bcrypt, OAuth), and building responsive, accessible interfaces. I care deeply about the details — from database schema design to pixel-perfect UI.

**🎯 What I focus on:**
- Building full-stack apps with **React + Node.js + PostgreSQL**
- Writing clean, maintainable code with **TypeScript**
- Designing **REST APIs** with secure **JWT authentication**
- Creating **modern, responsive UIs** with CSS and Tailwind
- Deploying to production on **Vercel, Render, and Neon**

**🛠 My Toolbox:**

```
Frontend    React · Next.js · TypeScript · Tailwind CSS · HTML5 · CSS3
Backend     Node.js · Express.js · REST APIs · JWT · bcrypt · OAuth
Database    PostgreSQL · MongoDB · Prisma ORM
Tools       Git · GitHub · VS Code · Postman · Vite · Figma
Deploy      Vercel · Render · Neon · Netlify
```

**📌 Other Projects:**
- 🎨 **[Portfolio Website](https://shahidca.github.io/auspify-task-1-portfolio/)** — Personal portfolio with dark/light theme
- 🚲 **[GearUp](https://gearup-frontend-mu.vercel.app/)** — Sports & outdoor equipment rental platform
- 🏥 **[PH Healthcare System](https://ph-healthcare-system-client-623h.vercel.app/)** — Doctor appointment booking system
- ⚽ **[Football Ticket Booking](https://football-ticket-booking.vercel.app/)** — Match ticket booking app

> 💬 Open to full-time roles, freelance work, and collaborations. Feel free to reach out!

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

### Infrastructure
| Tech | Purpose |
|---|---|
| **Vercel** | Frontend hosting |
| **Render** | Backend hosting |
| **Neon** | Serverless PostgreSQL |
| **GitHub** | Version control |

---

## 📸 Screenshots

> 💡 Add screenshots: run the app, capture each page, upload to `docs/screenshots/`, reference here.

| | |
|---|---|
| **Home** — hero, categories, featured | **Products** — grid + filters |
| **Product Detail** — gallery + reviews | **Cart** — item cards + free-ship bar |
| **Checkout** — coupon + summary | **Order Detail** — timeline + invoice |
| **Admin** — stats + product table | **Profile** — info + password tabs |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **PostgreSQL** database (local or [Neon](https://neon.tech) free tier)
- **Google OAuth** credentials ([setup](https://console.cloud.google.com/apis/credentials))
- **GitHub OAuth** app ([setup](https://github.com/settings/developers))

### 1. Clone the repository

```bash
git clone https://github.com/shahidca/auspify-task3-ecommerce.git
cd auspify-task3-ecommerce
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
JWT_SECRET=your_long_random_secret_here

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Run migrations and seed:

```bash
npx prisma migrate dev
npx prisma generate
npm run seed
```

Start the backend:

```bash
npm run dev
```

Backend runs on **http://localhost:5000**

### 3. Set up the frontend

In a **new terminal**:

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on **http://localhost:5173**

---

## 🔐 Demo Credentials

### Users

| Role | Email | Password |
|---|---|---|
| 🔐 **Admin** | `admin@shop.com` | `admin123` |
| 👤 Customer | `shahid@example.com` | `customer123` |
| 👤 Customer | `ayesha@example.com` | `customer123` |
| 👤 Customer | `rakib@example.com` | `customer123` |

### Coupons

| Code | Discount | Minimum Order |
|---|---|---|
| `WELCOME10` | 10% off | $0 |
| `SAVE20` | 20% off | $100 |
| `FLAT5` | $5 off | $25 |
| `SUMMER30` | 30% off | $50 |

---

## 📡 API Reference

Base URL: `https://auspify-task3-ecommerce.onrender.com/api`

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | — | Register new user |
| `POST` | `/auth/login` | — | Login & get JWT |
| `GET` | `/auth/me` | 🔒 | Current user |
| `PUT` | `/auth/profile` | 🔒 | Update profile |
| `PUT` | `/auth/password` | 🔒 | Change password |
| `GET` | `/auth/google` | — | Google OAuth |
| `GET` | `/auth/github` | — | GitHub OAuth |

### Products
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/products` | — | List with filters |
| `GET` | `/products/categories` | — | Categories with counts |
| `GET` | `/products/:id` | — | Single product |
| `GET` | `/products/:id/related` | — | Related products |
| `GET` | `/products/:id/reviews` | — | Reviews + average |
| `POST` | `/products/:id/reviews` | 🔒 | Add/update review |
| `POST` | `/products` | 🔐 Admin | Create product |
| `PUT` | `/products/:id` | 🔐 Admin | Update product |
| `DELETE` | `/products/:id` | 🔐 Admin | Delete product |

### Cart
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/cart` | 🔒 | Get cart |
| `POST` | `/cart` | 🔒 | Add item |
| `PUT` | `/cart/:productId` | 🔒 | Update quantity |
| `DELETE` | `/cart/:productId` | 🔒 | Remove item |
| `DELETE` | `/cart` | 🔒 | Clear cart |

### Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/orders` | 🔒 | Checkout |
| `GET` | `/orders/my` | 🔒 | User's orders |
| `GET` | `/orders/:id` | 🔒 | Single order |
| `GET` | `/orders` | 🔐 Admin | All orders |
| `PUT` | `/orders/:id/status` | 🔐 Admin | Update status |

### Wishlist
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/wishlist` | 🔒 | User's wishlist |
| `POST` | `/wishlist/:productId` | 🔒 | Toggle |
| `DELETE` | `/wishlist/:productId` | 🔒 | Remove |

### Coupons
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/coupons/validate` | 🔒 | Validate a code |
| `GET` | `/coupons` | 🔐 Admin | List all |
| `POST` | `/coupons` | 🔐 Admin | Create |
| `PUT` | `/coupons/:id` | 🔐 Admin | Update |
| `DELETE` | `/coupons/:id` | 🔐 Admin | Delete |

### Admin
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/admin/stats` | 🔐 Admin | Dashboard stats |

---

## 📁 Project Structure

```
auspify-task3-ecommerce/
│
├── client/                          # React frontend
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── components/
│   │   │   ├── AnnouncementBar.jsx
│   │   │   ├── BackToTop.jsx
│   │   │   ├── Breadcrumbs.jsx
│   │   │   ├── CouponInput.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── OrderTimeline.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── ShareButtons.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   ├── ToastContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   ├── hooks/
│   │   │   └── useRecentlyViewed.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── OrderDetail.jsx
│   │   │   ├── Wishlist.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Admin.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── OAuthCallback.jsx
│   │   │   └── NotFound.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vercel.json
│   └── package.json
│
├── server/                          # Express backend
│   ├── middleware/
│   │   └── auth.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── coupons.js
│   │   ├── oauth.js
│   │   ├── orders.js
│   │   ├── products.js
│   │   ├── reviews.js
│   │   └── wishlist.js
│   ├── db.js
│   ├── keepalive.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🗄️ Database Schema

8 Prisma models:

| Model | Fields | Relations |
|---|---|---|
| **User** | id, name, email, password, phone, address, googleId, githubId, avatar, role | → CartItem, Order, Review, WishlistItem |
| **Product** | id, name, description, price, images[], category, stock, featured | → CartItem, OrderItem, Review, WishlistItem |
| **CartItem** | id, userId, productId, quantity | ← User, Product |
| **Order** | id, userId, totalAmount, discount, couponCode, status, shippingAddress | ← User, → OrderItem |
| **OrderItem** | id, orderId, productId, quantity, price | ← Order, Product |
| **Review** | id, userId, productId, rating, comment | ← User, Product |
| **WishlistItem** | id, userId, productId | ← User, Product |
| **Coupon** | id, code, description, type, value, minOrder, maxUses, usedCount, active, expiresAt | — |

---

## 🧪 Testing the App

### Customer flow
1. Open the [live site](https://auspify-task3-ecommerce.vercel.app)
2. Register (or login as `shahid@example.com` / `customer123`)
3. Browse products → add to cart
4. Go to cart → proceed to checkout
5. Apply coupon `WELCOME10` → place order
6. View order timeline and printable invoice

### Admin flow
1. Login as `admin@shop.com` / `admin123`
2. Click **Admin** in navbar
3. Create a new product with multiple images
4. Change order status to "shipped"
5. View real-time stats

### OAuth flow
1. Logout
2. Click **Continue with Google** or **Continue with GitHub**
3. Authenticate → redirect back automatically

---

## 🌍 Deployment

### Frontend → Vercel
1. Push code to GitHub
2. [Vercel](https://vercel.com) → **Add New Project** → import repo
3. Root Directory: `client`
4. Env var: `VITE_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### Backend → Render
1. [Render](https://render.com) → **New Web Service** → connect repo
2. Root Directory: `server`
3. Build Command: `npm install && npx prisma generate`
4. Start Command: `npm start`
5. Add env vars
6. Deploy

### Database → Neon
1. [Neon](https://neon.tech) → create free project
2. Copy connection string → set as `DATABASE_URL` on Render
3. Run migrations: `npx prisma migrate deploy`

### OAuth callback URLs (production)
- **Google**: `https://your-backend.onrender.com/api/auth/google/callback`
- **GitHub**: `https://your-backend.onrender.com/api/auth/github/callback`

---

## 🧠 What I Learned

- **Full-stack architecture** — designing REST APIs, Prisma schemas, and React consumers that stay in sync
- **Authentication** — JWT tokens, bcryptjs hashing, Passport.js OAuth strategies (Google + GitHub)
- **Database transactions** — Prisma `$transaction` for atomic checkout (stock + order + coupon + cart)
- **Role-based access** — customer vs admin middleware
- **Context API** — five providers without Redux
- **Theme system** — CSS custom properties + localStorage + system preference detection
- **Deployment** — Vercel + Render + Neon with proper CORS and env management
- **OAuth troubleshooting** — redirect URI matching, callback flow, token exchange

---

## 🐛 Known Issues

- Backend sleeps on Render free tier (30-second cold start)
- Payment is mock ("Cash on Delivery") — no Stripe integration
- Email notifications not implemented
- Product images use Unsplash CDN URLs (some may rate-limit)
- No image upload — admin pastes URLs manually

---

## 🔮 Future Improvements

- [ ] **Stripe** payment integration
- [ ] **Image upload** via Cloudinary or S3
- [ ] **Product variants** (size, color, etc.)
- [ ] **Email receipts** with Nodemailer
- [ ] **Advanced admin analytics** with charts
- [ ] **Redis caching** for product lists
- [ ] **PWA** support (offline browsing)
- [ ] **Multi-language** support (English / বাংলা)
- [ ] **Product Q&A** section
- [ ] **ML recommendations**

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a branch: `git checkout -b feature/amazing-idea`
3. Commit: `git commit -m "Add amazing idea"`
4. Push: `git push origin feature/amazing-idea`
5. Open a Pull Request

---

## 📬 Connect With Me

<div align="center">

[![Portfolio](https://img.shields.io/badge/Portfolio-shahidca.github.io-6366f1?style=for-the-badge&logo=googlechrome&logoColor=white)](https://shahidca.github.io/auspify-task-1-portfolio/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-md--shahid--hossain--ca-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/md-shahid-hossain-ca)
[![GitHub](https://img.shields.io/badge/GitHub-shahidca-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/shahidca)
[![Email](https://img.shields.io/badge/Email-mdshahidca123@gmail.com-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:mdshahidca123@gmail.com)

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

### ⭐ If you liked this project, please give it a star!

**Built with 💜 by [Md. Shahid Hossain](https://github.com/shahidca)**

<sub>Task 3 · Full Stack Development Internship · Auspify Technologies · 2026</sub>

</div>
