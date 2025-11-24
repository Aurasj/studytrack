import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DailyChart({ dailyStats }) {
  //array cu ultimele 7 zile
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    //practic luam azi, ieri, alaltaieri... pana la 7 zile, in ordine corecta

    const key = d.toISOString().slice(0, 10); //format "YYYY-MM-DD"
    const label = key.slice(5); //afisam doar "MM-DD"

    //convertim secunde -> minute (afisam pe grafic)
    const minutes = Math.floor((dailyStats[key] || 0) / 60);

    return { day: label, minutes };
  });

  return (
    <div className="card mt-8">
      <h2 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
        <span className="text-2xl">📊</span> Last 7 Days Progress
      </h2>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={days}>
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}m`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
            />
            <Bar
              dataKey="minutes"
              fill="url(#colorGradient)"
              radius={[6, 6, 6, 6]}
              barSize={32}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
