export default function TaskItem({ task, onDelete, onStatusChange, onStart, onPause }) {

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}m ${sec}s`;
  };

  return (
    <div className="card flex justify-between items-center mb-4">

      {/* LEFT SIDE */}
      <div className="flex items-start gap-4">

        <div className="text-3xl">
          {task.isActive ? "🔥" : "📚"}
        </div>

        <div>
          <p className="font-semibold text-lg text-gray-900 dark:text-gray-100">
            {task.title}
          </p>

          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {task.date}
          </p>

          <p className="text-gray-700 dark:text-gray-300 text-sm mt-2">
            ⏱ {formatTime(task.timeSpent)}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE BUTTONS */}
      <div className="flex flex-col items-end gap-2">

        <select
          className="p-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600"
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
        >
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
          <option value="canceled">Canceled</option>
        </select>

        {task.isActive ? (
          <button 
            onClick={() => onPause(task.id)}
            className="btn bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            ⏸ Pauză
          </button>
        ) : (
          <button 
            onClick={() => onStart(task.id)}
            className="btn bg-green-600 hover:bg-green-700 text-white"
          >
            ▶️ Start
          </button>
        )}

        <button 
          onClick={() => onDelete(task.id)}
          className="btn bg-red-600 hover:bg-red-700 text-white"
        >
          🗑 Delete
        </button>

      </div>
    </div>
  );
}
