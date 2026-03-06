import { useRef, useState, useEffect } from "react";
import Modal from "@/components/Common/Modal";
import Button from "@/components/Common/Button";
import Textarea from "@/components/Common/Textarea";
import LabelInput from "@/components/Common/LabelInput";
export default function ConfirmModal({
    show,
    onClose,
    maxWidth = "md",
    onConfirm,
    onReject,
    title = "Konfirmasi Tindakan",
    description = "Apakah Anda yakin ingin melanjutkan tindakan ini?",
    confirmText = "Ya, Lanjutkan",
    rejectText = "Tolak",
    cancelText = "Batal",
    isProcessing = false,
    requireReason = false,
    reasonLabel = "Catatan:",
    reasonPlaceholder = "Tulis catatan verifikasi di sini...",
    rejectHint = "* Wajib isi alasan untuk melakukan penolakan.",
    validateReject,
    children,
}) {
    const cancelButtonRef = useRef();
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (!show) setReason("");
    }, [show]);

    const isRejectDisabled = validateReject ? validateReject(reason) : false;

    return (
        <Modal
            maxWidth={maxWidth}
            show={show}
            onClose={onClose}
            initialFocus={cancelButtonRef}
        >
            <div className="p-6">
                <h2 className="text-lg font-medium dark:text-white">{title}</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {description}
                </p>

                <div className="mt-4 space-y-1">
                    {requireReason && (
                        <div className="space-y-1">
                            <LabelInput value={reasonLabel} />
                            <Textarea
                                rows={3}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder={reasonPlaceholder}
                            />
                        </div>
                    )}

                    {onReject && isRejectDisabled && rejectHint && (
                        <div className="min-h-[1.25rem]">
                            <p className="text-[10px] text-red-500 italic">
                                {rejectHint}
                            </p>
                        </div>
                    )}

                    {children}
                </div>

                <div className="mt-6 flex flex-row justify-end items-center gap-2">
                    <Button
                        variant="primary"
                        onClick={() => onConfirm({ reason })}
                        isLoading={isProcessing}
                        disabled={isProcessing}
                    >
                        {confirmText}
                    </Button>

                    {onReject && (
                        <Button
                            variant="danger"
                            onClick={() => onReject({ reason })}
                            isLoading={isProcessing}
                            disabled={isProcessing || isRejectDisabled}
                        >
                            {rejectText}
                        </Button>
                    )}

                    <Button
                        variant="light"
                        onClick={onClose}
                        ref={cancelButtonRef}
                        disabled={isProcessing}
                    >
                        {cancelText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
