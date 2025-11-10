export default function TotalStudy({ dailyStats }) {
  // total seconds studied across all days
  const totalSec = Object.values(dailyStats).reduce((a, b) => a + b, 0);

  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;

  return (
    <div className="mt-6 bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-200 p-5 rounded-2xl text-center shadow-md">
      <h2 className="text-xl font-bold mb-2">⏱️ Total Study Time</h2>

      <p className="text-lg font-semibold">
        {hours}h {mins}m {secs}s în total
      </p>
    </div>
  );
}
