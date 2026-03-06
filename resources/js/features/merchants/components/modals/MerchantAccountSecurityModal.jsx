import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import Modal from "@/components/Common/Modal";
import MerchantAccountSecurityForm from "@/features/merchants/components/forms/MerchantAccountSecurityForm";

export default function MerchantAccountSecurityModal({
    show,
    onClose,
    merchant,
    ...props
}) {
    const { data, setData, post, put, transform, processing, errors, reset } =
        useForm({
            id: "",
            email: "",
            password: "",
            phone_number: "",
        });

    useEffect(() => {
        if (show) {
            setData({
                id: merchant?.id || "",
                email: merchant?.email || "",
                password: merchant?.password || "",
                phone_number: merchant?.phone_number || "",
            });
        }
    }, [show]);

    const handleSubmit = (e) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            _method: "PUT",
        }));

        post(route("merchant.profile.update.account.security"), {
            forceFormData: true,
            preserveScroll: true,
            only: ["merchant"],
            onSuccess: () => {
                toast.success("Pengaturan Merchant berhasil diperbarui!");
                onClose();
            },
            onError: (err) => {
                console.error("Server Error:", err);
                toast.error("Gagal memperbarui Pengaturan Merchant.");
            },
        });
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            maxWidth="2xl"
            className="p-4 w-full"
        >
            <MerchantAccountSecurityForm
                merchant={merchant}
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
