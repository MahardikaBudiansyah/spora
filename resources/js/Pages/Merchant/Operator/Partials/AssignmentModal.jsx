import React, { useState, useEffect } from "react";
import Modal from "@/components/Common/Modal";
import Button from "@/components/Common/Button";
import SelectInput from "@/components/Common/SelectInput";
import DatePickerInput from "@/components/Common/DatePickerInput";
import { formatCustom } from "@/utils/date";

export default function AssignmentModal({
    show,
    onClose,
    venues,
    modalVenueId,
    setModalVenueId,
    modalSlot,
    setModalSlot,
    onSave,
    title,
    initialIsRange = false, // prop untuk default mode
}) {
    const [isRange, setIsRange] = useState(initialIsRange);

    const venueOptions = venues.map((v) => ({ value: v.id, label: v.name }));

    // Sync jika prop initialIsRange berubah
    useEffect(() => {
        setIsRange(initialIsRange);
    }, [initialIsRange]);

    // Reset modalSlot ketika mode range/single berubah
    useEffect(() => {
        if (isRange && (!modalSlot || !modalSlot.start || !modalSlot.end)) {
            setModalSlot({ start: null, end: null });
        } else if (!isRange && (!modalSlot || !modalSlot.start)) {
            setModalSlot(modalSlot?.start || null);
        }
    }, [isRange]);

    const renderDateInfo = () => {
        if (!modalSlot) return null;
        const startDate = isRange
            ? modalSlot?.start
            : modalSlot instanceof Date
            ? modalSlot
            : modalSlot?.start;
        const endDate = isRange ? modalSlot?.end : null;
        if (!startDate) return null;

        return isRange && endDate ? (
            <div className="mt-1 text-sm text-gray-500">
                Dari {formatCustom(startDate, "dd/MM/yyyy")} sampai{" "}
                {formatCustom(endDate, "dd/MM/yyyy")}
            </div>
        ) : (
            <div className="mt-1 text-sm text-gray-500">
                Tanggal: {formatCustom(startDate, "dd/MM/yyyy")}
            </div>
        );
    };

    const isSaveDisabled = isRange
        ? !modalSlot?.start || !modalSlot?.end || !modalVenueId
        : !modalSlot || !modalVenueId;

    return (
        <Modal
            show={show}
            onClose={onClose}
            maxWidth="md"
            className="overflow-visible"
        >
            <div className="p-4">
                <h2 className="font-bold text-lg mb-4">{title}</h2>

                {/* Toggle Single / Range */}
                <div className="flex items-center mb-4 gap-3">
                    <span className="font-semibold">Mode Tanggal:</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={isRange}
                            onChange={(e) => setIsRange(e.target.checked)}
                        />
                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-primary-500 transition-colors"></div>
                        <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            {isRange ? "Range" : "Single"}
                        </span>
                    </label>
                </div>

                {/* DatePickerInput */}
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">
                        Pilih Tanggal:
                    </label>
                    <DatePickerInput
                        value={modalSlot}
                        onChange={setModalSlot}
                        selectRange={isRange}
                        mobileMode="icon"
                    />
                    {renderDateInfo()}
                </div>

                {/* Venue */}
                <div className="mb-4">
                    <label className="block mb-2 font-semibold">
                        Pilih Venue:
                    </label>
                    <SelectInput
                        value={modalVenueId}
                        onChange={setModalVenueId}
                        options={venueOptions}
                        placeholder="Pilih venue..."
                        isClearable={false}
                    />
                </div>

                {/* Actions */}
                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="light" onClick={onClose}>
                        Batal
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onSave}
                        disabled={isSaveDisabled}
                    >
                        Simpan
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
