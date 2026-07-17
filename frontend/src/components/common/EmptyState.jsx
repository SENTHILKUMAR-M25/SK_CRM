import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ title = 'No data found', description = 'There are no records to display.', action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
        <FiInbox className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 dark:text-slate-500 mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  );
}
