import { useState, useEffect, useRef } from "react";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { hashPassword } from "./utils/crypto";

import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import Timer from "./components/Timer";
import ThemeToggle from "./components/ThemeToggle";
import DailyChart from "./components/DailyChart";
import TotalStudy from "./components/TotalStudy";
import LevelDisplay from "./components/LevelDisplay";
import FocusMode from "./components/FocusMode";
import CategoryChart from "./components/CategoryChart";
import LoginScreen from "./components/LoginScreen";

export default function App() {
  // --- STATE ---
  const [user, setUser] = useState(() => localStorage.getItem("studytrack_user"));

  // 1. Tasks Data
  const [tasks, setTasks] = useState([]);

  // 2. View State
  const [activeSessionId, setActiveSessionId] = useState(null);

  // 3. Settings & Refs
  const [reminderInterval, setReminderInterval] = useState(10 * 1000);
  const reminderRef = useRef(null);
  const timerRef = useRef(null);
  const [isFocusMode, setIsFocusMode] = useState(false);

  // 4. Stats & XP
  const [dailyStats, setDailyStats] = useState({});
  const [xp, setXp] = useState(0);

  // --- FIREBASE SYNC ---
  useEffect(() => {
    if (!user) return;

    const userRef = doc(db, "users", user);

    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setTasks(data.tasks || []);
        setDailyStats(data.dailyStats || {});
        setXp(data.xp || 0);
        // Persist to localStorage as backup
        localStorage.setItem('tasks', JSON.stringify(data.tasks || []));
        localStorage.setItem('dailyStats', JSON.stringify(data.dailyStats || {}));
        localStorage.setItem('xp', data.xp ? data.xp.toString() : '0');
      } else {
        // Create new user doc if not exists
        setDoc(userRef, { tasks: [], dailyStats: {}, xp: 0 }, { merge: true });
        // Initialize empty data in localStorage
        localStorage.setItem('tasks', JSON.stringify([]));
        localStorage.setItem('dailyStats', JSON.stringify({}));
        localStorage.setItem('xp', '0');
      }
    }, (error) => {
      console.error("Firestore Error Details:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      alert(`Eroare la conectare!\n\nCod: ${error.code}\nMesaj: ${error.message}\n\nDeschide Console (F12) pentru detalii.`);
      setUser(null); // Logout on error
    });

    return () => {
      unsubscribe();
    };
  }, [user]);

  const saveToCloud = async (newTasks, newStats, newXp) => {
    if (!user) return;
    const userRef = doc(db, "users", user);
    const tasksToSave = newTasks !== undefined ? newTasks : tasks;
    const statsToSave = newStats !== undefined ? newStats : dailyStats;
    const xpToSave = newXp !== undefined ? newXp : xp;
    await setDoc(userRef, {
      tasks: tasksToSave,
      dailyStats: statsToSave,
      xp: xpToSave
    }, { merge: true });
    // Also persist to localStorage as backup
    localStorage.setItem('tasks', JSON.stringify(tasksToSave));
    localStorage.setItem('dailyStats', JSON.stringify(statsToSave));
    localStorage.setItem('xp', xpToSave.toString());
  };
  // --- EFFECTS ---

  // Notifications Permission
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // On Load: Check for interruptions & overdue
  useEffect(() => {
    setTasks(prev =>
      prev.map(t => {
        let updated = { ...t };
        // Interruption check
        if (t.isActive && t.lastStart) {
          const extra = Math.floor((Date.now() - t.lastStart) / 1000);
          addToDailyStats(extra);
          updated = { ...updated, timeSpent: updated.timeSpent + extra, isActive: false, lastStart: null };
        }
        // Overdue check
        if (updated.status === "upcoming" && updated.dueDate) {
          const due = new Date(updated.dueDate).getTime();
          if (Date.now() > due) updated.status = "overdue";
        }
        return updated;
      })
    );
    if (reminderRef.current) clearInterval(reminderRef.current);
  }, []);

  // Reminder Logic (Only runs if a task is ACTIVELY ticking)
  useEffect(() => {
    const tickingTask = tasks.find(t => t.isActive);

    if (!tickingTask) {
      if (reminderRef.current) {
        clearInterval(reminderRef.current);
        reminderRef.current = null;
      }
      return;
    }

    if (!reminderRef.current) {
      reminderRef.current = setInterval(() => {
        const check = tasks.find(t => t.id === tickingTask.id);
        if (check && check.isActive) {
          sendNotification("Reminder", "Inca studiezi? Tine-o tot asa! 👊");
        }
      }, reminderInterval);
    }

    return () => {
      if (reminderRef.current) {
        clearInterval(reminderRef.current);
        reminderRef.current = null;
      }
    };
  }, [tasks, reminderInterval]);

  // --- ACTIONS ---

  const handleLogin = async (username, password) => {
    try {
      const userRef = doc(db, "users", username);
      const userDoc = await getDoc(userRef);
      const passwordHash = await hashPassword(password);

      if (userDoc.exists()) {
        // Existing user
        const userData = userDoc.data();

        if (!userData.passwordHash && !userData.password) {
          // Brand new legacy account - add hashed password
          await setDoc(userRef, { passwordHash }, { merge: true });
          localStorage.setItem("studytrack_user", username);
          setUser(username);
          alert("Parolă adăugată pentru contul tău! 🔐");
        } else if (userData.password && !userData.passwordHash) {
          // Old plain-text password - migrate to hash
          const oldPasswordHash = await hashPassword(userData.password);
          if (oldPasswordHash === passwordHash) {
            // Correct password - migrate to hash
            await setDoc(userRef, { passwordHash, password: null }, { merge: true });
            localStorage.setItem("studytrack_user", username);
            setUser(username);
            alert("Parolă actualizată la format securizat! 🔒");
          } else {
            alert("Parolă incorectă! ❌");
          }
        } else if (userData.passwordHash === passwordHash) {
          // Correct hashed password
          localStorage.setItem("studytrack_user", username);
          setUser(username);
        } else {
          // Wrong password
          alert("Parolă incorectă! ❌");
        }
      } else {
        // New user - create account with hashed password
        await setDoc(userRef, {
          passwordHash,
          tasks: [],
          dailyStats: {},
          xp: 0
        });
        localStorage.setItem("studytrack_user", username);
        setUser(username);
        alert("Cont nou creat! 🎉");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Eroare la autentificare: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("studytrack_user");
    setUser(null);
    setTasks([]);
    setDailyStats({});
    setXp(0);
  };

  const sendNotification = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  const addToDailyStats = (seconds) => {
    const today = new Date().toISOString().slice(0, 10);
    const newStats = {
      ...dailyStats,
      [today]: (dailyStats[today] || 0) + seconds
    };
    const newXp = xp + seconds;

    setDailyStats(newStats);
    setXp(newXp);
    saveToCloud(undefined, newStats, newXp);
  };

  // 1. Open Session (View)
  const openSession = (id) => {
    setActiveSessionId(id);
    setTimeout(() => {
      timerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  // 2. Close Session (View)
  const closeSession = () => {
    if (activeSessionId) {
      const task = tasks.find(t => t.id === activeSessionId);
      if (task && task.isActive) {
        pauseTimer(activeSessionId);
      }
    }
    setActiveSessionId(null);
    setIsFocusMode(false);
  };

  // 3. Start Timer (Logic)
  const startTimer = (id) => {
    let extraSeconds = 0;
    const newTasks = tasks.map(t => {
      if (t.id === id) {
        return { ...t, isActive: true, lastStart: Date.now() };
      }
      if (t.isActive) {
        extraSeconds = Math.floor((Date.now() - t.lastStart) / 1000);
        return { ...t, isActive: false, timeSpent: t.timeSpent + extraSeconds, lastStart: null };
      }
      return t;
    });

    // Update stats if switching from another task
    let newStats = dailyStats;
    let newXp = xp;
    if (extraSeconds > 0) {
      const today = new Date().toISOString().slice(0, 10);
      newStats = {
        ...dailyStats,
        [today]: (dailyStats[today] || 0) + extraSeconds
      };
      newXp = xp + extraSeconds;
      setDailyStats(newStats);
      setXp(newXp);
    }

    setTasks(newTasks);
    saveToCloud(newTasks, newStats, newXp);

    const started = newTasks.find(t => t.id === id);
    if (started) sendNotification("Start", "Spor la invatat: " + started.title);
  };

  // 4. Pause Timer (Logic)
  const pauseTimer = (id) => {
    let extraSeconds = 0;
    const newTasks = tasks.map(t => {
      if (t.id === id && t.isActive) {
        extraSeconds = Math.floor((Date.now() - t.lastStart) / 1000);
        return { ...t, isActive: false, timeSpent: t.timeSpent + extraSeconds, lastStart: null };
      }
      return t;
    });

    // Update stats and XP
    const today = new Date().toISOString().slice(0, 10);
    const newStats = {
      ...dailyStats,
      [today]: (dailyStats[today] || 0) + extraSeconds
    };
    const newXp = xp + extraSeconds;

    // Update all state
    setTasks(newTasks);
    setDailyStats(newStats);
    setXp(newXp);

    // Save everything to Firebase in one call
    saveToCloud(newTasks, newStats, newXp);
    sendNotification("Pauza", "Ai pus pauza.");
  };

  // Add Task
  const addTask = (t) => {
    const newTasks = [...tasks, t];
    setTasks(newTasks);
    saveToCloud(newTasks);
  };

  // Delete Task
  const deleteTask = (id) => {
    const newTasks = tasks.filter(t => t.id !== id);
    setTasks(newTasks);
    saveToCloud(newTasks);
  };

  // Update Status
  const updateStatus = (id, status) => {
    const newTasks = tasks.map(t => t.id === id ? { ...t, status } : t);
    setTasks(newTasks);
    saveToCloud(newTasks);
  };

  // --- RENDER ---

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Loading indicator removed to avoid blocking UI; app renders immediately.

  const activeSessionTask = tasks.find(t => t.id === activeSessionId);

  return (
    <div className="app-bg">
      {isFocusMode && activeSessionTask && (
        <FocusMode
          task={activeSessionTask}
          onPause={(id) => {
            pauseTimer(id);
            // Don't close focus mode on pause, just pause
          }}
          onExit={() => setIsFocusMode(false)}
        />
      )}

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold heading-gradient mb-1">StudyTrack</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Welcome back, <span className="text-indigo-500">{user}</span>! 👋
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLogout} className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">
              LOGOUT
            </button>
            <ThemeToggle />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <TotalStudy
            dailyStats={dailyStats}
            activeTaskId={activeSessionId}
            tasks={tasks}
            onPause={pauseTimer}
          />

          {/* Today's Progress Card */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/20 shadow-lg rounded-3xl p-6 flex flex-col justify-center items-center text-center">
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Today's Focus
            </div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white">
              {Math.floor((dailyStats[new Date().toISOString().slice(0, 10)] || 0) / 60)}
              <span className="text-lg font-medium text-slate-400 ml-1">min</span>
            </div>
            <div className="mt-3">
              <LevelDisplay xp={xp} />
            </div>
          </div>

          {/* Category Chart */}
          <div className="md:col-span-2 lg:col-span-1">
            <CategoryChart tasks={tasks} />
          </div>
        </div>

        {/* Settings (Only show if NOT in a session) */}
        {!activeSessionId && (
          <div className="card mb-8">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-indigo-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                Reminder Interval
              </label>
              <select
                value={reminderInterval}
                onChange={(e) => setReminderInterval(Number(e.target.value))}
                className="p-2 pl-4 pr-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer text-sm font-medium"
              >
                <option value={5 * 1000}>5 seconds</option>
                <option value={10 * 1000}>10 seconds</option>
                <option value={30 * 1000}>30 seconds</option>
                <option value={60 * 1000}>1 minute</option>
                <option value={5 * 60 * 1000}>5 minutes</option>
                <option value={15 * 60 * 1000}>15 minutes</option>
              </select>
            </div>
          </div>
        )}

        {/* Add + List (Only show if NOT in a session) */}
        {!activeSessionId && (
          <>
            <div className="mb-8">
              <AddTask onAdd={addTask} />
            </div>

            <div className="mb-8">
              <TaskList
                tasks={tasks}
                onDelete={deleteTask}
                onStatusChange={updateStatus}
                onStart={openSession}
                onPause={pauseTimer}
              />
            </div>
          </>
        )}

        {/* Study Dashboard (Persistent View) */}
        <div ref={timerRef} className="mt-6">
          {activeSessionId && activeSessionTask ? (
            <Timer
              task={activeSessionTask}
              onEnterFocus={() => setIsFocusMode(true)}
              onStart={startTimer}
              onPause={pauseTimer}
              onExit={closeSession}
            />
          ) : null}
        </div>

        {/* Chart */}
        <DailyChart dailyStats={dailyStats} />
      </div>
    </div>
  );
}
