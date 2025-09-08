import React from "react";
import SelectInput from "@/components/Common/SelectInput";
import LabelInput from "@/components/Common/LabelInput";

export default function AssignmentForm({
    venueId,
    onVenueChange,
    shiftId,
    onShiftChange,
    venues,
    shifts,
}) {
    const venueOptions = (venues || []).map((v) => ({
        value: v.id,
        label: v.name,
    }));
    const shiftOptions = (shifts || []).map((s) => ({
        value: s.id,
        label: `${s.name} (${s.startHour ?? "-"}:00 - ${s.endHour ?? "-"}:00)`,
    }));

    return (
        <>
            <div className="mb-4">
                <LabelInput className="block mb-2 font-semibold">
                    Pilih Venue:
                </LabelInput>
                <SelectInput
                    value={venueId}
                    onChange={onVenueChange}
                    options={venueOptions}
                    placeholder="Pilih venue..."
                    isClearable={false}
                    isSearchable={false}
                    isDisabled={venueOptions.length === 0}
                />
            </div>

            <div className="mb-4">
                <LabelInput className="block mb-2 font-semibold">
                    Pilih Shift:
                </LabelInput>
                <SelectInput
                    value={shiftId}
                    onChange={onShiftChange}
                    options={shiftOptions}
                    placeholder="Pilih shift..."
                    isClearable={false}
                    isSearchable={false}
                />
            </div>
        </>
    );
}
