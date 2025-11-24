import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CATEGORIES } from "../constants";

export default function CategoryChart({ tasks }) {
    // Calculate total time per category
    const data = CATEGORIES.map(cat => {
        const totalMinutes = tasks
            .filter(t => t.category === cat.id)
            .reduce((acc, t) => acc + t.timeSpent, 0) / 60;

        return {
            name: cat.label,
            value: Math.floor(totalMinutes),
            color: cat.color
        };
    }).filter(d => d.value > 0); // Only show categories with data

    if (data.length === 0) {
        return (
            <div className="card h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                <div className="text-4xl mb-2">🍩</div>
                <p className="text-slate-500 dark:text-slate-400">No study data yet.</p>
            </div>
        );
    }

    return (
        <div className="card h-full">
            <h2 className="text-lg font-bold mb-2 text-slate-800 dark:text-white flex items-center gap-2">
                <span className="text-2xl">🍰</span> Study Distribution
            </h2>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                color: '#1e293b'
                            }}
                            formatter={(value) => `${value} min`}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
