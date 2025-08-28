import { useState, useEffect } from "react";
import Modal from "@/components/Common/Modal";
import CloseButtonModal from "@/components/common/CloseButtonModal";
import Button from "@/components/common/Button";
import Checkbox from "@/components/Common/Checkbox";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@/components/Common/Card";
import BannerAlert from "@/components/Common/BannerAlert";
import { Info, X } from "lucide-react";

export default function CreateOperatorToVenueModal({
    show,
    onClose,
    onSubmit,
    staff,
    venues = [],
    selectedVenues,
    setSelectedVenues,
}) {
    const [showBanner, setShowBanner] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [processing, setProcessing] = useState(false);

    // tampilkan banner jika belum ada venue yang dipilih
    useEffect(() => {
        if (selectedVenues.length === 0 && !dismissed) {
            setShowBanner(true);
        } else {
            setShowBanner(false);
        }
    }, [selectedVenues, dismissed]);

    useEffect(() => {
        if (!show) {
            setProcessing(false);
        }
    }, [show]);

    const handleToggle = (venueId) => {
        if (selectedVenues.includes(venueId)) {
            setSelectedVenues(selectedVenues.filter((id) => id !== venueId));
        } else {
            setSelectedVenues([...selectedVenues, venueId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedVenues.length === 0) return;
        setProcessing(true);
        await onSubmit(selectedVenues);
        setProcessing(false);
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md" className="p-4">
            <Card className="relative border-none shadow-none text-gray-700 dark:text-gray-100 ">
                <CloseButtonModal onClose={onClose} />
                <form onSubmit={handleSubmit}>
                    <CardHeader className="border-none">
                        <div className="text-lg font-semibold mt-2">
                            Pilih Venue untuk Penempatan {staff.name}
                        </div>
                    </CardHeader>

                    <CardBody>
                        {showBanner && (
                            <BannerAlert
                                type="warning"
                                className="py-3 flex flex-row justify-between items-center"
                            >
                                <div className="flex flex-row gap-2 items-center">
                                    <Info className="w-6" />
                                    Tambahkan{" "}
                                    <span className="font-bold">
                                        venue
                                    </span>{" "}
                                    untuk{" "}
                                    <span className="font-bold">
                                        {staff.name}
                                    </span>
                                    !
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setDismissed(true)}
                                >
                                    <X className="w-4 h-4 cursor-pointer hover:text-yellow-700 " />
                                </button>
                            </BannerAlert>
                        )}

                        <div className="space-y-2 mt-2">
                            {venues.map((venue) => (
                                <div
                                    key={venue.id}
                                    className="flex items-center gap-2"
                                >
                                    <Checkbox
                                        checked={selectedVenues.includes(
                                            venue.id
                                        )}
                                        onChange={() => handleToggle(venue.id)}
                                    />
                                    <span className="capitalize">
                                        {venue.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardBody>

                    <CardFooter className="p-4 border-none flex justify-end gap-2">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={processing || selectedVenues.length === 0}
                        >
                            Simpan
                        </Button>
                        <Button
                            variant="light"
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 text-sm"
                        >
                            Batal
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </Modal>
    );
}
