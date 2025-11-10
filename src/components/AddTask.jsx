import { useState } from "react";

export default function AddTask({ onAdd }) {
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;

    onAdd({
      id: crypto.randomUUID(),
      title,
      status: "upcoming",
      date: new Date().toLocaleString(),
      timeSpent: 0,
      isActive: false,
      lastStart: null,
    });

    setTitle("");
  };

  return (
    <div className="flex gap-2 mb-4">
      <input
        className="flex-1 border p-3 rounded-xl dark:bg-gray-900 dark:text-white dark:border-gray-700"
        type="text"
        placeholder="Adaugă activitate..."
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button 
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700"
      >
        Add
      </button>
    </div>
  );
}
