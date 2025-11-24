# 🚀 StudyTrack

**StudyTrack** is a modern productivity and study-tracking app built with **React + Firebase**, designed for students, developers, and anyone who wants to track time efficiently.  
It features task management, stopwatch & pomodoro timer, XP leveling, charts, cloud sync, notifications, and a polished UI.

---

## ✨ Features

### 📚 Task Management
- Add tasks with category and optional deadline.
- Categories: Mathematics, Coding, Science, Languages, Reading, Other.
- Status filters: **All, Upcoming, Completed, Overdue, Canceled**.
- Automatic overdue detection.

### ⏱️ Stopwatch & Pomodoro Timer
- Dual timer system.
- Customizable Pomodoro intervals (work & break).
- Smooth real-time updates.
- Desktop notifications (“Time for a break”, “Back to work”).

### 🧘 Focus Mode
- Full-screen immersive mode to eliminate distractions.

### 🔥 XP System & Leveling
- XP = total seconds spent studying.
- Levels from **Novice 🌱** to **Grandmaster 👑**.
- Progress bar and dynamic titles.

### 📊 Statistics & Charts
- **Daily Progress Chart** (last 7 days).
- **Category Distribution Pie Chart**.
- **Total Study Time** widget.

### ☁️ Cloud Sync (Firebase Firestore)
- Real-time sync for tasks, XP, and stats.
- Automatic fallback to localStorage.
- Password hashing migration (plain → SHA-256).

### 🔐 Secure Login
- User accounts protected with SHA-256 hashed passwords.
- Handles legacy accounts + auto-migrates them.

### 🎨 Modern UI + Dark Mode
- TailwindCSS + glass-morphism interfaces.
- Persistent theme stored in localStorage.

---

## 🧩 Tech Stack

- React 18  
- Firebase Firestore  
- TailwindCSS  
- Recharts  
- Vite  
- Web Notifications API  
- LocalStorage sync layer  

---
```bash
## 📂 Project Structure
src/
├── App.jsx
├── main.jsx
├── index.css
├── firebase.js
├── utils/
│ └── crypto.js
├── constants.js
└── components/
├── AddTask.jsx
├── TaskList.jsx
├── TaskItem.jsx
├── Timer.jsx
├── FocusMode.jsx
├── DailyChart.jsx
├── CategoryChart.jsx
├── TotalStudy.jsx
├── LevelDisplay.jsx
├── ThemeToggle.jsx
└── LoginScreen.jsx
```

---

## 🛠️ Installation

### 1️⃣ Clone the repository
```sh
git clone https://github.com/Aurasj/studytrack
cd studytrack
npm install
src/firebase.js
npm run dev
```
---

🔔 Permissions

The app uses browser notifications, so make sure to allow them for reminders and pomodoro alerts.

---

 📜 License
```bash
This project is open-source.
✅ Anyone is free to use, modify, or redistribute it.
```
🎓 Academic Information
```bash
Project created for:

Transilvania University of Brașov
Faculty of Electrical Engineering and Computer Science
Specialization: Telecommunications Systems & Technologies (TST)
```

👥 Authors
```bash
Developed by:
Iancu Aurelian
Ghimpu Dragoș
Iliuță Andrei
Grecea Mădălin
```
