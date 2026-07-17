import { useDashboard } from '../../hooks/useDashboard';
import StatCard from '../../components/dashboard/StatCard';
import RecentLeads from '../../components/dashboard/RecentLeads';
import RecentActivities from '../../components/dashboard/RecentActivities';
import LeadStatusChart from '../../components/dashboard/LeadStatusChart';
import MonthlyLeadsChart from '../../components/dashboard/MonthlyLeadsChart';
import FollowUpProgress from '../../components/dashboard/FollowUpProgress';
import Loader from '../../components/common/Loader';

export default function Dashboard() {
  const { data, loading } = useDashboard();

  if (loading) return <Loader />;

  const { stats, recentLeads, recentActivities, charts } = data || {};

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Overview of your sales pipeline</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Leads" value={stats?.totalLeads || 0} color="primary" icon="users" />
        <StatCard title="Waiting" value={stats?.waitingLeads || 0} color="amber" icon="clock" />
        <StatCard title="Approved" value={stats?.approvedLeads || 0} color="emerald" icon="check" />
        <StatCard title="Rejected" value={stats?.rejectedLeads || 0} color="red" icon="x" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Today's Follow-ups"
          value={stats?.todayFollowUps || 0}
          color="primary"
          icon="calendar"
          subtitle={stats?.todayFollowUps > 0 ? 'Due today' : 'No follow-ups today'}
        />
        <StatCard
          title="Overdue Follow-ups"
          value={stats?.overdueFollowUps || 0}
          color="red"
          icon="alert"
          subtitle={stats?.overdueFollowUps > 0 ? 'Requires immediate attention' : 'All up to date'}
          highlight={stats?.overdueFollowUps > 0}
        />
        <StatCard
          title="Upcoming Follow-ups"
          value={stats?.upcomingFollowUps || 0}
          color="blue"
          icon="clock"
          subtitle={stats?.upcomingFollowUps > 0 ? 'Scheduled ahead' : 'No upcoming'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadStatusChart data={charts?.statusStats} />
        <MonthlyLeadsChart data={charts?.monthlyLeads} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentLeads leads={recentLeads} />
        </div>
        <div>
          <FollowUpProgress
            today={stats?.todayFollowUps || 0}
            overdue={stats?.overdueFollowUps || 0}
            upcoming={stats?.upcomingFollowUps || 0}
            total={stats?.waitingLeads || 0}
          />
        </div>
      </div>

      <RecentActivities activities={recentActivities} />
    </div>
  );
}
