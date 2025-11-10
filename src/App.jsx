import { useState, useEffect, useRef } from "react";
import AddTask from "./components/AddTask";
import TaskList from "./components/TaskList";
import Timer from "./components/Timer";
import ThemeToggle from "./components/ThemeToggle";
import DailyChart from "./components/DailyChart";
import TotalStudy from "./components/TotalStudy";

export default function App() {
  
  // incarcam toate taskurile salvate in localStorage
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  // taskul pe care il studiezi acum (null daca nu studiezi nimic)
  const [activeTaskId, setActiveTaskId] = useState(null);
  // intervalul ales pentru notificari
  const [reminderInterval, setReminderInterval] = useState(10 * 1000);
  const reminderRef = useRef(null); // ref pentru a tine intervalul de remindere
  const timerRef = useRef(null); // ref catre zona de "studying" ca sa putem face scroll la ea
  const lastStoppedTaskRef = useRef(null); // tine minte ce task am oprit ca sa ne intoarcem la el

  const sendNotification = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  };

  // salvam timpul studiat pe zile (folosit pentru grafice)
  const [dailyStats, setDailyStats] = useState(() => {
  const saved = localStorage.getItem("dailyStats");
  return saved ? JSON.parse(saved) : {};
  });

  // cand schimbam dailyStats il salvam in localStorage
  useEffect(() => {
  localStorage.setItem("dailyStats", JSON.stringify(dailyStats));
  }, [dailyStats]);

 // cerem permisiunea de notificari la prima pornire
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

 
  useEffect(() => localStorage.setItem("tasks", JSON.stringify(tasks)), [tasks]);

  
    // cand dai refresh: inchidem orice studiu ramas si salvam timpul corect
    useEffect(() => {
      setTasks(prev =>
        prev.map(t => {
          if (t.isActive && t.lastStart) {
            const extra = Math.floor((Date.now() - t.lastStart) / 1000);

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


  
  useEffect(() => {
    if (!activeTaskId) return;

    const current = tasks.find(t => t.id === activeTaskId);
    if (!current || !current.isActive) return;

    
    if (reminderRef.current) clearInterval(reminderRef.current);

    
    reminderRef.current = setInterval(() => {
      const check = tasks.find(t => t.id === activeTaskId);
      if (check && check.isActive) {
        sendNotification("Reminder", "Inca studiezi? Tine-o tot asa! 👊");
      } else {
        clearInterval(reminderRef.current);
        reminderRef.current = null;
      }
    }, reminderInterval);

    
    return () => {
      if (reminderRef.current) {
        clearInterval(reminderRef.current);
        reminderRef.current = null;
      }
    };

  }, [activeTaskId, tasks, reminderInterval]);

  // porneste un task; opreste pe cel activ daca exista altul
  // facem scroll automat la timer cand incepem sa studiem
  const startTask = (id) => {
    
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

        setTimeout(() => {
      timerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 100);

    const started = tasks.find(t => t.id === id);
    if (started) sendNotification("Start", "Ai inceput sa inveti la " + started.title);
  };

  // opreste taskul, calculeaza timpul, salveaza, reseteaza activeTaskId
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

  sendNotification("Pauza", "Ai pus pauza la sesiunea ta de studiu.");

  setActiveTaskId(null);
};

  // adauga secunde in statistica pe ziua curenta
  const addToDailyStats = (seconds) => {
  const today = new Date().toISOString().slice(0, 10); 

  setDailyStats(prev => ({
    ...prev,
    [today]: (prev[today] || 0) + seconds
  }));
  };

  // ascultam butonul din Timer; cand cere oprire, retinem ce task am oprit
    useEffect(() => {
  const handler = (e) => {
    const stoppedId = e.detail;  
    lastStoppedTaskRef.current = stoppedId;

    if (activeTaskId) pauseTask(activeTaskId);
  };

  window.addEventListener("pauseActiveTask", handler);
  return () => window.removeEventListener("pauseActiveTask", handler);
}, [activeTaskId]);

  // cand nu mai e niciun task activ: intoarce scrollul la cardul taskului oprit
  useEffect(() => {
    if (activeTaskId === null && lastStoppedTaskRef.current) {
      const el = document.getElementById(`task-${lastStoppedTaskRef.current}`);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
      lastStoppedTaskRef.current = null;
    }
  }, [activeTaskId]);

 return (
    <div className="app-bg">
      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-extrabold heading-gradient">StudyTrack</h1>
          <ThemeToggle />
        </div>

        {/* Settings card */}
        <div className="card mb-5">
          <label className="block font-semibold text-slate-700 dark:text-slate-200 mb-2">
            Reminder interval
          </label>
          <select
            value={reminderInterval}
            onChange={(e) => setReminderInterval(Number(e.target.value))}
            className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
          >
            <option value={5 * 1000}>5 secunde</option>
            <option value={10 * 1000}>10 secunde</option>
            <option value={30 * 1000}>30 secunde</option>
            <option value={60 * 1000}>1 minut</option>
            <option value={5 * 60 * 1000}>5 minute</option>
            <option value={15 * 60 * 1000}>15 minute</option>
          </select>
        </div>

        {/* Add + List */}
        <div className="card mb-5">
          <AddTask onAdd={(t) => setTasks(prev => [...prev, t])} />
        </div>

        <TaskList
          tasks={tasks}
          onDelete={id => setTasks(prev => prev.filter(t => t.id !== id))}
          onStatusChange={(id, status) =>
            setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
          }
          onStart={startTask}
          onPause={pauseTask}
        />

        {/* Active timer / Totals */}
        <div ref={timerRef}>
        {activeTaskId ? (
          <Timer task={tasks.find(t => t.id === activeTaskId)} />
        ) : (
          <TotalStudy 
            dailyStats={dailyStats}
            activeTaskId={activeTaskId}
            tasks={tasks}
            onPause={pauseTask}
          />

        )}
      </div>

        {/* Today */}
        <div className="card-muted mt-4 text-center">
          <p className="text-base font-semibold text-indigo-700 dark:text-indigo-300">
            Ai studiat azi:{" "}
            {Math.floor((dailyStats[new Date().toISOString().slice(0,10)] || 0) / 60)} minute
          </p>
        </div>

        {/* Chart */}
        <div className="card mt-5">
          <DailyChart dailyStats={dailyStats} />
        </div>
      </div>
    </div>
  );

}
