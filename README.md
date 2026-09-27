# L'Étoile Noir — Premium Animated Restaurant Website & Ordering Platform (MERN Stack)

A luxury, high-end, editorial restaurant web application built with the **MERN Stack** (MongoDB, Express, React, Node.js), **TypeScript**, **Vite**, **Tailwind CSS**, and **Framer Motion**.

Designed for high-end dining, Michelin-rated gastronomy, online food ordering, table reservations, and customer account management.

---

## 🌟 Key Features

### Phase 2 Extension — Admin Dashboard & Restaurant Management
- **Admin Role & Security**:
  - Role-based authorization (`customer` vs `admin`) enforced on both client routes (`/admin`) and Express backend middleware (`requireAdmin`).
  - Dedicated admin authentication (`POST /api/auth/admin/login`).
  - Passwords hashed with `bcryptjs` (salt factor 10).
- **Admin Dashboard (`/admin`)**:
  - Live restaurant metrics computed from real MongoDB data: Today's Orders, Today's Revenue, Pending Orders, Active Reservations, Registered Customers.
- **Order Management & Lifecycle (`/admin/orders`)**:
  - Real-time order processing with filtering by status, order type, payment status, and search query.
  - Backend order status state validation preventing invalid transitions.
  - Updating order status to `completed` automatically marks `paymentStatus: 'paid'` and unlocks the customer review button in the customer portal.
- **Table Reservation Management (`/admin/reservations`)**:
  - Manage table booking requests (Confirm, Complete, Cancel) with date & status filtering.
- **Menu & Category Management (`/admin/menu` & `/admin/categories`)**:
  - Full CRUD operations for menu catalog dishes (title, price, category, dietary flags, availability toggle).
  - Safe category deletion ensuring orphaned items are blocked.
- **Review Moderation (`/admin/reviews`)**:
  - Moderate customer-submitted dining reviews (`pending`, `approved`, `rejected`).
  - Public website automatically filters and displays approved reviews only.
- **Customer Management (`/admin/customers`)**:
  - Customer directory with aggregated total orders and total spend metrics.
  - Detailed guest view displaying profile stats, order history, and booking logs.

---

## 🛠️ Tech Stack

### Frontend (`client/`)
- **Core**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS, PostCSS, `@tailwindcss/postcss`
- **Animations**: Framer Motion
- **State & Context**: AuthContext, CartContext, TanStack Query (React Query)
- **Form & Validation**: React Hook Form, Zod, `@hookform/resolvers`
- **Icons**: Lucide React

### Backend (`server/`)
- **Runtime**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB, Mongoose ORM
- **Authentication**: JWT (`jsonwebtoken`), `bcryptjs`
- **Validation**: Zod
- **Utilities**: CORS, dotenv, ts-node-dev

---

## 📁 Directory Structure

```text
Restaurant_Website/
├── client/                     # Vite + React + TypeScript Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # AdminLayout, AdminLogin, AdminDashboard, AdminOrders, AdminReservations, AdminMenu, AdminCategories, AdminReviews, AdminCustomers
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   ├── sections/       # Hero, FoodCategories, MenuSection, AboutSection, GallerySection, ReviewsSection, LocationContact, ReservationSection
│   │   │   └── ui/             # FoodDetailModal, CartDrawer, AuthModal, CheckoutModal, OrderConfirmationModal, OrderTrackingModal, AccountModal, ReviewSubmitModal
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── services/           # TanStack Query API services (api.ts & adminApi.ts)
│   │   ├── types/              # Domain TypeScript types & interfaces
│   │   ├── App.tsx             # Root App Component & Route Handler
│   │   ├── main.tsx            # React Entrypoint
│   │   └── index.css           # Custom Tailwind utilities & scrollbars
│   ├── index.html              # HTML shell with Google Fonts
│   └── package.json
│
├── server/                     # Express + TypeScript + Mongoose Backend
│   ├── src/
│   │   ├── models/             # Mongoose Schemas (User, Order, MenuItem, Category, Review, GalleryItem, Reservation)
│   │   ├── middleware/         # Auth (JWT & requireAdmin) & Zod validation middleware
│   │   ├── controllers/        # Auth, Admin, Order, Menu, Category, Review, Gallery & Reservation controllers
│   │   ├── routes/             # Express API Endpoints (`/api/auth`, `/api/admin`, `/api/orders`, `/api/menu`, etc.)
│   │   ├── seed/               # Gourmet database seeder
│   │   └── index.ts            # Server entrypoint
│   └── package.json
│
└── README.md                   # Documentation
```

---

## 🚀 Environment Variables Setup

### Backend (`server/.env`)
Create a `.env` file in `server/`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant_db
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=super_secret_etoile_noir_key_2026
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

### Frontend (`client/.env`)
Create a `.env` file in `client/`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Admin Setup & Default Account

To seed the initial menu catalog along with the **Default Administrator Account**:

```bash
cd server
npm run seed
```

### Default Admin Credentials:
* **Email**: `admin@example.com`
* **Password**: `Admin@123`
* **Admin Login Route**: Navigate to **`http://localhost:5173/admin`** in your browser.

---

## 💻 Installation & Running Instructions

### 1. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Seed Database
```bash
cd server
npm run seed
```

### 3. Start Development Servers
**Express Backend Server (Port 5000):**
```bash
cd server
npm run dev
```

**Vite Frontend Dev Server (Port 5173):**
```bash
cd client
npm run dev
```

---

## 🔗 API Documentation

| Method | Endpoint | Protection | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate customer & return JWT |
| `POST` | `/api/auth/admin/login` | Public | Authenticate administrator & return JWT |
| `GET` | `/api/auth/me` | JWT | Get current user profile & favorites |
| `PUT` | `/api/auth/profile` | JWT | Update user profile (name, email, phone) |
| `POST` | `/api/auth/favorites/:id` | JWT | Toggle favorite menu item |
| `POST` | `/api/orders` | Optional Auth | Submit order (Pickup or Delivery) |
| `GET` | `/api/orders` | JWT | Fetch customer's order history |
| `GET` | `/api/orders/:id` | Optional Auth | Fetch order details / tracking |
| `GET` | `/api/admin/dashboard` | Admin JWT | Real-time restaurant statistics |
| `GET` | `/api/admin/orders` | Admin JWT | List & filter all restaurant orders |
| `PATCH` | `/api/admin/orders/:id/status` | Admin JWT | Update order lifecycle status |
| `GET` | `/api/admin/reservations` | Admin JWT | List table reservations |
| `PATCH` | `/api/admin/reservations/:id/status` | Admin JWT | Update table reservation status |
| `GET` | `/api/admin/menu` | Admin JWT | List all menu items for admin |
| `POST` | `/api/admin/menu` | Admin JWT | Create new menu item |
| `PATCH` | `/api/admin/menu/:id` | Admin JWT | Edit menu item / toggle availability |
| `DELETE` | `/api/admin/menu/:id` | Admin JWT | Delete menu item |
| `GET` | `/api/admin/categories` | Admin JWT | List categories |
| `POST` | `/api/admin/categories` | Admin JWT | Create category |
| `PATCH` | `/api/admin/categories/:id` | Admin JWT | Edit category |
| `DELETE` | `/api/admin/categories/:id` | Admin JWT | Delete category |
| `GET` | `/api/admin/reviews` | Admin JWT | List reviews for moderation |
| `PATCH` | `/api/admin/reviews/:id/status` | Admin JWT | Approve or reject review |
| `DELETE` | `/api/admin/reviews/:id` | Admin JWT | Delete review |
| `GET` | `/api/admin/customers` | Admin JWT | List registered customers & spend metrics |
| `GET` | `/api/admin/customers/:id` | Admin JWT | Get customer profile & full history |
