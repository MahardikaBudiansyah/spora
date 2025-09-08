import InputLabel from "@/components/Common/LabelInput";
import Checkbox from "@/components/Common/Checkbox";

export default function FacilitySelector({
    facilities = [],
    value = [],
    onChange,
    errors,
}) {
    const toggleFacility = (facilityId) => {
        const newValue = value.includes(facilityId)
            ? value.filter((id) => id !== facilityId)
            : [...value, facilityId];

        onChange(newValue);
    };

    return (
        <div className="flex flex-col gap-2">
            <InputLabel value="Fasilitas Venue :" className="font-bold" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {facilities.map((facility) => (
                    <div key={facility.id} className="flex flex-row gap-2">
                        <label className="flex items-start gap-2 mt-1">
                            <Checkbox
                                checked={value.includes(facility.id)}
                                onChange={() => toggleFacility(facility.id)}
                            />
                        </label>
                        <div className="flex flex-col gap-1">
                            <img
                                src={`/assets/icons/facilities/${facility.icon}`}
                                alt={facility.name}
                                className="w-8 h-8 object-contain"
                                onError={(e) =>
                                    (e.target.style.display = "none")
                                }
                            />
                            <span className="text-xs font-semibold">
                                {facility.name}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {errors && <div className="text-red-500">{errors}</div>}
        </div>
    );
}
