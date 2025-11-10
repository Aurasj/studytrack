export default function TaskItem({ task, onDelete, onStatusChange, onStart, onPause }) {
  //formatam timpul din secunde in "Xm Ys"
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <div
      id={`task-${task.id}`}
      //dam scroll la el din timer
      className={`flex items-center justify-between p-5 mb-4 rounded-2xl border shadow 
        ${task.isActive
          ? "bg-indigo-600/10 border-indigo-500/60"
          : "bg-white/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
        }`}
    >

      {/* left */}
      <div className="flex items-start gap-3">
        <div className="text-2xl">{task.isActive ? "🔥" : "📚"}</div>
        <div>
          <p className="font-semibold text-lg text-slate-900 dark:text-slate-100">{task.title}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{task.date}</p>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">⏱ {formatTime(task.timeSpent)}</p>
        </div>
      </div>

      {/* right */}
      <div className="flex flex-col items-end gap-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600"
        >
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
          <option value="canceled">Canceled</option>
        </select>

        {task.isActive ? (
          <button onClick={() => onPause(task.id)} className="btn btn-warning">⏸ Pause</button>
        ) : (
          <button onClick={() => onStart(task.id)} className="btn btn-success">▶ Start</button>
        )}

        <button onClick={() => onDelete(task.id)} className="btn btn-danger">🗑 Delete</button>
      </div>
    </div>
  );
}
