import React from "react";
import { TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";

const StatCard = ({
    title = "Total Stat",
    value = "0",
    description = "Bulan ini",
    trend = null,
    trendType = "positive",
    Icon = MoreHorizontal,
    iconBgColor = "bg-primary-100 dark:bg-primary-700",
    iconColor = "text-primary-600 dark:text-primary-200",
    variant = "default",
}) => {
    const isPositive = trendType === "positive";
    const isMinimal = variant === "minimal";

    // Jika mode Minimal/Ramping
    if (isMinimal) {
        return (
            <div className="bg-white dark:bg-secondary-800 p-4 rounded-lg border border-secondary-100 dark:border-secondary-700 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
                <div
                    className={`p-2.5 rounded-lg ${iconBgColor} ${iconColor} shrink-0`}
                >
                    <Icon size={20} />
                </div>
                <div className="flex flex-col min-w-0">
                    <p className="text-[10px] font-bold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider truncate">
                        {title}
                    </p>
                    <h3 className="text-base font-bold text-secondary-900 dark:text-white leading-tight">
                        {value}
                    </h3>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-secondary-800 p-5 rounded-lg border border-secondary-200 dark:border-secondary-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${iconBgColor} ${iconColor}`}>
                    <Icon size={18} />
                </div>

                {trend && (
                    <div
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isPositive
                                ? "bg-emerald-50 dark:bg-emerald-300 text-emerald-600 dark:text-emerald-700"
                                : "bg-rose-50 text-rose-600"
                        }`}
                    >
                        {isPositive ? (
                            <TrendingUp size={14} />
                        ) : (
                            <TrendingDown size={14} />
                        )}
                        {trend}
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-xs font-medium text-secondary-500 dark:text-white uppercase tracking-wide">
                    {title}
                </p>
                <h3 className="text-base font-bold tracking-tight">{value}</h3>
            </div>

            <div className="mt-2 pt-2 border-t border-secondary-50 dark:border-secondary-700">
                <p className="text-xs text-secondary-400 dark:text-secondary-100">
                    <span
                        className={
                            isPositive
                                ? "text-emerald-500 dark:text-emerald-300 font-medium"
                                : "text-rose-500 font-medium"
                        }
                    >
                        {trend}
                    </span>{" "}
                    {description}
                </p>
            </div>
        </div>
    );
};

export default StatCard;
