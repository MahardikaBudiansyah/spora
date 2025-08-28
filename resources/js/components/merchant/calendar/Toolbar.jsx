import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/Common/Button";

const ToolbarComponent = ({
    label,
    onNavigate,
    onView,
    view,
    availableViews = ["month"], // default hanya "month"
}) => {
    return (
        <div className="flex flex-col gap-2">
            {availableViews.length > 1 && (
                <div className="flex justify-end">
                    {availableViews.map((v, idx, arr) => {
                        const isActive = view === v;
                        const isFirst = idx === 0;
                        const isLast = idx === arr.length - 1;

                        const roundedClass = isFirst
                            ? "rounded-s-md"
                            : isLast
                            ? "rounded-e-md"
                            : "rounded-none";

                        return (
                            <button
                                key={v}
                                onClick={() => onView(v)}
                                className={`px-3 py-2 border border-gray-300 font-semibold ${roundedClass} ${
                                    isActive
                                        ? "bg-primary-700 text-white"
                                        : "bg-white-100 text-gray-700 dark:text-white hover:bg-primary-700 hover:text-white"
                                }`}
                            >
                                {v === "month"
                                    ? "Bulan"
                                    : v === "week"
                                    ? "Minggu"
                                    : "Hari"}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="mb-4 flex justify-between gap-2 items-center">
                <div>
                    <Button
                        onClick={() => onNavigate("PREV")}
                        variant="primary"
                        className="px-3 py-2 border border-secondary-300 border-r-0 rounded-s-md rounded-e-none focus:ring-0"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        onClick={() => onNavigate("NEXT")}
                        variant="primary"
                        className="px-3 py-2 border border-secondary-300 border-l-0 rounded-e-md rounded-s-none focus:ring-0"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
                <div className="flex-1 text-center font-semibold">{label}</div>
                <Button
                    onClick={() => onNavigate("TODAY")}
                    variant="primary"
                    className="text-xs"
                >
                    Hari ini
                </Button>
            </div>
        </div>
    );
};

export default ToolbarComponent;
