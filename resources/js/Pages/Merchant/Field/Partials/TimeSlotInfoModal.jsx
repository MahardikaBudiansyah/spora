import { DateTime } from "luxon";
import Modal from "@/components/common/Modal";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";

export default function TimeSlotInfoModal({ show, onClose, slot }) {
    if (!slot) return null;

    const { id, time, status, field_name, order, notes } = slot;

    const statusColorMap = {
        available: "green",
        booked: "blue",
        event: "yellow",
        maintenance: "red",
    };

    const statusColor = statusColorMap[status] || "gray";

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6 space-y-4 dark:text-secondary-100">
                <h2 className="text-lg font-semibold">Informasi Slot</h2>

                <div>
                    <span className="text-sm text-muted-foreground">Jam</span>
                    <div className="text-base font-medium">
                        {DateTime.fromISO(time).toFormat("HH:mm")} WIB
                    </div>
                </div>

                <div>
                    <span className="text-sm text-muted-foreground">
                        Lapangan
                    </span>
                    <div>{field_name}</div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Status
                    </span>
                    <Badge color={statusColor} className="capitalize">
                        {status}
                    </Badge>
                </div>

                {order && (
                    <div>
                        <span className="text-sm text-muted-foreground">
                            Pemesan
                        </span>
                        <div className="font-medium">{order.customer_name}</div>
                    </div>
                )}

                {notes && (
                    <div>
                        <span className="text-sm text-muted-foreground">
                            Catatan
                        </span>
                        <div className="text-sm text-gray-700">{notes}</div>
                    </div>
                )}

                <div className="pt-4 flex justify-between">
                    <Button variant="light" onClick={onClose}>
                        Tutup
                    </Button>
                    <Button
                        as="a"
                        href={`/merchant/fields/slug/slots/${id}`}
                        variant="secondary"
                    >
                        Lihat Detail
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
