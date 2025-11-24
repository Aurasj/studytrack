# 📌 StudyTrack – Version History (Changelog)

This document lists all versions and changes based strictly on the current codebase of the StudyTrack project.

---

## ✅ v1.2.0 – Smart Workflow, Auto-Scroll & Improved Timer Logic  
**Status:** Current stable version  

### 🔹 New Features
- **Auto-scroll to the active Timer** when starting a task  
- **Auto-scroll back to the stopped task** using `lastStoppedTaskRef`  
- **Global pause event system** using `CustomEvent("pauseActiveTask")`  
- Improved handling of active tasks after page refresh  
- Reminder interval fully configurable  
- Added glow animation for active study mode (`pulse-slow`)

### 🔹 Logic Improvements
- Timer uses `useRef` (`baseTimeRef`) for accurate time accumulation  
- Centralized “pause” logic using `pauseTask()`  
- Cleaned up reminder intervals using `useEffect` teardown  
- Optimized rendering in `App.jsx` and reduced duplicate calculations  

### 🐞 Fixes
- Fixed active timer continuing unexpectedly after refresh  
- Fixed reminder notifications stacking  
- Fixed UI flicker in dark/light theme when switching tasks  

---

## ✅ v1.1.0 – Notifications + Daily Stats + Weekly Chart

### 🔹 Major Additions
- **Browser Notifications API integration**
  - Start study alert  
  - Pause alert  
  - Periodic reminder alert  
- Implemented **dailyStats** with `localStorage` persistence  
- Added 7-day chart display using **Recharts** (`DailyChart.jsx`)  
- Added **TotalStudy.jsx** showing full accumulated time  
- Display for **minutes studied today**

### 🔹 Enhancements
- Better task tracking structure (`timeSpent`, `lastStart`, `isActive`)  
- Unified daily time update through `addToDailyStats()`  
- Improved layout + new reusable card styles  

### 🐞 Fixes
- Daily stats no longer reset after reload  
- Fixed formatting inconsistencies in chart labels  

---

## ✅ v1.0.0 – Initial Release (Core Functionality)

### 🚀 Core Features
- Add tasks with:  
  - Unique ID  
  - Title  
  - Date  
  - Status (Upcoming / Completed / Overdue / Canceled)  
  - Time tracking  
- Real-time study timer (`Timer.jsx`)  
- Start/Pause a task  
- Auto-save all tasks to `localStorage`  
- Save current progress even after page refresh  
- Clean and responsive UI with TailwindCSS  
- Light/Dark mode with saved theme preference  
- Basic components:  
  - `AddTask`  
  - `TaskList`  
  - `TaskItem`  
  - `Timer`  
  - `ThemeToggle`

---
- Cross-device study tracking  
- Leaderboard / group study mode  
- Weekly goals + streaks  

---
