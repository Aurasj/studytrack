export default function TotalStudy({ dailyStats, activeTaskId, tasks, onPause }) {
  // scoatem toate secundele din dailyStats si le adunam
  const totalSec = Object.values(dailyStats).reduce((a, b) => a + b, 0);

  // convertim secundele in ore / minute / secunde
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  // verificam daca exista un task activ in momentul asta
  const activeTask = tasks.find(t => t.id === activeTaskId);

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-3xl shadow-xl shadow-indigo-500/20 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-black/10 rounded-full blur-xl"></div>

      <div className="relative z-10">
        <h2 className="text-sm font-semibold text-indigo-100 uppercase tracking-wider mb-1">Total Study Time</h2>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight">
            {hours}<span className="text-lg font-medium text-indigo-200">h</span>
          </span>
          <span className="text-4xl font-extrabold tracking-tight">
            {mins}<span className="text-lg font-medium text-indigo-200">m</span>
          </span>
        </div>

        <p className="text-xs text-indigo-100 mt-2 opacity-80">
          Keep pushing! Every second counts.
        </p>
      </div>
    </div>
  );
}
