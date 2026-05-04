import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ComplianceChart({ data }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis unit="%" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--color-surface, #fff)', border: '1px solid #e5e7eb' }}
          />
          <Legend />
          <Line type="monotone" dataKey="complianceRate" name="Compliance %" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
          <Line type="monotone" dataKey="overdue" name="Overdue" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
