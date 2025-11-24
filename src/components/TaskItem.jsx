import { CATEGORIES } from "../constants";

export default function TaskItem({ task, onDelete, onStatusChange, onStart, onPause }) {
  //formatam timpul din secunde in "Xm Ys"
  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  const isOverdue = task.status === "overdue";
  const isCompleted = task.status === "completed";
  const isCanceled = task.status === "canceled";

  // Find category object or default to 'other'
  const category = CATEGORIES.find(c => c.id === task.category) || CATEGORIES[5];

  let borderClass = "border-slate-200 dark:border-slate-700";
  if (task.isActive) borderClass = "border-indigo-500/60";
  else if (isOverdue) borderClass = "border-red-500/50 bg-red-50 dark:bg-red-900/10";
  else if (isCompleted) borderClass = "border-green-500/50 bg-green-50 dark:bg-green-900/10";
  else if (isCanceled) borderClass = "border-gray-300 bg-gray-100 dark:bg-gray-800/50 opacity-75";

  return (
    <div
      id={`task-${task.id}`}
      //dam scroll la el din timer
      className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 mb-4 rounded-2xl border shadow transition-all ${borderClass} ${task.isActive ? "bg-indigo-600/10" : "bg-white/70 dark:bg-slate-800/60"}`}
    >

      {/* left */}
      <div className="flex items-start gap-3 mb-4 sm:mb-0">
        <div className="text-2xl">{task.isActive ? "🔥" : (isCompleted ? "✅" : (isOverdue ? "⚠️" : category.icon))}</div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: category.color }}
            >
              {category.label}
            </span>
          </div>
          <p className={`font-semibold text-lg ${isCompleted || isCanceled ? "line-through text-slate-500" : "text-slate-900 dark:text-slate-100"}`}>
            {task.title}
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span>📅 {task.date}</span>
            {task.dueDate && (
              <span className={isOverdue ? "text-red-600 font-bold" : "text-indigo-600 dark:text-indigo-400"}>
                ⏰ Due: {new Date(task.dueDate).toLocaleString()}
              </span>
            )}
          </div>
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

        <div className="flex gap-2">
          {task.isActive ? (
            <button onClick={() => onPause(task.id)} className="btn btn-warning">⏸ Pause</button>
          ) : (
            <button
              onClick={() => onStart(task.id)}
              className="btn btn-success"
              disabled={isCompleted || isCanceled || isOverdue}
            >
              ▶ Start
            </button>
          )}

          <button onClick={() => onDelete(task.id)} className="btn btn-danger">🗑 Delete</button>
        </div>
      </div>
    </div>
  );
}
