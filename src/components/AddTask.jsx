import { useState } from "react";
import { CATEGORIES } from "../constants";

export default function AddTask({ onAdd }) {
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[5].id); // Default to 'other'

  //tinem minte ce scriem in input
  const handleAdd = () => {
    const clean = title.trim();
    //daca e gol nu adaugam nimic
    if (!clean) return;

    const dateInput = document.getElementById("dueDateInput");
    const dueDate = dateInput ? dateInput.value : null;

    //task nou
    onAdd({
      id: crypto.randomUUID(), //id unic random
      title: clean, //numa task
      category: selectedCategory, // categorie
      date: new Date().toLocaleString(), //data crearii
      dueDate: dueDate, // data limita
      status: "upcoming",
      timeSpent: 0,
      isActive: false,
      lastStart: null //n a fost pornit deloc
    });

    if (dateInput) dateInput.value = ""; // reset date input
    //golim inputul dupa ce adaugam
    setTitle("");
    setSelectedCategory(CATEGORIES[5].id);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          className="flex-1 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
          placeholder="Add a new activity..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <input
          type="datetime-local"
          className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
          id="dueDateInput"
        />
        <button
          onClick={handleAdd}
          className="btn btn-primary px-6 shadow-lg shadow-indigo-500/30"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      {/* Category Selection */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${selectedCategory === cat.id
                ? "bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900 dark:border-white scale-105 shadow-md"
                : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
}
