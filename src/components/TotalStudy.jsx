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
    <div className="mt-6 bg-purple-600 text-white p-6 rounded-2xl text-center shadow-lg relative">

      <h2 className="text-2xl font-bold mb-2">⏱️ Total Study Time</h2>
      
        {/* total ore/minute/secunde din toate zilele */}
      <p className="text-lg font-semibold mb-4">
        {hours}h {mins}m {secs}s in total
      </p>

        {/* DACA este un task activ, ii afisam control-ele */}
      {activeTask && (
        <div className="mt-3">
          <p className="mb-2 text-sm opacity-90">
            📚 Inveti acum: <b>{activeTask.title}</b>
          </p>

            {/* Buton care duce cate cardul task-ului activ */}
          <button
            onClick={() => {
                const el = document.getElementById(`task-${activeTask.id}`);
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-yellow-400 text-black px-4 py-2 rounded-xl mr-3 shadow"
          >
            👀 Vezi Task-ul
          </button>

            {/* Buton pauza */}
          <button
            onClick={() => onPause(activeTask.id)}
            className="bg-red-500 text-white px-4 py-2 rounded-xl shadow"
          >
            ⏸ Opreste
          </button>
        </div>
      )}
    </div>
  );
}
