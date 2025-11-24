import { useEffect, useState, useRef } from "react";

export default function Timer({ task, onEnterFocus, onStart, onPause, onExit }) {
  const [mode, setMode] = useState("stopwatch"); // 'stopwatch' | 'pomodoro'
  const [pomoStatus, setPomoStatus] = useState("work"); // 'work' | 'break'

  // Custom Settings State
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [showSettings, setShowSettings] = useState(false);

  const [timeLeft, setTimeLeft] = useState(workDuration * 60);

  // Local state for stopwatch display (synced with global task)
  const [seconds, setSeconds] = useState(task.timeSpent);
  const baseTimeRef = useRef(task.timeSpent);

  // --- Mode Switching Logic ---
  const handleModeSwitch = (newMode) => {
    if (mode === newMode) return;

    // If currently active, stop everything first
    if (task.isActive) {
      onPause(task.id);
    }

    setMode(newMode);

    // Reset Pomodoro timer when entering Pomodoro mode
    if (newMode === "pomodoro") {
      setTimeLeft(pomoStatus === "work" ? workDuration * 60 : breakDuration * 60);
    }
  };

  // --- Stopwatch Logic ---
  useEffect(() => {
    if (mode !== "stopwatch") return;
    setSeconds(task.timeSpent);
    baseTimeRef.current = task.timeSpent;
  }, [task.id, task.timeSpent, mode]);

  useEffect(() => {
    if (mode !== "stopwatch" || !task.isActive || !task.lastStart) return;
    const interval = setInterval(() => {
      const diff = Math.floor((Date.now() - task.lastStart) / 1000);
      setSeconds(baseTimeRef.current + diff);
    }, 1000);
    return () => clearInterval(interval);
  }, [task.id, task.isActive, task.lastStart, mode]);

  // --- Pomodoro Logic ---
  useEffect(() => {
    if (mode !== "pomodoro" || !task.isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer finished
          onPause(task.id);
          new Notification("Pomodoro", {
            body: pomoStatus === "work" ? "Time for a break! ☕" : "Back to work! 🚀"
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, task.isActive, pomoStatus]);

  // Update timer if settings change and timer is NOT running
  useEffect(() => {
    if (!task.isActive && mode === "pomodoro") {
      setTimeLeft(pomoStatus === "work" ? workDuration * 60 : breakDuration * 60);
    }
  }, [workDuration, breakDuration, pomoStatus, mode, task.isActive]);

  // Format Helpers
  const formatStopwatch = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}h ${m}m ${sec}s`;
  };

  const formatPomodoro = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // --- Controls ---
  const handleStart = () => onStart(task.id);
  const handlePause = () => onPause(task.id);

  const resetPomodoro = () => {
    if (task.isActive) onPause(task.id);
    setTimeLeft(pomoStatus === "work" ? workDuration * 60 : breakDuration * 60);
  };

  const switchPomoMode = (newStatus) => {
    if (task.isActive) onPause(task.id);
    setPomoStatus(newStatus);
    setTimeLeft(newStatus === "work" ? workDuration * 60 : breakDuration * 60);
  };

  return (
    <div
      id="studying-section"
      className={`
        relative p-8 rounded-3xl border shadow-2xl text-center backdrop-blur-xl transition-all duration-500 overflow-hidden
        ${mode === "pomodoro" && pomoStatus === "break"
          ? "bg-emerald-500/10 border-emerald-500/30"
          : "bg-white/80 dark:bg-slate-800/80 border-white/20"
        }
      `}
    >
      {/* Background Glow */}
      {task.isActive && (
        <div className={`absolute inset-0 blur-3xl opacity-20 pointer-events-none ${mode === "pomodoro" && pomoStatus === "break" ? "bg-emerald-500" : "bg-indigo-500"}`} />
      )}

      {/* Header: Title + Controls */}
      <div className="flex justify-between items-start mb-6 relative z-20">
        <div className="text-left">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Study Session
          </h2>
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
            {task.title}
          </div>
        </div>

        <div className="flex gap-2">
          {/* Settings Button (Only for Pomodoro) */}
          {mode === "pomodoro" && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-full transition-colors ${showSettings ? "bg-indigo-100 text-indigo-600" : "text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
              title="Timer Settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.43.816 1.056.816 1.734a2.25 2.25 0 01-.816 1.734" />
              </svg>
            </button>
          )}

          <button
            onClick={onExit}
            className="text-slate-400 hover:text-red-500 transition-colors p-2"
            title="Exit Session"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Settings Overlay */}
      {showSettings && mode === "pomodoro" && (
        <div className="absolute inset-0 z-30 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
          <h3 className="text-xl font-bold mb-6 text-slate-800 dark:text-white">Timer Settings</h3>

          <div className="w-full max-w-xs space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Work Duration (min)</label>
              <input
                type="number"
                value={workDuration}
                onChange={(e) => setWorkDuration(Number(e.target.value))}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-center font-bold text-lg"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Break Duration (min)</label>
              <input
                type="number"
                value={breakDuration}
                onChange={(e) => setBreakDuration(Number(e.target.value))}
                className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-center font-bold text-lg"
                min="1"
              />
            </div>
          </div>

          <button
            onClick={() => setShowSettings(false)}
            className="mt-8 btn btn-primary px-8 py-2"
          >
            Done
          </button>
        </div>
      )}

      {/* Mode Tabs */}
      <div className="relative z-10 flex justify-center gap-1 mb-8 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-full w-fit mx-auto">
        <button
          onClick={() => handleModeSwitch("stopwatch")}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === "stopwatch" ? "bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
        >
          ⏱ Stopwatch
        </button>
        <button
          onClick={() => handleModeSwitch("pomodoro")}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${mode === "pomodoro" ? "bg-white dark:bg-slate-600 text-indigo-600 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
        >
          🍅 Pomodoro
        </button>
      </div>

      <div className="relative z-10">

        {/* Timer Display */}
        <div className="py-2 mb-8">
          <p className="text-7xl md:text-9xl font-mono font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-800 to-slate-600 dark:from-white dark:to-slate-400 drop-shadow-sm tabular-nums">
            {mode === "stopwatch" ? formatStopwatch(seconds) : formatPomodoro(timeLeft)}
          </p>
          <p className="text-sm font-medium text-slate-400 mt-2">
            {mode === "stopwatch" ? "Total Time Elapsed" : (pomoStatus === "work" ? "Focus Interval" : "Break Interval")}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4">

          {/* Main Action Buttons */}
          <div className="flex gap-4">
            {!task.isActive ? (
              <button onClick={handleStart} className="btn btn-primary text-xl px-12 py-4 shadow-indigo-500/20 hover:scale-105 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
                Start
              </button>
            ) : (
              <button onClick={handlePause} className="btn btn-warning text-xl px-12 py-4 shadow-amber-500/20 hover:scale-105 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                </svg>
                Pause
              </button>
            )}
          </div>

          {/* Secondary Controls */}
          <div className="flex gap-3 mt-4 items-center">
            {mode === "stopwatch" ? (
              <button
                onClick={onEnterFocus}
                className="btn btn-secondary text-sm px-4 py-2 flex items-center gap-2"
              >
                🧘‍♂️ Focus Mode
              </button>
            ) : (
              <>
                <button onClick={resetPomodoro} className="btn btn-secondary text-sm px-4 py-2">
                  ↺ Reset
                </button>
                <div className="w-px h-6 bg-slate-300 dark:bg-slate-600 mx-2"></div>
                <button
                  onClick={() => switchPomoMode("work")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${pomoStatus === "work" ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Work
                </button>
                <button
                  onClick={() => switchPomoMode("break")}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${pomoStatus === "break" ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Break
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
