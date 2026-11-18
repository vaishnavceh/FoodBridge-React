# FoodBridge: Zero Waste, Zero Hunger

[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933.svg?logo=node.js)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg?logo=prisma)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg?logo=mysql)](https://www.mysql.com/)

**FoodBridge** is a modern, modular, production-ready full-stack redistribution and logistics platform. Built to support **UN SDG 2 (Zero Hunger)** and **UN SDG 12 (Responsible Consumption & Production)**, it solves the last-mile problem in food rescue through a synchronized tripartite model connecting **Donors**, **NGOs**, and **Volunteers** in real time.

---

## 🌟 Key Features

- **Triad Coordination Model**:
  - **Food Donors**: Broadcast surplus meals with expiration decay timers, pickup window parameters, and live GPS coordinate tagging. Generate digitally verifiable PDF/print certificates.
  - **NGOs & Shelters**: Monitor live satellite feeds, reserve surplus food atomically for community pickup, and broadcast urgent supply signals.
  - **Volunteers**: Accept transport missions, access turn-by-turn navigation links, coordinate directly with donors via click-to-call, and mark deliveries complete.
- **Admin Command Center**: Role distribution analytics, donation lifecycle monitoring, user directory management, and mission reset capabilities.
- **Enterprise-Grade Security**: JWT authentication with HTTP-only cookies, bcrypt password hashing (with automatic upgrade support for legacy plain-text accounts), express-validator input sanitization, rate limiting, and CORS isolation.
- **Modern Glassmorphic Dark UI**: Custom Carbon Edition theme styled with Tailwind CSS, responsive across mobile, tablet, and desktop viewports.
- **Interactive Mapping**: Leaflet integration with Dark CartoDB tiles and single-click GPS synchronization.

---

## 🏗 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite 6, Tailwind CSS 4, React Router DOM v7, Axios, Lucide React, Leaflet, React-Hot-Toast |
| **Backend** | Node.js, Express.js, REST API architecture, Prisma ORM, bcryptjs, JSON Web Tokens (JWT), Express-Validator, Express-Rate-Limit, Cookie-Parser, Morgan |
| **Database** | MySQL 8.0 / MariaDB (relational schema with ACID foreign keys and relational constraints) |
| **DevOps & Tooling** | Docker Compose, npm workspaces, concurrently, ESLint, dotenv |

---

## 📁 Project Architecture

```
FoodBridge/
├── backend/                    # Node.js & Express REST API
│   ├── prisma/
│   │   ├── schema.prisma       # Prisma relational schema mapping
│   │   └── seed.js             # Database seeding script with hashed credentials
│   ├── src/
│   │   ├── config/             # DB & environment variable configurations
│   │   ├── controllers/        # Request & response controllers
│   │   ├── middleware/         # Auth, Role authorization, Validation & Error handler
│   │   ├── routes/             # Modular Express route definitions
│   │   ├── services/           # Prisma business logic & query execution
│   │   ├── utils/              # JWT & standardized response helpers
│   │   ├── validators/         # Express-validator schema rules
│   │   ├── app.js              # Express application setup
│   │   └── server.js           # Server bootstrap & graceful shutdown
│   ├── .env.example
│   └── package.json
├── frontend/                   # React 19 + Vite Single-Page Application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── maps/           # Leaflet interactive map picker
│   │   │   └── ui/             # Navbar, Sidebar, Card, Button, Badge, Spinner, etc.
│   │   ├── context/            # AuthContext (global user state & token handling)
│   │   ├── layouts/            # MainLayout, AdminLayout, AuthLayout
│   │   ├── pages/              # 14 complete migrated pages
│   │   ├── services/           # Axios API service clients
│   │   ├── utils/              # Formatters, constants, helpers
│   │   ├── App.jsx             # React Router route declarations
│   │   ├── index.css           # Tailwind CSS 4 styling & print styles
│   │   └── main.jsx
│   ├── .env.example
│   ├── vite.config.js
│   └── package.json
├── database/
│   └── food_donation.sql       # Original MySQL dump for container initialization
├── docker-compose.yml          # Containerized MySQL 8.0 service
├── .env.example                # Global environment variables template
├── .gitignore
├── LICENSE                     # Mozilla Public License 2.0
├── package.json                # Root orchestration scripts
└── README.md
```

---

## 🚀 Quick Start Guide

You can run FoodBridge on any system (Windows, macOS, or Linux) in under 3 minutes.

### 1. Clone the repository

```bash
git clone https://github.com/vaishnavceh/FoodBridge.git
cd FoodBridge
```

### 2. Install all dependencies

Install root, backend, and frontend packages with a single command:

```bash
npm run install:all
```

### 3. Start the MySQL Database

#### Option A: Using Docker Compose (Recommended)
```bash
docker compose up -d
```

#### Option B: Using Local MySQL or XAMPP
Ensure MySQL is running on port `3306` with the database `food_donation` created:
```sql
CREATE DATABASE IF NOT EXISTS food_donation;
```

### 4. Initialize Database Schema & Seed Data

Generate the Prisma Client:
```bash
npm run db:generate
```

Push schema to your database (or run migrations):
```bash
npm run db:push
```

Seed initial accounts and sample data:
```bash
npm run db:seed
```

### 5. Launch Development Environment

Run frontend and backend simultaneously with unified logs:
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Demo Credentials

The database seed script populates the following accounts for immediate testing:

| Role | Username | Password | Email | Location | Description |
|---|---|---|---|---|---|
| **Donor** | `donor1` | `password123` | donor1@example.com | New York | Can broadcast food & fulfill NGO needs |
| **Donor** | `vaish123` | `sergioramos4` | vaishnavvfisc@gmail.com | Kollam | Sample donor account from original data |
| **NGO** | `ngo1` | `password123` | ngo1@example.com | Los Angeles | Can browse feed & broadcast community needs |
| **Volunteer** | `volunteer1` | `password123` | volunteer1@example.com | Chicago | Can claim missions & complete deliveries |
| **Admin** | `master_admin` | `admin123` | admin@foodbridge.com | Headquarters | Full access to Staff Portal & command center |

---

## 🔄 PHP to React Migration Matrix

Every feature and business rule from the original PHP application has been preserved and elevated into a modern full-stack implementation:

| Original PHP File | New React Page / Route | New REST API Endpoint(s) | Business Logic & Capabilities Preserved |
|---|---|---|---|
| `index.php` | `Home.jsx` (`/`) | `GET /api/stats/public` | Landing page hero, live stats counters, role architecture cards |
| `login.php` | `Login.jsx` (`/login`) | `POST /api/auth/login` | Donor, NGO, and Volunteer authentication; legacy plain-text auto-upgrade |
| `register.php` / `signup.php` | `Register.jsx` (`/register`) | `POST /api/auth/register` | Consolidated registration with role select, bcrypt hashing, input validation |
| `logout.php` | Handled in `AuthContext` | `POST /api/auth/logout` | Token clearance and HTTP cookie invalidation |
| `dashboard.php` | `Dashboard.jsx` (`/dashboard`) | `GET /api/dashboard/stats`, `GET /api/dashboard/alerts` | Role-themed navigation, active donation count, real-time NGO fulfillment alert banners |
| `donate.php` | `DonatePage.jsx` (`/donate`) | `POST /api/donations` | Leaflet map with dark tiles, GPS sync, food details form, digital certificate print slip |
| `browse.php` | `BrowseDonations.jsx` (`/browse`) | `GET /api/donations`, `POST /api/donations/:id/claim` | Satellite feed, decay countdown percentage bars, atomic reservation for pickup, navigation links |
| `accept_mission.php` | `VolunteerTasks.jsx` (`/volunteer-tasks`) | `POST /api/donations/:id/accept-mission` | Concurrency-safe mission claiming by volunteers |
| `claim_process.php` | `BrowseDonations.jsx` | `POST /api/donations/:id/claim` | Atomic update ensuring single claimer concurrency safety |
| `my_donations.php` | `MyDonations.jsx` (`/my-donations`) | `GET /api/donations/my` | Donor contribution archive with digital certificate reprint generator |
| `my_requests.php` | `MyRequests.jsx` (`/my-requests`) | `GET /api/requests/my`, `POST /api/requests` | NGO supply signal broadcast command bar with GPS locking |
| `my_history.php` | `MyHistory.jsx` (`/my-history`) | `GET /api/volunteers/history` | Volunteer completed transport log with donor details |
| `request.php` / `view_requests.php` | `ViewRequests.jsx` (`/view-requests`) | `GET /api/requests`, `POST /api/requests/:id/fulfill`, `GET /api/requests/fulfilled-by-me` | Donor fulfillment of NGO signals, automated volunteer mission generation |
| `volunteer_tasks.php` | `VolunteerTasks.jsx` (`/volunteer-tasks`) | `GET /api/volunteers/tasks`, `POST /api/donations/:id/complete` | In-progress delivery tracking, direct phone coordination, completion confirmation |
| `admin_login.php` | `AdminLogin.jsx` (`/admin-login`) | `POST /api/auth/admin-login` | Isolated staff portal authentication with admin role enforcement |
| `admin.php` | `AdminDashboard.jsx` (`/admin`) | `GET /api/admin/stats`, `GET /api/admin/users`, `DELETE /api/admin/users/:id`, `GET /api/admin/logistics`, `POST /api/donations/:id/reset` | Analytics charts, mission reset, user management, live logistics tracker |
| `learn_more.php` | `LearnMore.jsx` (`/learn-more`) | Static & Dynamic Components | Platform manifesto, executive summary, Triad Model, SDG progress bars, roadmap |
| `config.php` | `db.js`, `env.js`, `schema.prisma` | N/A | Centralized environment management and Prisma Client singleton |

---

## 🛠 Available Root Commands

| Command | Action |
|---|---|
| `npm run dev` | Runs both backend API (`:5000`) and frontend Vite (`:5173`) concurrently |
| `npm run dev:backend` | Starts only the Node.js Express backend with nodemon |
| `npm run dev:frontend` | Starts only the Vite React frontend |
| `npm run build` | Generates Prisma client and creates production Vite build |
| `npm run db:generate` | Generates Prisma Client from `schema.prisma` |
| `npm run db:push` | Synchronizes the Prisma schema with the MySQL database |
| `npm run db:migrate` | Runs Prisma development migrations |
| `npm run db:seed` | Populates the database with default accounts and sample data |
| `npm run install:all` | Installs root, backend, and frontend dependencies |

---

## 🚢 Deployment Guide

### Deploying the Backend (e.g., Render, Railway, or Fly.io)
1. Deploy `backend/` as a Node.js web service.
2. Build command: `npm install && npm run prisma:generate`
3. Start command: `npm start`
4. Configure environment variables in dashboard:
   - `DATABASE_URL`: Hosted MySQL connection URL (e.g., PlanetScale, Railway MySQL, Aiven)
   - `JWT_SECRET`: A cryptographically secure random string
   - `FRONTEND_URL`: URL of your deployed frontend (e.g., `https://foodbridge.vercel.app`)
   - `NODE_ENV`: `production`

### Deploying the Frontend (e.g., Vercel or Netlify)
1. Deploy `frontend/` as a Vite application.
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Configure environment variable:
   - `VITE_API_URL`: Your deployed backend API URL (e.g., `https://foodbridge-api.onrender.com/api`)

---

## 📜 License

This project is licensed under the **Mozilla Public License 2.0 (MPL 2.0)** - see the [LICENSE](LICENSE) file for details.
