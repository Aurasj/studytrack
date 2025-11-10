import { useEffect, useState, useRef } from "react";

export default function Timer({ task }) {
  const [seconds, setSeconds] = useState(task.timeSpent);

  // ✅ Ref ca să țină mereu cea mai nouă valoare
  const baseTimeRef = useRef(task.timeSpent);

  // ✅ Când se schimbă task-ul → resetăm
  useEffect(() => {
    setSeconds(task.timeSpent);
    baseTimeRef.current = task.timeSpent;
  }, [task.id, task.timeSpent]);

  // ✅ Interval live fără să depindă de timeSpent
  useEffect(() => {
    if (!task.isActive || !task.lastStart) return;

    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - task.lastStart) / 1000);
      setSeconds(baseTimeRef.current + diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [task.id, task.isActive, task.lastStart]); // ✅ fără task.timeSpent aici!

  const formatFull = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  return (
    <div className="text-center">
  <h2 className="text-2xl font-bold mb-2 text-blue-600 dark:text-blue-300">
    Studying: {task.title}
  </h2>

  <p className="text-4xl font-mono font-bold text-gray-900 dark:text-white drop-shadow-sm">
    {formatFull(seconds)}
  </p>
</div>
  );
}
