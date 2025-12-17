# The Real Estate Platform

A full-stack real estate web application built with **React** for the frontend and **Node.js + Express** for the backend.  
This project allows users to browse property listings, view details, and explore virtual tours.


## 🛠 Features

- 🏡 Browse all properties
- 🔎 Search and filter listings
- 📍 View detailed property pages
- 🧭 Navigate using React Router
- 📱 Virtual tours page
- 🔐 Authentication (login / register)
- 🔔 Toast notifications for feedback
- ⚡ Fast REST API backend


## 🧱 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, React Router, Axios |
| Backend | Node.js, Express |
| Database | (Add your DB here, e.g., MongoDB) |
| Notifications | react-toastify |
| Authentication | JWT / Auth Context |
| Deployment | Vercel (frontend), Render / Railway (backend) |


## 📁 Project Structure

real-estate-platform/
├── client/ # React frontend
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── utils/
│ │ └── App.js
│ ├── package.json
│ └── README.md
├── server/ # Express backend
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── server.js
│ └── package.json
├── .gitignore
└── README.md


## 🚀 Getting Started

### 🔹 Prerequisites

Make sure you have:

- Node.js (v14+)
- npm (v6+)
- MongoDB database (if using)


## ⌨️ Install & Run Locally

### 🧩 Clone the repository

```bash
git clone https://github.com/Aksharmadan/The-Real-Estate.git
cd The-Real-Estate

Backend Setup
cd server
npm install

Create a .env with:

PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret

Start the backend server:

npm start

Server will run on:

http://localhost:5000

Frontend Setup
cd ../client
npm install
npm start

Frontend runs on:

http://localhost:3000

