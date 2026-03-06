import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import Modal from "@/components/Common/Modal";
import MerchantAccountForm from "@/features/merchants/components/forms/MerchantAccountForm";

export default function MerchantAccountModal({
    show,
    onClose,
    merchant,
    ...props
}) {
    const { data, setData, post, put, transform, processing, errors, reset } =
        useForm({
            id: "",
            name: "",
            logo_path: "",
        });

    const handleLogoChange = (selected) => {
        setData("logo_path", selected.value);
    };

    useEffect(() => {
        if (show && merchant) {
            setData({
                id: merchant.id || "",
                name: merchant.name || "",
                logo_path: merchant.logo_path || "",
            });
        }
    }, [show, merchant]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("merchant.profile.update.account"), {
            ...data,
            _method: "PUT",
            forceFormData: true,
            preserveScroll: true,
            only: ["merchant"],
            onSuccess: () => {
                toast.success("Data Merchant berhasil diperbarui!");
                onClose();
            },
            onError: (err) => {
                console.error("Server Error:", err);
                toast.error("Gagal memperbarui Data Merchant.");
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
            <MerchantAccountForm
                merchant={merchant}
                data={data}
                setData={setData}
                errors={errors}
                handleLogoChange={handleLogoChange}
                processing={processing}
                handleSubmit={handleSubmit}
                onClose={onClose}
            />
        </Modal>
    );
}
