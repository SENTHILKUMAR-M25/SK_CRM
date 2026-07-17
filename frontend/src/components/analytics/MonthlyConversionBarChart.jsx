import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

const formatMonth = (m) => {
  if (!m) return '';
  const [y, mo] = m.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(mo) - 1]} ${y.slice(2)}`;
};

export default function MonthlyConversionBarChart({ data }) {
  const monthlyApproved = data?.monthlyApproved || [];
  const monthlyLeads = data?.monthlyLeads || [];

  const chartData = monthlyLeads.map((ld, i) => ({
    month: formatMonth(ld.month),
    Leads: ld.count,
    Approved: monthlyApproved[i]?.count || 0
  }));

  return (
    <ChartCard title="Monthly Conversions" subtitle="Approved leads by month">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Bar dataKey="Leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Approved" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-400 text-sm">No data available</div>
      )}
    </ChartCard>
  );
}
