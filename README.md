# Campus Event Hub 🎓

A full-stack-ready web application for managing campus events — built with React + Vite and designed to connect students, organizers, and administrators.

![Landing Page](./docs/preview.png)

---

## ✨ Features

- 🎭 **Role-based access** — Student, Organizer, Admin dashboards
- 🗓️ **Event discovery** — Browse, search, and filter campus events
- 🎟️ **QR Ticketing** — Auto-generated scannable QR codes for every ticket
- 📊 **Analytics** — Attendance, ratings, and engagement dashboards
- 🌙 **Dark mode** — Deep blue-navy theme matching the Stitch design
- 🔌 **Spring Boot ready** — All API service files pre-wired for backend integration

---

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 🎓 Student | `alex@campus.edu` | `password123` |
| 🗂️ Organizer | `sarah@campus.edu` | `password123` |
| ⚙️ Admin | `admin@campus.edu` | `password123` |

---

## 🗂️ Project Structure

```
Event_app/
└── frontend/               # React + Vite frontend
    ├── src/
    │   ├── api/            # Axios service files (Spring Boot ready)
    │   ├── components/     # Shared layout & UI components
    │   ├── context/        # Auth & Theme context providers
    │   ├── data/           # Dummy data (replace with real API)
    │   ├── pages/          # 9 pages (Landing, Login, Register, Events...)
    │   ├── router/         # React Router with route guards
    │   └── styles/         # Global CSS & design tokens
    └── tailwind.config.js  # Custom design system
```

---

## 🔌 Connecting to Spring Boot Backend

1. Update `src/api/axiosInstance.js`:
   ```js
   const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
   ```
2. Create `.env.local`:
   ```
   VITE_API_URL=http://localhost:8080/api
   ```
3. In each service file, replace dummy data Promises with real `axiosInstance` calls.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 + Vite |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS (custom design system) |
| Icons | Lucide React + Material Symbols |
| HTTP Client | Axios (JWT interceptors) |
| QR Codes | qrcode.react |
| State | React Context API |

---

## 📄 License

MIT
