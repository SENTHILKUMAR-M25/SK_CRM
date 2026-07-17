import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

export default function ServicesHorizontalBar({ data }) {
  const chartData = (data || []).slice(0, 10).map(d => ({
    service: d.service.length > 20 ? d.service.slice(0, 20) + '...' : d.service,
    total: d.total,
    approved: d.approved
  }));

  return (
    <ChartCard title="Services Performance" subtitle="Number of leads per service">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
            <YAxis type="category" dataKey="service" tick={{ fontSize: 10, fill: '#94a3b8' }} width={120} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px' }}
              formatter={(val, name) => [val.toLocaleString(), name === 'total' ? 'Total Leads' : 'Approved']}
            />
            <Bar dataKey="total" fill="#3b82f6" radius={[0, 4, 4, 0]} name="total" />
            <Bar dataKey="approved" fill="#10b981" radius={[0, 4, 4, 0]} name="approved" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-400 text-sm">No data available</div>
      )}
    </ChartCard>
  );
}
