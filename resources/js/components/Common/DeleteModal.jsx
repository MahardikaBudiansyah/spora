import { useRef } from "react";
import Modal from "@/components/Common/Modal";
import Button from "@/components/Common/Button";

export default function DeleteModal({
    show,
    onClose,
    onDelete,
    title = "Hapus Data",
    description = "Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.",
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
                    id="delete-modal-title"
                    className="text-lg font-medium dark:text-white"
                >
                    {title}
                </h2>
                <p
                    id="delete-modal-description"
                    className="mt-1 text-sm text-gray-600 dark:text-gray-400"
                >
                    {description}
                </p>

                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="danger"
                        onClick={onDelete}
                        disabled={isProcessing}
                    >
                        Ya, Hapus
                    </Button>
                    <Button
                        type="button"
                        variant="light"
                        onClick={onClose}
                        ref={cancelButtonRef}
                    >
                        Batal
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
