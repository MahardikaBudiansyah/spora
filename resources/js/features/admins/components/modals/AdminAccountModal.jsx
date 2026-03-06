import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import Modal from "@/components/Common/Modal";
import AdminAccountForm from "@/features/admins/components/forms/AdminAccountForm";

export default function AdminAccountModal({ show, onClose, admin, ...props }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        id: "",
        name: "",
        avatar_path: "",
    });

    const handleAvatarChange = (selected) => {
        setData("avatar_path", selected.value);
    };

    useEffect(() => {
        if (show && admin) {
            setData({
                id: admin.id || "",
                name: admin.name || "",
                avatar_path: admin.avatar_path || "",
            });
        }
    }, [show, admin]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("admin.profile.update.account"), {
            ...data,
            _method: "PUT",
            forceFormData: true,
            preserveScroll: true,
            only: ["admin"],
            onSuccess: () => {
                toast.success("Data Admin berhasil diperbarui!");
                onClose();
            },
            onError: (err) => {
                console.error("Server Error:", err);
                toast.error("Gagal memperbarui Data Admin.");
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
            <AdminAccountForm
                admin={admin}
                data={data}
                setData={setData}
                errors={errors}
                handleAvatarChange={handleAvatarChange}
                processing={processing}
                handleSubmit={handleSubmit}
                onClose={onClose}
            />
        </Modal>
    );
}
