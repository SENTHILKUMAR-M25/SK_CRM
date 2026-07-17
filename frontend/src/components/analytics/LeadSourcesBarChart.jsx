import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartCard from './ChartCard';

const SOURCE_COLORS = {
  'Website': '#3b82f6',
  'WhatsApp': '#25D366',
  'Referral': '#8b5cf6',
  'Facebook': '#1877F2',
  'Google': '#ea4335',
  'Direct': '#10b981',
  'Social Media': '#f59e0b',
  'Cold Call': '#f97316',
  'Email Campaign': '#06b6d4',
  'Walk-in': '#ec4899',
  'Other': '#64748b'
};

export default function LeadSourcesBarChart({ data }) {
  const chartData = (data || []).map(d => ({
    source: d.source,
    leads: d.count,
    fill: SOURCE_COLORS[d.source] || '#64748b'
  }));

  return (
    <ChartCard title="Lead Sources" subtitle="Leads by acquisition channel">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
            <YAxis type="category" dataKey="source" tick={{ fontSize: 11, fill: '#94a3b8' }} width={90} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px' }}
              formatter={(val) => [val.toLocaleString(), 'Leads']}
            />
            <Bar dataKey="leads" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-400 text-sm">No data available</div>
      )}
    </ChartCard>
  );
}
