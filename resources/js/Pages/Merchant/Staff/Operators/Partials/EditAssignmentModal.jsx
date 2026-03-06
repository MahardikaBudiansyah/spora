import React, { useState, useEffect } from "react";
import Modal from "@/components/Common/Modal";
import Button from "@/components/Common/Button";
import Badge from "@/components/Common/Badge";
import DatePickerInput from "@/components/Common/DatePickerInput";
import LabelInput from "@/components/Common/LabelInput";
import CloseButtonModal from "@/components/Common/CloseButtonModal";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@/components/Common/Card";
import { formatFullDate } from "@/utils/date";
import AssignmentForm from "@/Pages/Merchant/Operator/Partials/AssignmentForm";

export default function EditAssignmentModal({
    show,
    onClose,
    venues,
    shifts,
    event, // ✅ cukup kirim 1 event object
    title = "Edit Penugasan",
    onSave,
    isLoading = false,
}) {
    const [internalDate, setInternalDate] = useState(null);
    const [internalVenueId, setInternalVenueId] = useState(null);
    const [internalShiftId, setInternalShiftId] = useState(null);

    useEffect(() => {
        if (show && event) {
            setInternalDate(
                event.start?.toJSDate
                    ? event.start.toJSDate()
                    : event.start || null
            );
            setInternalVenueId(event.venueId);
            setInternalShiftId(event.shiftId);
        } else if (!show) {
            setInternalDate(null);
            setInternalVenueId(null);
            setInternalShiftId(null);
        }
    }, [show, event]);

    const isSaveDisabled = isLoading || !internalDate || !internalVenueId;

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
                        <LabelInput className="font-semibold">
                            Tanggal:
                        </LabelInput>
                        <DatePickerInput
                            value={internalDate}
                            onChange={(d) => setInternalDate(d)}
                            isRange={false}
                            isMultiple={false}
                            numberOfMonths={1}
                            withToolbar
                            layout="default"
                            calendarPosition="bottom"
                        />
                        {internalDate && (
                            <Badge color="cyan" className="text-xs">
                                {formatFullDate(internalDate)}
                            </Badge>
                        )}
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
                            onSave({
                                id: event.id,
                                date: internalDate,
                                venueId: internalVenueId,
                                shiftId: internalShiftId,
                            })
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
