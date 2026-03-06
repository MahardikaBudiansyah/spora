import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import Modal from "@/components/Common/Modal";
import AdminAccountSecurityForm from "@/features/admins/components/forms/AdminAccountSecurityForm";

export default function AdminAccountSecurityModal({
    show,
    onClose,
    admin,
    ...props
}) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: admin?.id || "",
        email: admin?.email || "",
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        if (show && admin) {
            setData({
                id: admin?.id || "",
                email: admin?.email || "",
                current_password: "",
                password: "",
                password_confirmation: "",
            });
        }
    }, [show, admin]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("admin.profile.update.account.security"), {
            ...data,
            _method: "PUT",
            forceFormData: true,
            preserveScroll: true,
            only: ["admin"],
            onSuccess: () => {
                toast.success("Pengaturan Admin berhasil diperbarui!");
                reset("password", "current_password", "password_confirmation");
                onClose();
            },
            onError: (err) => {
                console.error("Server Error:", err);
                toast.error("Gagal memperbarui Pengaturan Admin.");
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
            <AdminAccountSecurityForm
                admin={admin}
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
