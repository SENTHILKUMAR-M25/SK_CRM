import { useState, useEffect, useRef } from 'react';
import { FiMenu, FiSun, FiMoon, FiBell, FiX } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import { leadService } from '../../services/leadService';
import { formatDate } from '../../utils/formatters';
import { Link } from 'react-router-dom';

export default function Navbar({ onToggleSidebar, collapsed }) {
  const { dark, toggleDark } = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const [todayRes, overdueRes] = await Promise.all([
          leadService.getAll({ dateFrom: today, dateTo: today, status: 'Waiting', limit: 50 }),
          leadService.getAll({ status: 'Waiting', limit: 50 }),
        ]);

        const todayLeads = todayRes.data.leads || [];
        const allWaiting = overdueRes.data.leads || [];

        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const overdueLeads = allWaiting.filter(lead => {
          if (!lead.nextFollowUpDate) return false;
          const d = new Date(lead.nextFollowUpDate);
          d.setHours(0, 0, 0, 0);
          return d < now;
        });

        const upcoming = allWaiting.filter(lead => {
          if (!lead.nextFollowUpDate) return false;
          const d = new Date(lead.nextFollowUpDate);
          d.setHours(0, 0, 0, 0);
          return d > now;
        });

        const notifs = [
          ...todayLeads.map(l => ({
            id: `today-${l._id}`,
            type: 'today',
            message: `Today's follow-up: ${l.companyName}`,
            leadId: l._id,
            time: formatDate(l.nextFollowUpDate)
          })),
          ...overdueLeads.map(l => ({
            id: `overdue-${l._id}`,
            type: 'overdue',
            message: `Overdue follow-up: ${l.companyName}`,
            leadId: l._id,
            time: formatDate(l.nextFollowUpDate)
          })),
        ];

        setNotifications(notifs.slice(0, 20));
        setUnreadCount(notifs.length);
      } catch (error) {
        console.error('Notification fetch error:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={`fixed top-0 right-0 h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 z-30 flex items-center justify-between px-6 transition-all duration-300 ${
      collapsed ? 'left-16' : 'left-64'
    }`}>
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          {collapsed ? <FiMenu className="w-5 h-5" /> : <FiX className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleDark}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title={dark ? 'Light Mode' : 'Dark Mode'}
        >
          {dark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative"
          >
            <FiBell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 animate-fade-in max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-400">No notifications</div>
              ) : (
                notifications.map((n) => (
                  <Link
                    key={n.id}
                    to={`/leads/${n.leadId}`}
                    onClick={() => setShowNotifications(false)}
                    className={`flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700/50 ${
                      n.type === 'overdue' ? 'bg-red-50 dark:bg-red-900/10' : ''
                    }`}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      n.type === 'overdue' ? 'bg-red-500' : 'bg-primary-500'
                    }`} />
                    <div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{n.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
