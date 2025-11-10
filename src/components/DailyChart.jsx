import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DailyChart({ dailyStats }) {
  // Ultimele 7 zile
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); // ordonat cronologic

    const key = d.toISOString().slice(0, 10);
    const label = key.slice(5); // "MM-DD"

    const minutes = Math.floor((dailyStats[key] || 0) / 60);

    return { day: label, minutes };
  });

  return (
    <div className="w-full mt-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-700 dark:text-gray-200 text-center">
        Progres pe ultimele 7 zile 📊
      </h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={days}>
            <XAxis dataKey="day" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Bar dataKey="minutes" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
