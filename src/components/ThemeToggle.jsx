import { useState, useEffect } from "react";

export default function ThemeToggle() {

    // salvam in state daca e dark mode sau nu
    // luam din localStorage tema salvata anterior
    const [dark, setDark] = useState(() =>
        localStorage.getItem("theme") === "dark"
  );

  // de fiecare data cand se schimba tema -> actualizam HTML si salvam in localStorage
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark"); // pune clasa .dark pe <html>
      localStorage.setItem("theme", "dark");            // salveaza tema aleasa
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]); // ruleaza cand se modifica 'dark'

  return (
    <button
      onClick={() => setDark(!dark)} // schimba intre light/dark
      className="px-4 py-2 rounded-xl mb-6 bg-gray-300 dark:bg-gray-700 dark:text-white"
    >
         {/* text diferit in functie de tema */}
      {dark ? "Light Mode ☀️" : "Dark Mode 🌙"}
    </button>
  );
}
