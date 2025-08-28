export function Row({ label, value, highlight = false }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center">
            <span className="sm:w-1/3 font-medium text-gray-600">{label}</span>
            <span className="hidden sm:inline-block w-4 text-center text-gray-400">
                :
            </span>
            <span
                className={`flex-1 mt-1 sm:mt-0 ${
                    highlight ? "font-bold text-green-600" : "text-gray-800"
                }`}
            >
                {value}
            </span>
        </div>
    );
}
