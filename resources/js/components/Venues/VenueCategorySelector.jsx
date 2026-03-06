import InputLabel from "@/components/Common/LabelInput";
import Checkbox from "@/components/Common/Checkbox";
import HelpTooltip from "@/components/Common/HelpTooltip";
import InputError from "@/components/common/ErrorInput";

export default function VenueCategorySelector({
    venue_categories = [],
    value = [],
    onChange,
    errors,
}) {
    const safeValue = Array.isArray(value) ? value : [];

    const toggleVenueCategory = (venueCategoryId) => {
        const newValue = safeValue.includes(venueCategoryId)
            ? safeValue.filter((id) => id !== venueCategoryId)
            : [...safeValue, venueCategoryId];

        onChange(newValue);
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <InputLabel value="Kategori Venue:" className="font-bold" />
                <HelpTooltip text="Pilih beberapa kategori venue sesuai kriteria." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {venue_categories.map((category) => (
                    <label
                        key={category.id}
                        className="flex flex-row items-center gap-2 cursor-pointer rounded transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 p-1"
                    >
                        <Checkbox
                            checked={safeValue.includes(category.id)}
                            onChange={() => toggleVenueCategory(category.id)}
                        />
                        <span className="text-sm select-none">
                            {category.label}
                        </span>
                    </label>
                ))}
            </div>
            <InputError message={errors} />
        </div>
    );
}
