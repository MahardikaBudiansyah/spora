import InputLabel from "@/components/Common/LabelInput";
import Checkbox from "@/components/Common/Checkbox";
import HelpTooltip from "@/components/Common/HelpTooltip";
import InputError from "@/components/common/ErrorInput";

export default function VenueFacilitySelector({
    facilities = [],
    value = [],
    onChange,
    errors,
}) {
    const safeValue = Array.isArray(value) ? value : [];

    const toggleFacility = (facilityId) => {
        const newValue = safeValue.includes(facilityId)
            ? safeValue.filter((id) => id !== facilityId)
            : [...safeValue, facilityId];

        onChange(newValue);
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <InputLabel value="Fasilitas Venue:" className="font-bold" />
                <HelpTooltip text="Pilih fasilitas venue yang disediakan." />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {facilities.map((facility) => (
                    <label
                        key={facility.id}
                        className="flex flex-row gap-2 cursor-pointer group p-2 border border-transparent hover:border-gray-200 rounded-lg transition-all"
                    >
                        <div className="flex items-start mt-1">
                            <Checkbox
                                checked={safeValue.includes(facility.id)}
                                onChange={() => toggleFacility(facility.id)}
                            />
                        </div>
                        <div className="flex flex-col gap-1 group-hover:opacity-80 transition-opacity">
                            <img
                                src={`/assets/icons/facilities/${facility.icon}`}
                                alt={facility.name}
                                className="w-8 h-8 object-contain"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                            <span className="text-xs font-semibold select-none">
                                {facility.name}
                            </span>
                        </div>
                    </label>
                ))}
            </div>
            <InputError message={errors} />
        </div>
    );
}
