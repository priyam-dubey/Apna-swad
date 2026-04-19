# Apna Swad - Food Ordering Website

Apna Swad is a full-stack food ordering web application built with the MERN Stack. It offers a seamless and user-friendly platform for ordering food online.

## Features

- User Panel
- Admin Panel
- JWT Authentication
- Password Hashing with Bcrypt
- Stripe Payment Integration
- Login/Signup & Logout
- Add to Cart
- Place & Track Orders
- Order Management
- Products Management
- Filter Food Products
- Authenticated REST APIs
- Role-Based Access Control

## Tech Stack

* [React](https://reactjs.org/)
* [Node.js](https://nodejs.org/en)
* [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [Stripe](https://stripe.com/)
* [JWT Authentication](https://jwt.io/introduction)
* [Multer](https://www.npmjs.com/package/multer)
* [Vite](https://vitejs.dev/)

## Run Locally

Clone the project

```bash
git clone https://github.com/priyam-dubey/apna-swad
cd apna-swad
```

Install dependencies

```bash
cd frontend && npm install
cd ../admin && npm install
cd ../backend && npm install
```

Setup Environment Variables

Create `.env` file inside `backend` folder:

```env
JWT_SECRET=YOUR_SECRET_TEXT
SALT=YOUR_SALT_VALUE
MONGO_URL=YOUR_DATABASE_URL
STRIPE_SECRET_KEY=YOUR_KEY
```

Setup Frontend and Backend URLs

- `App.jsx` in Admin folder → `const url = YOUR_BACKEND_URL`
- `StoreContext.js` in Frontend folder → `const url = YOUR_BACKEND_URL`
- `orderController.js` in Backend folder → `const frontend_url = YOUR_FRONTEND_URL`

Start the servers

```bash
# Backend
cd backend && nodemon server.js

# Frontend
cd frontend && npm run dev

# Admin
cd admin && npm run dev
```

## Deployment

Deployed using Vercel (Frontend & Admin) and Render (Backend).

## Author

**Priyambad Kumar Dubey**
- GitHub: [priyam-dubey](https://github.com/priyam-dubey)

## Feedback

If you have any feedback, feel free to reach out via GitHub.