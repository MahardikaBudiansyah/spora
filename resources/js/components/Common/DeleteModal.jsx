import { useRef, useState } from "react";
import Modal from "@/components/Common/Modal";
import Button from "@/components/Common/Button";
import Textarea from "@/components/Common/Textarea";
import LabelInput from "@/components/Common/LabelInput";

export default function DeleteModal({
    show,
    onClose,
    onConfirm,
    title = "Hapus Data",
    description = "Apakah Anda yakin ingin menghapus item ini?",
    confirmText = "Ya, Hapus",
    isProcessing = false,
    requireReason = false,
}) {
    const cancelButtonRef = useRef();
    const [reason, setReason] = useState("");
    const isReasonValid = !requireReason || reason.trim().length >= 10;

    const handleConfirm = () => {
        onConfirm({ reason });
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            initialFocus={cancelButtonRef}
            maxWidth="md"
        >
            <div className="p-6">
                <h2 className="text-lg font-medium dark:text-white">{title}</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {description}
                </p>

                {requireReason && (
                    <div className="mt-4 space-y-1">
                        <LabelInput value="Alasan (Opsional):" />

                        <Textarea
                            rows={3}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Tulis alasan penonaktifan... (Minimal 10 Karakater)"
                        />
                    </div>
                )}

                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        variant="light"
                        onClick={onClose}
                        ref={cancelButtonRef}
                        disabled={isProcessing}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleConfirm}
                        isLoading={isProcessing}
                        disabled={isProcessing || !isReasonValid}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
