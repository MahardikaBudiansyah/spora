import { tv } from "tailwind-variants";
import Badge from "@/components/Common/Badge";
import { twMerge } from "tailwind-merge";
import {
    getCourtCategory,
    getCourtSurface,
} from "@/utils/attributes/courtAttribute";
import { Star } from "lucide-react";

const courtInfo = tv({
    base: "space-y-4",
});

export default function CourtInfo({
    name,
    rating,
    description,
    court_surface,
    categories = [],
    showLabel = false,
    className,
}) {
    const surfaceData = getCourtSurface(court_surface);

    return (
        <div className={courtInfo({ class: className })}>
            <div className="text-4xl font-bold">{name}</div>
            <div className="flex flex-wrap flex-row md:items-center gap-2 text-gray-500">
                {rating && !isNaN(rating) && (
                    <div className="flex items-center gap-0.5">
                        <span className="text-yellow-500 font-medium">
                            {(Number(rating) || 0).toFixed(1)}{" "}
                        </span>
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    </div>
                )}
                <Badge color={surfaceData.color} variant="solid">
                    {surfaceData.label}
                </Badge>
            </div>
            {categories.length > 0 && (
                <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {categories?.map((cat, index) => {
                        const catAttr = getCourtCategory(cat.name);
                        return (
                            <Badge
                                key={index}
                                color={catAttr.color}
                                variant="solid"
                                className={`flex items-center gap-1 ${
                                    cat.is_primary == 1
                                        ? "font-bold"
                                        : "font-medium"
                                }`}
                            >
                                {cat.is_primary == 1 && (
                                    <Star size={12} className="fill-current" />
                                )}
                                {catAttr.label}
                            </Badge>
                        );
                    })}
                </div>
            )}

            {showLabel && (
                <div className="space-y-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold flex items-center gap-2 ">
                            <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                            Deskripsi
                        </h3>
                    </div>
                    <p
                        className={twMerge(
                            "leading-relaxed text-sm",
                            description
                                ? "text-secondary-600 dark:text-secondary-400"
                                : "text-secondary-400"
                        )}
                    >
                        {description || "Belum ada deskripsi"}
                    </p>
                </div>
            )}
        </div>
    );
}
