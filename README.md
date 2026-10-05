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

## Screenshots

### Landing Page

#### Landing Page
![Landing Page](docs/screenshots/landing-page.PNG)

#### Landing Page - Section 2
![Landing Page 2](docs/screenshots/landing-page2.PNG)

#### Landing Page - Section 3
![Landing Page 3](docs/screenshots/landing-page3.PNG)


### Product Browsing

#### Browse Products
![Browse Products](docs/screenshots/browse-products-page.PNG)

#### Products Pagination
![Products Pagination](docs/screenshots/products-page-pagination.PNG)

#### Product Details
![Product Details](docs/screenshots/product-details-page.PNG)


### Authentication

#### Register / Login
![Register Login Popup](docs/screenshots/register-login-popup.PNG)


### Checkout

#### Checkout Page
![Checkout Page](docs/screenshots/checkout-page.PNG)

#### Delivery Details
![Checkout Delivery Details](docs/screenshots/checkout-delivery-details.PNG)


### User Dashboard

#### User Dashboard
![User Dashboard](docs/screenshots/user-dashboard.PNG)

#### User Dashboard - Alternative View
![User Dashboard 2](docs/screenshots/user-dashboard2.PNG)

#### User Orders
![User Orders](docs/screenshots/user-orders-page.PNG)


### Admin Dashboard

#### Admin Dashboard
![Admin Dashboard](docs/screenshots/admin-dashboard.PNG)

#### Manage Orders
![Admin Manage Orders](docs/screenshots/admin-manage-orders-page.PNG)

#### Confirm Order
![Admin Confirm Order](docs/screenshots/admin-confirm-order-page.PNG)

#### Update Product
![Update Product](docs/screenshots/update-product-popup.PNG)

#### Remove Product
![Remove Product](docs/screenshots/remove-product-popup.PNG)


### UI & Loading

#### Loading Animation
![Loading Animation](docs/screenshots/loading-animation.PNG)


## Responsive Design

The application is fully responsive and optimized for desktop and mobile devices.

### Mobile Landing Page

![Landing Page Mobile](docs/screenshots/landing-page-mobile.PNG)

![Landing Page Mobile 2](docs/screenshots/landing-page-mobile2.PNG)

![Landing Page Mobile 3](docs/screenshots/landing-page-mobile3.PNG)


### Mobile Product Browsing

![Browse Products Mobile](docs/screenshots/browse-products-page-mobile.PNG)


### Mobile Product Details

![Product Details Mobile](docs/screenshots/product-details-page-mobile.PNG)

![Product Details Mobile 2](docs/screenshots/product-details-page-mobile2.PNG)


### Mobile Checkout

![Checkout Mobile](docs/screenshots/checkout-page-mobile.PNG)

![Checkout Mobile 2](docs/screenshots/checkout-page-mobile2.PNG)

![Checkout Mobile 3](docs/screenshots/checkout-page-mobile3.PNG)

## ⚙️ Getting Started

```bash
git clone https://github.com/Hashim017/<repo-name>.git
cd <repo-name>
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