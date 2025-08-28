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

export default function CreateRoleModal({
    show,
    onClose,
    onSubmit,
    roles = [],
    selectedRoles,
    setSelectedRoles,
}) {
    const [showBanner, setShowBanner] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (selectedRoles.length === 0 && !dismissed) {
            setShowBanner(true);
        } else {
            setShowBanner(false);
        }
    }, [selectedRoles, dismissed]);

    useEffect(() => {
        if (!show) {
            setProcessing(false);
        }
    }, [show]);

    const handleToggle = (roleId) => {
        if (selectedRoles.includes(roleId)) {
            setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
        } else {
            setSelectedRoles([...selectedRoles, roleId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        await onSubmit(selectedRoles); // pastikan onSubmit return promise
        setProcessing(false);
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md" className="p-4">
            <Card className="relative border-none shadow-none text-gray-700 dark:text-gray-100 ">
                <CloseButtonModal onClose={onClose} />
                <form onSubmit={handleSubmit}>
                    <CardHeader className="border-none">
                        <div className="text-lg font-semibold mt-2">
                            Pilih Role untuk Merchant Anda
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
                                    Tambahkan
                                    <span className="font-bold">role</span>atau
                                    <span className="font-bold">
                                        posisi staf!
                                    </span>
                                </div>
                                <button onClick={() => setDismissed(true)}>
                                    <X className="w-4 h-4 cursor-pointer hover:text-yellow-700 " />
                                </button>
                            </BannerAlert>
                        )}
                        <div className="space-y-2">
                            {roles.map((role) => (
                                <div
                                    key={role.id}
                                    className="flex items-center gap-2"
                                >
                                    <Checkbox
                                        checked={selectedRoles.includes(
                                            Number(role.id)
                                        )}
                                        onChange={() =>
                                            handleToggle(Number(role.id))
                                        }
                                    />
                                    <span className="capitalize">
                                        {role.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                    <CardFooter className="p-4 border-none flex justify-end gap-2">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={processing || selectedRoles.length === 0}
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
