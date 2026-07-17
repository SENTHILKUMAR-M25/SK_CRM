import { FiAlertTriangle } from 'react-icons/fi';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in p-6" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <FiAlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title || 'Confirm Delete'}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">{message || 'Are you sure you want to delete this?'}</p>
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="btn-danger">Delete</button>
        </div>
      </div>
    </div>
  );
}
