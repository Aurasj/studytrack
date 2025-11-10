# 📘 StudyTrack – Smart & Minimal Study Tracker

**StudyTrack** is a lightweight and modern React application designed to help you track study sessions, stay focused, and visualize your productivity in a clean and intuitive interface.

> ⚠️ **This project is still under development.** New features are added regularly.

---

## 🚀 Features

### ✅ Task Management
- Add, start, pause, complete, and delete tasks  
- Real-time timer for the active task  
- Automatic pause on page refresh  
- Data persistence using `localStorage`

### ✅ Smart Workflow
- Auto-scroll to the active study timer  
- Auto-scroll back to the related task after stopping  
- Global pause event system  
- Fast and minimal interaction flow

### ✅ Statistics & Analytics
- Tracks total study time per day  
- Beautiful 7-day bar chart using **Recharts**  
- Total study time counter  

### ✅ Theme Support
- Light / Dark mode  
- Theme preference saved automatically  

### ✅ Modern UI
- Built using **TailwindCSS**  
- Smooth animations  
- Responsive layout  
- Clean & minimalistic interface  

---

## 🧪 Tech Stack
- **React (Vite)** – fast and modern setup  
- **TailwindCSS** – utility-first styling  
- **Recharts** – analytics & charts  
- **localStorage** – data persistence  
- **Notifications API**

---

## 📦 Installation & Setup

### ✅ 1. Clone the repository
```bash
git clone https://github.com/Aurasj/studytrack.git
cd studytrack
```

✅ 2. Install dependencies
```bash
npm install
```

✅ 3. (Optional) Manual TailwindCSS installation
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

✅4. Start development server
```bash
npm run dev
```

📁 Project Structure (simplified)
```bash
src/
 ├─ components/
 │   ├─ AddTask.jsx
 │   ├─ TaskList.jsx
 │   ├─ TaskItem.jsx
 │   ├─ Timer.jsx
 │   ├─ DailyChart.jsx
 │   ├─ TotalStudy.jsx
 │   └─ ThemeToggle.jsx
 ├─ App.jsx
 ├─ main.jsx
 └─ index.css
```

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
