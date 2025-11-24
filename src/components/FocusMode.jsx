import { useState, useEffect } from "react";

export default function FocusMode({ task, onPause, onExit }) {
    const [time, setTime] = useState(0);

    // Sync timer locally for smooth display
    useEffect(() => {
        if (!task.isActive) return;

        // Calculate initial time
        const initialTime = task.timeSpent + Math.floor((Date.now() - task.lastStart) / 1000);
        setTime(initialTime);

        const interval = setInterval(() => {
            const current = task.timeSpent + Math.floor((Date.now() - task.lastStart) / 1000);
            setTime(current);
        }, 1000);

        return () => clearInterval(interval);
    }, [task]);

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec < 10 ? "0" : ""}${sec}`;
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center animate-fade-in">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-5xl font-light mb-8 opacity-80 tracking-wider">
                    {task.title}
                </h2>

                <div className="text-9xl md:text-[12rem] font-bold font-mono tracking-tighter mb-12 tabular-nums">
                    {formatTime(time)}
                </div>

                <div className="flex gap-6 justify-center">
                    <button
                        onClick={() => onPause(task.id)}
                        className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full text-xl backdrop-blur-sm transition-all border border-white/10"
                    >
                        ⏸ Pause
                    </button>

                    <button
                        onClick={onExit}
                        className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-full text-xl shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105"
                    >
                        Exit Focus Mode 🏃‍♂️
                    </button>
                </div>
            </div>
        </div>
    );
}
