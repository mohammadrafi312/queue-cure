# 🏥 Queue Cure

<div align="center">

## 🚀 Real-Time Hospital Queue Management System

### Making Hospital Waiting Rooms Smarter, Faster & Transparent

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)
![Socket.io](https://img.shields.io/badge/Socket.io-Real--Time-black?logo=socket.io)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-purple)

### 🌐 Live Demo

**Frontend:** https://queue-cure-blush-six.vercel.app

**Backend:** https://queue-cure-backend-eh9q.onrender.com

</div>

---

# 📌 Problem Statement

Hospital waiting rooms often suffer from:

❌ Long waiting times

❌ Lack of queue transparency

❌ Manual patient tracking

❌ Confusion about who is next

❌ Poor communication between staff and patients

Queue Cure solves these challenges through a real-time digital queue management system.

---

# 💡 Solution

Queue Cure provides:

✅ Patient Registration

✅ Automatic Token Generation

✅ Real-Time Queue Updates

✅ Live Waiting Room Dashboard

✅ Queue Position Tracking

✅ Dynamic Wait Time Prediction

✅ Current Patient Monitoring

✅ Session Management

✅ Multi-Device Synchronization

---

# ✨ Key Features

## 👨‍⚕️ Receptionist Dashboard

* Add Patients
* Edit Patient Information
* Remove Patients
* Call Next Patient
* Start New Clinic Session
* Live Queue Monitoring

---

## 🧑‍🤝‍🧑 Waiting Room Display

* Current Token Display
* Current Patient Display
* Queue Position Tracking (#1, #2, #3...)
* Estimated Waiting Time
* Live Queue Updates
* Large Display Mode

---

## ⚡ Real-Time Synchronization

Using Socket.io:

* Receptionist updates queue
* Backend broadcasts event
* Waiting Room updates instantly
* No page refresh required

---

# 🧠 Smart Features

### Dynamic Wait Time Prediction

Queue Cure calculates waiting time using actual consultation history.

Instead of hardcoded values:

* Tracks consultation start time
* Tracks consultation end time
* Calculates actual consultation duration
* Uses historical averages for prediction

This creates more accurate waiting estimates.

---

# 🏗️ System Architecture

```text
Receptionist Dashboard
         |
         v
    Express API
         |
         v
   MongoDB Atlas
         |
         v
 Socket.io Server
      /      \
     /        \
    v          v
Receptionist  Waiting Room
   Live UI      Live UI
```

---

# 🔄 Socket Event Flow

```text
Add Patient
     |
     v
Backend API
     |
     v
MongoDB Atlas
     |
emit("queueUpdated")
     |
     v
Socket.io Server
     |
     +-------------------+
     |                   |
     v                   v
Receptionist      Waiting Room

Both screens update instantly
```

---

# 🛠️ Tech Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Axios

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas

## Real-Time

* Socket.io

## Deployment

* Vercel
* Render

---

# 📷 Screenshots

## Receptionist Dashboard

*Add screenshot here*

---

## Waiting Room Display

*Add screenshot here*

---

# 🚀 Installation

Clone Repository

```bash
git clone https://github.com/mohammadrafi312/queue-cure.git
```

Navigate

```bash
cd queue-cure
```

Install Dependencies

```bash
npm install
```

Run Frontend

```bash
npm run dev
```

Run Backend

```bash
node server.js
```

---

# 🎯 Hackathon Highlights

✅ Full Stack Application

✅ Real-Time Updates

✅ Cloud Database

✅ Production Deployment

✅ Socket.io Integration

✅ Modern UI/UX

✅ Live Queue Tracking

✅ Dynamic Wait Prediction

---

# 👨‍💻 Developed By

### Shaik Mohammad Rafi

🎓 B.Tech – Computer Science Engineering

🏫 Sir C. R. Reddy College of Engineering

💻 Full Stack Developer | Data Analytics Enthusiast

---

<div align="center">

## 🌟 Queue Cure

### "Reducing Waiting Room Chaos Through Real-Time Technology"

⭐ If you like this project, give it a star!

</div>
