import { Search } from "lucide-react";

export default function SearchInput() {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
                type="text"
                placeholder="Cari..."
                className="pl-10 pr-4 py-2 rounded-md border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-xs focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
        </div>
    );
}
