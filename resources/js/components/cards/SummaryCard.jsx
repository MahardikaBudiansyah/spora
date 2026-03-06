export default function SummaryCard({ title, icon, children }) {
    return (
        <div className="bg-white dark:bg-secondary-900 border border-gray-100 dark:border-secondary-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-50 dark:border-secondary-800">
                <div className="p-1.5 bg-primary-50 dark:bg-primary-800 rounded-lg text-primary-600 dark:text-white">
                    {icon}
                </div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-secondary-500 dark:text-secondary-400">
                    {title}
                </h3>
            </div>
            {children}
        </div>
    );
}
