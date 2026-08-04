# 🍔 Apna Swad — Food Delivery App

A full-stack MERN food delivery platform inspired by Swiggy and Zomato.

The application provides customers with a seamless food ordering experience while giving administrators complete control over menu management and order processing.

Built using React, Node.js, Express, MongoDB, Stripe, and JWT Authentication.

## Live Demo

🌐 Customer App:
https://apna-swad-six.vercel.app/

🛠 Admin Dashboard:
https://apna-swad-umvn.vercel.app/

⚙ Backend API:
https://apna-swad-backend-v08b.onrender.com/

## 📸 Project Screenshots

| Customer Application | Admin Dashboard |
|----------------------|-----------------|
| <img src="./screenshots/frontend.png" width="500"/> | <img src="./screenshots/admin.png" width="500"/> |

| Backend Server | Stripe Checkout |
|----------------|-----------------|
| <img src="./screenshots/backend.png" width="500"/> | <img src="./screenshots/stripe.png" width="500"/> |

## Features

### Customer

- JWT Authentication
- Login & Signup
- Browse food menu
- Search & filter foods
- Add to cart
- Stripe checkout
- View order history
- Track order status

### Admin

- Secure admin login
- Add food items
- Delete food items
- View all orders
- Update order status
- Role-based access

### Backend

- REST APIs
- JWT middleware
- Password hashing using bcrypt
- Stripe payment integration
- Multer image uploads
- MongoDB Atlas integration

## Tech Stack

Frontend

- React
- Vite
- Axios
- React Router

Backend

- Node.js
- Express
- MongoDB
- Mongoose

Authentication

- JWT
- bcrypt

Payments

- Stripe Checkout

Deployment

- Vercel
- Render

Others

- Multer

Frontend (React)
        │
        │ REST API
        ▼
Backend (Express)
        │
        ├── MongoDB Atlas
        └── Stripe Checkout

---



## Project Structure

```
Apna Swad/
├── backend/        — Express + MongoDB API
├── frontend/       — React customer app  (port 5173)
└── admin/          — React admin panel   (port 5174)
```

---

## ⚡ Quick Start (Windows PowerShell)

### Step 1 — Configure environment variables

**backend/.env** — open the file and replace the three placeholder values:
```
MONGO_URL=mongodb+srv://YOUR_USER:YOUR_PASS@cluster.mongodb.net/apna-swad
JWT_SECRET=any_long_random_string_at_least_32_characters
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
```
The other values (PORT, SALT, FRONTEND_URL, ALLOWED_ORIGINS) can stay as-is for local dev.

`frontend/.env` and `admin/.env` are already set to `http://localhost:4000` — no changes needed.

---

### Step 2 — Install dependencies

Open **three separate terminals** and run:

```powershell
# Terminal 1 — Backend
cd "C:\projects\Apna Swad\backend"
npm install

# Terminal 2 — Frontend
cd "C:\projects\Apna Swad\frontend"
npm install

# Terminal 3 — Admin
cd "C:\projects\Apna Swad\admin"
npm install
```

---

### Step 3 — Run the app

In the **same three terminals**:

```powershell
# Terminal 1 — Backend  (keep running)
npm run server

# Terminal 2 — Frontend
npm run dev
# Opens at http://localhost:5173

# Terminal 3 — Admin
npm run dev
# Opens at http://localhost:5174
```

---

## Creating an Admin Account

There is no sign-up form in the admin panel — create an admin user directly in MongoDB:

1. Open your cluster in MongoDB Atlas → Browse Collections → `users`
2. Find your user document and set: `"role": "admin"`
3. Log in at `http://localhost:5174`

---

## Stripe Test Cards

Use these card numbers on the Stripe checkout page:

| Card | Number |
|------|--------|
| Success | `4242 4242 4242 4242` |
| Decline | `4000 0000 0000 0002` |

Use any future expiry date, any 3-digit CVC.
