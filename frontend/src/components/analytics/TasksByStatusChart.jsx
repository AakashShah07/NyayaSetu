import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = {
  not_started: '#94a3b8',
  in_progress: '#3b82f6',
  completed: '#10b981',
  overdue: '#ef4444',
  archived: '#6b7280',
};

export default function TasksByStatusChart({ byStatus }) {
  const data = Object.entries(byStatus).map(([name, value]) => ({ name: name.replace('_', ' '), value }));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name.replace(' ', '_')] || '#8884d8'} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
