import { useState } from "react";
import TaskItem from "./TaskItem";

//lista cu toate task urile
export default function TaskList({ tasks, onDelete, onStatusChange, onStart, onPause }) {
  const [filter, setFilter] = useState("all");

  const filteredTasks = tasks.filter(t => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  const tabs = [
    { id: "all", label: "All" },
    { id: "upcoming", label: "Upcoming" },
    { id: "completed", label: "Completed" },
    { id: "overdue", label: "Overdue" },
    { id: "canceled", label: "Canceled" },
  ];

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200
                        ${filter === tab.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div className="text-center py-12 opacity-60">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No tasks found in this category.
          </p>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onStart={onStart}
            onPause={onPause}
          />
        ))}
      </div>
    </div>
  );
}
