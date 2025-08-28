import { useRef } from "react";
import Modal from "@/components/Common/Modal";
import Button from "@/components/Common/Button";

export default function ConfirmModal({
    show,
    onClose,
    onConfirm,
    title = "Konfirmasi Tindakan",
    description = "Apakah Anda yakin ingin melanjutkan tindakan ini?",
    confirmText = "Ya, Lanjutkan",
    cancelText = "Batal",
    isProcessing = false,
}) {
    const cancelButtonRef = useRef();

    return (
        <Modal
            maxWidth="md"
            show={show}
            onClose={onClose}
            initialFocus={cancelButtonRef}
        >
            <div className="p-6">
                <h2
                    id="confirm-modal-title"
                    className="text-lg font-medium dark:text-white"
                >
                    {title}
                </h2>
                <p
                    id="confirm-modal-description"
                    className="mt-1 text-sm text-gray-600 dark:text-gray-400"
                >
                    {description}
                </p>

                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="primary"
                        onClick={onConfirm}
                        disabled={isProcessing}
                    >
                        {confirmText}
                    </Button>
                    <Button
                        type="button"
                        variant="light"
                        onClick={onClose}
                        ref={cancelButtonRef}
                    >
                        {cancelText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
