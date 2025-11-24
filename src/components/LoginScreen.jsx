import { useState } from "react";

export default function LoginScreen({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const clean = username.trim().toLowerCase();
        if (clean.length > 2 && password.length > 0) {
            onLogin(clean, password);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center app-bg p-4">
            <div className="card max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="text-6xl mb-6">🚀</div>
                <h1 className="text-3xl font-extrabold mb-2 text-slate-900 dark:text-white">Welcome to StudyTrack</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Enter your username to sync your progress across devices.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Username (e.g. alex123)"
                        className="p-4 rounded-xl bg-slate-100 dark:bg-slate-700 border-none focus:ring-2 focus:ring-indigo-500 text-center text-lg font-bold"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="p-4 rounded-xl bg-slate-100 dark:bg-slate-700 border-none focus:ring-2 focus:ring-indigo-500 text-center text-lg font-bold"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary py-4 text-lg shadow-xl shadow-indigo-500/20"
                        disabled={username.trim().length < 3 || password.length < 1}
                    >
                        Start Journey
                    </button>
                </form>

                <div className="text-xs text-slate-400 mt-6 space-y-2">
                    <p className="flex items-center justify-center gap-1">
                        <span>🔒</span>
                        <span>Passwords secured with SHA-256 encryption</span>
                    </p>
                    <p className="text-[10px] leading-relaxed opacity-75">
                        Your password is hashed before storage - even the admin cannot see it.
                        Use a unique password for this study tracker.
                    </p>
                </div>
            </div>
        </div>
    );
}
