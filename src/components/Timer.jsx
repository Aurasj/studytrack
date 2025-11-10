import { useEffect, useState, useRef } from "react";

export default function Timer({ task }) {
  // seconds = cat timp a trecut pana acum (in secunde)
  const [seconds, setSeconds] = useState(task.timeSpent);
    
  // ref folosit sa stim de unde pornim timerul cand apasam Start
  const baseTimeRef = useRef(task.timeSpent);

  // cand se schimba task-ul activ -> resetam timerul
  useEffect(() => {
    setSeconds(task.timeSpent); // pune timpul deja inregistrat
    baseTimeRef.current = task.timeSpent;
  }, [task.id, task.timeSpent]);

  // daca task-ul e activ -> pornim un interval care actualizeaza timerul
  useEffect(() => {
    // daca nu e activ, iesim
    if (!task.isActive || !task.lastStart) return;
    // porneste timerul la fiecare secunda
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - task.lastStart) / 1000);
      setSeconds(baseTimeRef.current + diff);
    }, 1000);
    // cand componenta dispare sau se schimba task-ul -> sterge intervalul
    return () => clearInterval(interval);
  }, [task.id, task.isActive, task.lastStart]);

  // transformam secunde -> ore, minute, secunde
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return (
    <div
      id="studying-section"   // id folosit pentru scroll automat
      className={`
        relative p-8 rounded-3xl border shadow-xl text-center
        transition-all duration-300 ease-out
        ${task.isActive
          ? "bg-indigo-600/10 border-indigo-500/60 shadow-indigo-500/30 animate-pulse-slow"
          : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
        }
      `}
    >
        {/* Glow animat cand task-ul este activ */}
      {task.isActive && (
        <div className="absolute inset-0 rounded-3xl bg-indigo-500/10 blur-xl pointer-events-none" />
      )}

      {/* Titlu + numele task-ului */}
    <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white">
        Studying:{" "}
        <span className="text-indigo-500 dark:text-indigo-300 font-extrabold drop-shadow-md">
          {task.title}
        </span>
    </h2>

      {/* Timpul afisat */}
    <p className="text-5xl font-mono font-bold tracking-wide text-indigo-600 dark:text-indigo-300 drop-shadow">
        {h}h {m}m {s}s
    </p>

    <button
        onClick={() => {
        window.dispatchEvent(
            new CustomEvent("pauseActiveTask", { detail: task.id })
            );
        }}
        className="mt-6 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/20"
        >
        ⛔ Opreste Studiul
    </button>

    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        🔥 Focus mode activ
    </p>
    </div>
  );
}
