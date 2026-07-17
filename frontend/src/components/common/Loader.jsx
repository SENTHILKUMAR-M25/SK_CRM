export default function Loader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-700" />
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
      </div>
    </div>
  );
}
