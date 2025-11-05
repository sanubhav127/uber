# 🚖 Uber Clone (MERN Stack)

A full-stack **Uber-like ride-booking web application** built using the **MERN stack**, integrated with **Geocoding** and **GraphHopper APIs** for live route mapping, distance calculation, and estimated fare generation.

---

## 🚀 Features

### 👥 User Side (Rider)
- Register and log in securely.
- Set pickup and destination locations using Google Maps/Geocode.
- View route, estimated distance, and fare.
- Request rides and view driver information.
- Real-time ride status updates.

### 🚗 Driver Side
- Register and log in securely.
- Accept or reject ride requests.
- View pickup and destination on the map.
- Real-time route navigation (via GraphHopper routing).

---

## 🧩 Tech Stack

### Frontend
- React.js
- Tailwind CSS 
- Axios
- React Router DOM
- Map libraries (Leaflet)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- GraphHopper API (for routing)
- Geocode API (for address ↔ coordinates conversion)

---

## 🗺️ APIs Used

| API | Purpose |
|------|----------|
| **Geocode API** | Convert between addresses and latitude/longitude |
| **GraphHopper API** | Route calculation, travel time, and distance estimation |

---

## ⚙️ Installation & Setup

Clone the repository:
```bash
git clone https://github.com/sanubhav127/uber.git
cd uber

Backend Setup
cd backend
npm install 
npx nodemon

🔐 Environment Variables
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEOCODE_API_KEY=your_geocode_api_key
GRAPHHOPPER_API_KEY=your_graphhopper_api_key

🧑‍💻 Author
Anubhav Singh
📧 [sanubhav127@gmail.com]