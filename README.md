#  E-Commerce Web Application (Laravel + React)

A full-stack e-commerce web application built using **Laravel (backend)** and **React (frontend)**.  
This project demonstrates product listings, shopping cart, authentication, and order management — built from scratch.

---

##  Features

- User authentication (login/register)
- Product listing and filtering by category
- Add to cart and quantity management
- Real-time cart updates
- Dummy payment system (backend integrated)
- Admin panel for product management
- Responsive UI with Tailwind CSS

---

##  Tech Stack

**Frontend:** React.js, Axios, Tailwind CSS  
**Backend:** Laravel, MySQL, Sanctum Auth  
**Tools:** XAMPP, Composer, Node.js, Git  

---

##  Installation Guide

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve

### Frontend setup
cd frontend
npm install
npm start

### Folder Structure
ecommerce_web/
├── backend/     # Laravel backend API
├── frontend/    # React frontend
├── .gitignore
└── README.md









