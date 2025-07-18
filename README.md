# Blood Bank Management System

A backend system built with **NestJS** and **PostgreSQL** to manage blood donations, hospital requests, and inventory tracking. It supports both **donor and admin roles** and ensures clean architecture, validation, and test-driven development.

---

## 📦 Features

### 🔐 Authentication

- Donors can register/login using their **National ID**.
- Admins can login with email/password.
- JWT-based authentication with **role-based access control** (RBAC).

### 🩸 Donation Management

- Donors can submit blood donations.
- Donations are validated:
  - Last donation must be ≥ 3 months ago
  - Virus test must be negative
- Accepted donations update donor records.

### 🏥 Hospital Requests

- Hospitals can submit requests for specific blood types.
- System processes requests **in batches of 10+** using a **greedy algorithm** prioritizing:
  1. Patient urgency (Immediate > Urgent > Normal)
  2. Donation proximity (same city preferred)

### 🧠 Matching Algorithm

- Uses custom prioritization logic for donations.
- Automatically fulfills requests once threshold is met.

### 🧪 Testing

- Fully unit tested using **Jest**.
- Mocked repositories for isolation.

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/your-username/blood-bank-management-system.git
cd blood-bank-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure `.env`

```env
PORT=3000

# PostgreSQL configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=root
POSTGRES_DB=blood_bank_db
DB_SYNCHRONIZE=true
DB_LOGGING=true

# JWT configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# Mail configuration
MAIL_HOST=smtp.example.com
MAIL_SERVICE=example
SMTP_USERNAME=user@example.com
SMTP_PASSWORD="your_SMPT_password"
SMTP_PORT=587
```

### 4. Run the app

```bash
npm run start:dev
```

### 5. Run tests

```bash
npm run test
```

---

## 📡 API Endpoints

### 🔐 Auth Endpoints (`src/auth/auth.controller.ts`)

- `POST /auth/login` — Donor login (by national ID)
- `POST /auth/register` — Donor registration
- `POST /auth/admin` — Admin login (by email/password)

### 🧑‍💼 Admin Endpoints (`src/admin/admin.controller.ts`)

- `POST /admin` — Create a new admin account

### 🧑 Donor Endpoints (`src/donor/donor.controller.ts`)

- `GET /donors` — List all donors (**admin only**, requires JWT)

### 🩸 Donation Endpoints (`src/donation/donation.controller.ts`)

- `POST /donations` — Submit a blood donation (**donor only**, requires JWT)

### 🏥 Hospital Request Endpoints (`src/hospital-request/hospital-request.controller.ts`)

- `POST /hospital-request` — Submit a hospital blood request

### 🌐 Root Endpoint (`src/app.controller.ts`)

- `GET /` — Health check (returns welcome message)

---

## 🛠 Tech Stack

- **NestJS** (Modular architecture)
- **PostgreSQL** via TypeORM
- **Jest** for unit testing
- **Class-validator** for DTO validation

---

## 📁 Project Structure

```
src/
  ├── auth/                  # Auth logic (donor + admin)
  ├── admin/                 # Admin entity + services
  ├── donor/                 # Donor entity + services
  ├── donation/              # Donation entity + rules
  ├── hospital-request/      # Request + fulfillment logic
  └── mail/                  # Email rejection handling
```

Feel free to fork, contribute, or suggest enhancements!
