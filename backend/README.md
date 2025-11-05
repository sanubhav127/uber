# ⚙️ Backend - Uber Clone

This is the **backend server** of the Uber-like ride-booking application.  
It provides authentication, ride management, geolocation handling, and route optimization using **Geocode** and **GraphHopper APIs**.

---

## 🚀 Features

- Secure JWT-based authentication for users and drivers.
- Manage ride requests, accept/reject, and complete rides.
- Calculate routes, travel times, and fares using **GraphHopper API**.
- Convert user addresses to coordinates via **Geocode API**.
- Real-time ride updates through REST APIs.

---

## 🧩 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- dotenv
- axios (for calling Geocode & GraphHopper)
- cookie-parser
- cors

---

## ⚙️ Setup & Run

```bash
cd backend
npm install
npx nodemon