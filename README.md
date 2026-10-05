<div align="center">

# 🛍 ShopNest

**A colorful, playful online store with checkout, orders and an admin panel.**

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)

[Live Demo](https://ecommerce-store-black-tau.vercel.app/)

</div>

## 📑 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Demo Accounts](#-demo-accounts)
- [Author](#-author)

## 📖 About

ShopNest is a full e-commerce site. Customers can browse products, fill a cart, check out and track orders. One admin manages every order. It was built as Task 4 of the Auspify internship.

## 🚀 Features

| For | Feature |
|---|---|
| Customers | Browse 30 products and add to cart |
| Customers | Checkout and order history |
| Customers | Account page |
| Customers | Login and register in a popup |
| Admin | Dashboard with order management |
| Everyone | Responsive playful design with gradients |

New sign-ups are always customers. There is only one admin account.

## 🖼 Screenshots

### Landing Page

#### Landing Page
<img src="docs/screenshots/landing-page.PNG" alt="Landing Page" width="600">

#### Landing Page - Section 2
<img src="docs/screenshots/landing-page2.PNG" alt="Landing Page 2" width="600">

#### Landing Page - Section 3
<img src="docs/screenshots/landing-page3.PNG" alt="Landing Page 3" width="600">


### Product Browsing

#### Browse Products
<img src="docs/screenshots/browse-products-page.png" alt="Browse Products" width="600">

#### Products Pagination
<img src="docs/screenshots/products-page-pagination.PNG" alt="Products Pagination" width="600">

#### Product Details
<img src="docs/screenshots/product-details-page.png" alt="Product Details" width="600">


### Authentication

#### Register / Login
<img src="docs/screenshots/register-login-popup.png" alt="Register Login Popup" width="600">


### Checkout

#### Checkout Page
<img src="docs/screenshots/checkout-page.PNG" alt="Checkout Page" width="600">

#### Delivery Details
<img src="docs/screenshots/checkout-delivery-details.PNG" alt="Checkout Delivery Details" width="600">


### User Dashboard

#### User Dashboard
<img src="docs/screenshots/user-dashboard.PNG" alt="User Dashboard" width="600">

#### User Dashboard - Alternative View
<img src="docs/screenshots/user-dashboard2.png" alt="User Dashboard 2" width="600">

#### User Orders
<img src="docs/screenshots/user-orders-page.PNG" alt="User Orders" width="600">


### Admin Dashboard

#### Admin Dashboard
<img src="docs/screenshots/admin-dashboard.PNG" alt="Admin Dashboard" width="600">

#### Manage Orders
<img src="docs/screenshots/admin-manage-orders-page.PNG" alt="Admin Manage Orders" width="600">

#### Confirm Order
<img src="docs/screenshots/admin-confirm-order-page.PNG" alt="Admin Confirm Order" width="600">

#### Update Product
<img src="docs/screenshots/update-product-popup.png" alt="Update Product" width="600">

#### Remove Product
<img src="docs/screenshots/remove-product-popup.png" alt="Remove Product" width="600">


### UI & Loading

#### Loading Animation
<img src="docs/screenshots/loading-animation.PNG" alt="Loading Animation" width="600">


## Responsive Design

The application is fully responsive and optimized for desktop and mobile devices.

### Mobile Landing Page

<img src="docs/screenshots/landing-page-mobile.PNG" alt="Landing Page Mobile" width="300">

<img src="docs/screenshots/landing-page-mobile2.PNG" alt="Landing Page Mobile 2" width="300">

<img src="docs/screenshots/landing-page-mobile3.PNG" alt="Landing Page Mobile 3" width="300">


### Mobile Product Browsing

<img src="docs/screenshots/browse-products-page-mobile.PNG" alt="Browse Products Mobile" width="300">


### Mobile Product Details

<img src="docs/screenshots/product-details-page-mobile.PNG" alt="Product Details Mobile" width="300">

<img src="docs/screenshots/product-details-page-mobile2.PNG" alt="Product Details Mobile 2" width="300">


### Mobile Checkout

<img src="docs/screenshots/checkout-page-mobile.PNG" alt="Checkout Mobile" width="300">

<img src="docs/screenshots/checkout-page-mobile2.PNG" alt="Checkout Mobile 2" width="300">

<img src="docs/screenshots/checkout-page-mobile3.PNG" alt="Checkout Mobile 3" width="300">

## ⚙️ Getting Started

```bash
git clone https://github.com/Hashim017/ecommerce-store.git
cd ecommerce-store
npm install
```

Create a file named `.env` in the project root:

```
DATABASE_URL="your-postgres-connection-string"
```

Set up the database, add the sample products and start the app:

```bash
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## 🔑 Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `admin12345` |
| Customer | `demo@example.com` | `password123` |

## 👤 Author

**Muhammad Hashim** - [GitHub](https://github.com/Hashim017)
