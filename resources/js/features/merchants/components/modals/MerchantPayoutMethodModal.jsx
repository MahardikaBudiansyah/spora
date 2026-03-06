import React, { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";
import Modal from "@/components/Common/Modal";
import MerchantPayoutForm from "@/features/merchants/components/forms/MerchantPayoutMethodForm";

import { toast } from "react-toastify";
import ConfirmModal from "@/components/Common/ConfirmModal";

export default function MerchantPayoutMethodModal({
    show,
    onClose,
    merchant,
    payout,
    ...props
}) {
    const isEditMode = !!payout;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, put, transform, processing, errors, reset } =
        useForm({
            type: "bank",
            provider_name: "",
            account_number: "",
            account_holder_name: "",
        });

    useEffect(() => {
        if (show && isEditMode && payout) {
            setData({
                type: payout.type || "bank",
                provider_name: payout.provider_name || "",
                account_number: payout.account_number || "",
                account_holder_name: payout.account_holder_name || "",
            });
        } else if (show && !isEditMode) {
            reset();
        }
    }, [show, payout, isEditMode]);

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.error("Server Errors:", errors);

            if (errors.message) {
                toast.error(errors.message);
            } else {
                const firstError = Object.values(errors)[0];
                toast.error(firstError || "Terjadi kesalahan pada data.");
            }
        }
    }, [errors]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditMode) {
            put(route("merchant.payouts.update", payout.id), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data Rekening diperbarui!");
                    onClose();
                },
            });
        } else {
            post(route("merchant.payouts.store"), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data Rekening disimpan!");
                    onClose();
                },
            });
        }
    };

    const handleDiscardDraft = () => {
        router.delete(route("merchant.payouts.discard", payout.id), {
            onSuccess: () => {
                setIsModalOpen(false);
                onClose();
                toast.success("Draf perubahan rekening berhasil dihapus.");
            },
            onError: () => {
                setIsModalOpen(false);
                toast.error("Gagal menghapus draf perubahan.");
            },
        });
    };
    return (
        <Modal
            show={show}
            onClose={onClose}
            maxWidth="3xl"
            className="p-4 w-full"
        >
            <MerchantPayoutForm
                merchant={merchant}
                payout={payout}
                isEditMode={isEditMode}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                onOpenDiscard={() => setIsModalOpen(true)}
                onClose={onClose}
            />
            <ConfirmModal
                show={isModalOpen}
                title="Batalkan Perubahan Data (Reset)"
                description={
                    <div className="flex flex-col gap-2">
                        <span>
                            Apakah Anda ingin yakin membatalkan perubahan data
                            {payout?.provider_name}?
                        </span>
                        <span>
                            Draf perubahan akan dihapus dan data akan
                            dikembalikan ke informasi awal yang sudah
                            terverifikasi. Tindakan ini tidak dapat dibatalkan
                        </span>
                    </div>
                }
                confirmText="Ya, Batalkan"
                onConfirm={handleDiscardDraft}
                onClose={() => setIsModalOpen(false)}
                isProcessing={processing}
            />
        </Modal>
    );
}
