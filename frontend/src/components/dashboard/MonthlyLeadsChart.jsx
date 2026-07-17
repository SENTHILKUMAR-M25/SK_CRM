import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function MonthlyLeadsChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = data.map(item => ({
    month: item._id,
    leads: item.count,
  }));

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Monthly Leads</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickFormatter={(val) => {
                const [y, m] = val.split('-');
                const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                return `${months[parseInt(m) - 1]} ${y.slice(2)}`;
              }}
            />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{
                background: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
              labelFormatter={(val) => {
                const [y, m] = val.split('-');
                const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                return `${months[parseInt(m) - 1]} ${y}`;
              }}
            />
            <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
