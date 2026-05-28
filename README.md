# Victory Bazars — Setup Guide

## 🚀 Quick Start

### Step 1 — Add your credentials to backend/.env

Open `/backend/.env` and fill in:

```
MONGO_URI=your_actual_mongodb_atlas_uri
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Step 2 — Seed the database

```bash
cd backend
npm run seed
```

This creates:
- ✅ Admin user: `admin@victorybazars.com` / `admin@123`
- ✅ 55+ AP branches across all districts
- ✅ 22 sample products across all categories

### Step 3 — Start the Backend

```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

### Step 4 — Start the Frontend (new terminal)

```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## 🌐 URLs

| Page | URL |
|------|-----|
| Home | http://localhost:5173 |
| Shop | http://localhost:5173/products |
| Cart | http://localhost:5173/cart |
| Login | http://localhost:5173/login |
| Admin Panel | http://localhost:5173/admin |
| Store Locations | http://localhost:5173/locations |
| About | http://localhost:5173/about |
| Contact | http://localhost:5173/contact |
| Careers | http://localhost:5173/careers |

---

## 🔑 Admin Login

```
Email:    admin@victorybazars.com
Password: admin@123
```

---

## 📦 Project Structure

```
Victory Bazars/
├── backend/          # Node.js + Express + MongoDB API
│   ├── config/       # DB + Cloudinary config
│   ├── controllers/  # Auth, Products, Orders, Branches, Careers
│   ├── middleware/   # JWT auth, error handler
│   ├── models/       # User, Product, Order, Branch, JobApplication
│   ├── routes/       # All API routes
│   ├── seeder/       # Seed script (55 branches + 22 products)
│   └── server.js     # Entry point with Socket.io
│
└── frontend/         # React + Vite + Tailwind
    └── src/
        ├── api/          # Axios instance
        ├── app/          # Redux store
        ├── components/   # Navbar, Footer, ProductCard, AdminLayout...
        ├── features/     # Redux slices (auth, cart, products, orders, branches)
        └── pages/        # All 10 public pages + 5 admin pages
```

---

## ✅ Features Built

### Customer Side
- Hero slider with brand messaging
- Product browsing with search, category filter, sort, pagination
- Product detail with similar products
- Cart with localStorage persistence
- Checkout with branch selector
- 4-digit Pickup PIN on order success
- My Orders page
- Store Locations (55+ AP stores by district)
- About, Contact, Careers pages

### Admin Panel
- Dashboard with order stats + low stock alerts
- Order management with real-time Socket.io updates
- One-click status updates (Pending → Confirmed → Preparing → Ready → Completed)
- PIN Verification panel
- Product CRUD with modal form
- Branch management

### Auth
- JWT authentication
- Protected routes (customer + admin)
- Persistent login via localStorage
- Role-based access control

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET | /api/products | List products (search, filter, paginate) |
| POST | /api/products | Create product (admin) |
| POST | /api/orders | Place order |
| GET | /api/orders | All orders (admin) |
| PUT | /api/orders/:id/status | Update status (admin) |
| POST | /api/orders/verify-pin | Verify pickup PIN (admin) |
| GET | /api/branches | List branches |
| POST | /api/careers/apply | Submit job application |
