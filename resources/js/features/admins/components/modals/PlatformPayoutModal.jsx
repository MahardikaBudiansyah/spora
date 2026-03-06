import React, { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";
import Modal from "@/components/Common/Modal";
import PlatformPayoutForm from "@/features/admins/components/forms/PlatformPayoutForm";
import { toast } from "react-toastify";

export default function PlatformPayoutModal({
    show,
    onClose,
    payout,
    ...props
}) {
    const isEditMode = !!payout;

    const { data, setData, post, put, transform, processing, errors, reset } =
        useForm({
            type: "bank",
            provider_name: "",
            account_number: "",
            account_holder_name: "",
        });

    useEffect(() => {
        if (show) {
            if (isEditMode) {
                setData({
                    type: payout.type || "bank",
                    provider_name: payout.provider_name || "",
                    account_number: payout.account_number || "",
                    account_holder_name: payout.account_holder_name || "",
                });
            } else {
                reset();
            }
        }
    }, [show, payout]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditMode) {
            put(
                route("admin.profile.platform.payouts.update", {
                    id: payout.id,
                }),
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success("Data Rekening diperbarui!");
                        onClose();
                    },
                },
            );
        } else {
            post(route("admin.profile.platform.payouts.store"), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data Rekening disimpan!");
                    onClose();
                },
            });
        }
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            maxWidth="3xl"
            className="p-4 w-full"
        >
            <PlatformPayoutForm
                payout={payout}
                isEditMode={isEditMode}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                handleSubmit={handleSubmit}
                onClose={onClose}
            />
        </Modal>
    );
}
