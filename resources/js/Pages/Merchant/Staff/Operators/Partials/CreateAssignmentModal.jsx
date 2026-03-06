import React, { useState, useEffect } from "react";
import Modal from "@/components/Common/Modal";
import Button from "@/components/Common/Button";
import Badge from "@/components/Common/Badge";
import DatePickerInput from "@/components/Common/DatePickerInput";
import ToggleSwitch from "@/components/Common/ToggleSwitch";
import LabelInput from "@/components/Common/LabelInput";
import CloseButtonModal from "@/components/Common/CloseButtonModal";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@/components/Common/Card";
import { formatFullDate, formatShortDate } from "@/utils/date";
import AssignmentForm from "./AssignmentForm";

export default function CreateAssignmentModal({
    show,
    onClose,
    venues,
    shifts,
    defaultVenueId,
    defaultSlot,
    title = "Tambah Penugasan",
    initialIsRange = false,
    onSave,
    isLoading = false,
}) {
    const [isRange, setIsRange] = useState(initialIsRange);
    const [internalSlot, setInternalSlot] = useState(
        initialIsRange ? { start: null, end: null } : []
    );
    const [internalVenueId, setInternalVenueId] = useState(defaultVenueId);
    const [internalShiftId, setInternalShiftId] = useState(null);

    // 🔄 Sync slot & venue setiap kali modal dibuka
    useEffect(() => {
        if (show) {
            if (defaultSlot) {
                const { start, end } = defaultSlot;
                const startDate = start?.toJSDate?.() || start;
                const endDate = end?.toJSDate?.() || end;

                const rangeMode =
                    startDate &&
                    endDate &&
                    startDate.toDateString() !== endDate.toDateString();

                setIsRange(rangeMode);
                setInternalSlot(
                    rangeMode
                        ? { start: startDate, end: endDate }
                        : startDate
                        ? [startDate]
                        : []
                );
            } else {
                setInternalSlot([]);
            }

            // venue default
            setInternalVenueId(defaultVenueId ?? venues[0]?.id ?? null);
            // shift default
            setInternalShiftId(shifts[0]?.id ?? null);
        }
    }, [show, defaultSlot, defaultVenueId, venues, shifts]);

    const handleModeChange = (checked) => {
        if (checked) {
            let start = null,
                end = null;
            if (Array.isArray(internalSlot) && internalSlot.length > 0) {
                start = internalSlot[0];
                end = internalSlot[internalSlot.length - 1];
            }
            setInternalSlot({ start, end });
        } else {
            if (internalSlot.start && internalSlot.end) {
                const arr = [];
                let current = new Date(internalSlot.start);
                while (current <= internalSlot.end) {
                    arr.push(new Date(current));
                    current.setDate(current.getDate() + 1);
                }
                setInternalSlot(arr);
            } else if (internalSlot.start) {
                setInternalSlot([internalSlot.start]);
            } else {
                setInternalSlot([]);
            }
        }
        setIsRange(checked);
    };

    const handleDateChange = (newSlot) => {
        if (isRange) {
            setInternalSlot({
                start: newSlot.start ? new Date(newSlot.start) : null,
                end: newSlot.end ? new Date(newSlot.end) : null,
            });
        } else {
            setInternalSlot(
                Array.isArray(newSlot) ? newSlot.map((d) => new Date(d)) : []
            );
        }
    };

    const renderDateInfo = () => {
        if (isRange && internalSlot.start && internalSlot.end) {
            return (
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span>Dari</span>
                    <Badge color="cyan" className="text-xs">
                        {formatFullDate(internalSlot.start, "d LLLL yyyy")}
                    </Badge>
                    <span>sampai</span>
                    <Badge color="cyan" className="text-xs">
                        {formatFullDate(internalSlot.end, "d LLLL yyyy")}
                    </Badge>
                </div>
            );
        } else if (
            !isRange &&
            Array.isArray(internalSlot) &&
            internalSlot.length > 0
        ) {
            return (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-sm text-gray-500">
                    {internalSlot.map((d, i) => (
                        <Badge key={i} color="cyan" className="text-xs">
                            {formatShortDate(d, "d LLL yyyy")}
                        </Badge>
                    ))}
                </div>
            );
        }
        return null;
    };

    const isSaveDisabled =
        isLoading ||
        (isRange
            ? !internalSlot.start || !internalSlot.end || !internalVenueId
            : internalSlot.length === 0 || !internalVenueId);

    return (
        <Modal
            show={show}
            onClose={onClose}
            maxWidth="md"
            overflow="visible"
            className="p-4"
        >
            <Card className="relative overflow-visible border-none shadow-none text-gray-700 dark:text-gray-100">
                <CloseButtonModal onClose={onClose} />
                <CardHeader className="border-none">
                    <div className="text-lg font-semibold my-2">{title}</div>
                </CardHeader>
                <CardBody>
                    <div className="mb-4 space-y-2">
                        <div className="mb-2 flex flex-row gap-2 items-center">
                            <LabelInput className="font-semibold">
                                Pilih Tanggal:
                            </LabelInput>
                            <ToggleSwitch
                                checked={isRange}
                                onChange={handleModeChange}
                                label={isRange ? "Rentang" : "Banyak"}
                                labelPosition="right"
                                size="md"
                            />
                        </div>

                        <DatePickerInput
                            value={internalSlot}
                            onChange={handleDateChange}
                            isRange={isRange}
                            isMultiple={!isRange}
                            numberOfMonths={isRange ? 2 : 1}
                            withDatePanel
                            withToolbar
                            layout="default"
                            calendarPosition="bottom"
                        />

                        {renderDateInfo()}
                    </div>

                    <AssignmentForm
                        venueId={internalVenueId}
                        onVenueChange={setInternalVenueId}
                        shiftId={internalShiftId}
                        onShiftChange={setInternalShiftId}
                        venues={venues}
                        shifts={shifts}
                    />
                </CardBody>

                <CardFooter className="p-4 border-none flex justify-end gap-2">
                    <Button
                        variant="primary"
                        onClick={() =>
                            onSave(
                                internalSlot,
                                internalVenueId,
                                internalShiftId
                            )
                        }
                        disabled={isSaveDisabled}
                    >
                        {isLoading ? "Menyimpan..." : "Simpan"}
                    </Button>
                    <Button
                        variant="light"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Batal
                    </Button>
                </CardFooter>
            </Card>
        </Modal>
    );
}
