import React from 'react';

export default function LevelDisplay({ xp }) {
    // 1 Level = 3600 XP (1 hour)
    const XP_PER_LEVEL = 3600;

    const level = Math.floor(xp / XP_PER_LEVEL) + 1;
    const currentLevelXP = xp % XP_PER_LEVEL;
    const progressPercent = (currentLevelXP / XP_PER_LEVEL) * 100;

    const getTitle = (lvl) => {
        if (lvl >= 50) return "Grandmaster 👑";
        if (lvl >= 30) return "Sage 🧙‍♂️";
        if (lvl >= 20) return "Expert 🧠";
        if (lvl >= 10) return "Scholar 📜";
        if (lvl >= 5) return "Apprentice 🎒";
        return "Novice 🌱";
    };

    return (
        <div className="card mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-none shadow-lg transform hover:scale-[1.01] transition-transform">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        Level {level}
                        <span className="text-sm font-normal bg-white/20 px-2 py-0.5 rounded-full">
                            {getTitle(level)}
                        </span>
                    </h2>
                    <p className="text-indigo-100 text-sm">
                        Total XP: {xp.toLocaleString()}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold">{Math.floor(progressPercent)}%</p>
                    <p className="text-xs text-indigo-200">to Level {level + 1}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-black/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                <div
                    className="bg-white h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            <div className="flex justify-between mt-1 text-xs text-indigo-200 font-medium">
                <span>{currentLevelXP} XP</span>
                <span>{XP_PER_LEVEL} XP</span>
            </div>
        </div>
    );
}
