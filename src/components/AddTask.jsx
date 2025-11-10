import { useState } from "react";

export default function AddTask({ onAdd }) {
  const [title, setTitle] = useState("");

  //tinem minte ce scriem in input
  const handleAdd = () => {
    const clean = title.trim();
    //daca e gol nu adaugam nimic
    if (!clean) return;

    //task nou
    onAdd({
      id: crypto.randomUUID(), //id unic random
      title: clean, //numa task
      date: new Date().toLocaleString(), //data crearii
      status: "upcoming",
      timeSpent: 0,
      isActive: false,
      lastStart: null //n a fost pornit deloc
    });
    //golim inputul dupa ce adaugam
    setTitle("");
  };

  return (
    <div className="flex gap-3">
      <input
        className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600"
        placeholder="Adauga activitate..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <button onClick={handleAdd} className="btn btn-primary">Add</button>
    </div>
  );
}
