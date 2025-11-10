import { useState, useEffect, useRef } from "react";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import Timer from "./components/Timer";
import ThemeToggle from "./components/ThemeToggle";
import DailyChart from "./components/DailyChart";
import TotalStudy from "./components/TotalStudy";

export default function App() {
  // TASKS
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTaskId, setActiveTaskId] = useState(null);


  // INTERVAL SELECTAT DE USER
  const [reminderInterval, setReminderInterval] = useState(10 * 1000);

  // INTERVALUL REAL DE REMINDER (ref → NU declanșează re-render)
  const reminderRef = useRef(null);

  // ✅ NOTIFICĂRI
  const sendNotification = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  const [dailyStats, setDailyStats] = useState(() => {
  const saved = localStorage.getItem("dailyStats");
  return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
  localStorage.setItem("dailyStats", JSON.stringify(dailyStats));
  }, [dailyStats]);


  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // ✅ Salvări
  useEffect(() => localStorage.setItem("tasks", JSON.stringify(tasks)), [tasks]);

  // ✅ LA REFRESH → oprim tot
  // ✅ LA REFRESH → oprim tot
    useEffect(() => {
      setTasks(prev =>
        prev.map(t => {
          if (t.isActive && t.lastStart) {
            const extra = Math.floor((Date.now() - t.lastStart) / 1000);

            // ✅ IMPORTANT: Salvăm și în dailyStats!
            addToDailyStats(extra);

            return { ...t, 
              timeSpent: t.timeSpent + extra, 
              isActive: false, 
              lastStart: null 
            };
          }
          return t;
        })
      );

      if (reminderRef.current) clearInterval(reminderRef.current);
      reminderRef.current = null;

      setActiveTaskId(null);
    }, []);


  // ✅ PORNEȘTE REMINDER-UL DUPĂ CE TASK-UL DEVINE ACTIV
  useEffect(() => {
    if (!activeTaskId) return;

    const current = tasks.find(t => t.id === activeTaskId);
    if (!current || !current.isActive) return;

    // 🔥 Oprim intervalul vechi
    if (reminderRef.current) clearInterval(reminderRef.current);

    // 🔥 Pornim unul nou
    reminderRef.current = setInterval(() => {
      const check = tasks.find(t => t.id === activeTaskId);
      if (check && check.isActive) {
        sendNotification("Reminder", "Încă studiezi? Ține-o tot așa! 👊");
      } else {
        clearInterval(reminderRef.current);
        reminderRef.current = null;
      }
    }, reminderInterval);

    // cleanup dacă schimbăm task-ul
    return () => {
      if (reminderRef.current) {
        clearInterval(reminderRef.current);
        reminderRef.current = null;
      }
    };

  }, [activeTaskId, tasks, reminderInterval]);

  // ✅ START TASK
  const startTask = (id) => {
    // Oprim reminderul vechi
    if (reminderRef.current) clearInterval(reminderRef.current);

    setTasks(prev =>
      prev.map(t => {
        if (t.id === id) {
          return { ...t, isActive: true, lastStart: Date.now() };
        }
        if (t.isActive) {
          const extra = Math.floor((Date.now() - t.lastStart) / 1000);
          addToDailyStats(extra);
          return { ...t, isActive: false, timeSpent: t.timeSpent + extra, lastStart: null };
        }
        return t;
      })
    );

    setActiveTaskId(id);

    // notificare de start
    const started = tasks.find(t => t.id === id);
    if (started) sendNotification("Start", "Ai început să înveți la " + started.title);
  };

  // ✅ PAUZĂ TASK
 const pauseTask = (id) => {
  if (reminderRef.current) clearInterval(reminderRef.current);

  setTasks(prev =>
    prev.map(t => {
      if (t.id === id && t.isActive) {
        const extra = Math.floor((Date.now() - t.lastStart) / 1000);
        addToDailyStats(extra);
        return { ...t, isActive: false, timeSpent: t.timeSpent + extra, lastStart: null };
      }
      return t;
    })
  );

  sendNotification("Pauză", "Ai pus pauză la sesiunea ta de studiu.");

  setActiveTaskId(null);
};


  const addToDailyStats = (seconds) => {
  const today = new Date().toISOString().slice(0, 10); // "2025-01-18"

  setDailyStats(prev => ({
    ...prev,
    [today]: (prev[today] || 0) + seconds
  }));
  };



 return (
  <div className="min-h-screen flex justify-center py-12 px-4">
    <div className="w-full max-w-2xl card">

      <h1 className="title-hero mb-8">StudyTrack 📘</h1>

      <div className="flex justify-between items-center mb-6">
        <ThemeToggle />
      </div>

      <div className="card mb-6">
        <label className="block font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Reminder interval:
        </label>

        <select
          value={reminderInterval}
          onChange={(e) => setReminderInterval(Number(e.target.value))}
          className="w-full p-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value={5 * 1000}>5 secunde</option>
          <option value={10 * 1000}>10 secunde</option>
          <option value={30 * 1000}>30 secunde</option>
          <option value={60 * 1000}>1 minut</option>
          <option value={5 * 60 * 1000}>5 minute</option>
        </select>
      </div>

      <AddTask onAdd={(t) => setTasks((prev) => [...prev, t])} />

      <TaskList 
        tasks={tasks}
        onDelete={id => setTasks(prev => prev.filter(t => t.id !== id))}
        onStatusChange={(id, status) =>
          setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
        }
        onStart={startTask}
        onPause={pauseTask}
      />

      {activeTaskId && (
        <div className="card mt-4">
          <Timer task={tasks.find(t => t.id === activeTaskId)} />
        </div>
      )}

      {!activeTaskId && (
        <div className="card mt-4">
          <TotalStudy dailyStats={dailyStats} />
        </div>
      )}

      <div className="card mt-4 text-center">
        <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
          Ai studiat azi:{" "}
          {Math.floor((dailyStats[new Date().toISOString().slice(0,10)] || 0) / 60)}
          {" "}minute
        </p>
      </div>

      <div className="card mt-6">
        <DailyChart dailyStats={dailyStats} />
      </div>

    </div>
  </div>
);

}
