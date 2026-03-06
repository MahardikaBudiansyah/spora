import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import Modal from "@/components/Common/Modal";
import AdminProfileForm from "@/features/admins/components/forms/AdminProfileForm";
import { toISODate } from "@/utils/date";

export default function AdminProfileModal({
    show,
    onClose,
    profile,
    role,
    ...props
}) {
    const isEditMode = !!profile;

    const { data, setData, post, put, transform, processing, errors, reset } =
        useForm({
            admin_id: "",
            nik: "",
            full_name: "",
            phone_number: "",
            date_of_birth: "",
            gender: "",
            photo_path: null,
            ktp_photo_path: null,
            selfie_photo_path: null,
        });

    const [address, setAddress] = useState({
        address: "",
        label: "",
        province_code: null,
        city_code: null,
        district_code: null,
        village_code: null,
        postal_code: "",
        latitude: "",
        longitude: "",
    });

    const [previews, setPreviews] = React.useState({
        photo_path: "",
        ktp_photo_path: "",
        selfie_photo_path: "",
    });

    useEffect(() => {
        if (show && profile) {
            if (isEditMode) {
                setData({
                    admin_id: profile.admin_id || "",
                    nik: profile.nik || "",
                    full_name: profile.full_name || "",
                    phone_number: profile.phone_number || "",
                    date_of_birth: profile.date_of_birth || "",
                    gender: profile.gender || "",
                    photo_path: null,
                    ktp_photo_path: null,
                    selfie_photo_path: null,
                });

                if (profile.address) {
                    setAddress({
                        address: profile.address.address || "",
                        province_code: profile.address.province_code || null,
                        city_code: profile.address.city_code || null,
                        district_code: profile.address.district_code || null,
                        village_code: profile.address.village_code || null,
                        postal_code: profile.address.postal_code || "",
                        latitude: profile.address.latitude || "",
                        longitude: profile.address.longitude || "",
                    });
                }

                setPreviews({
                    photo_path: profile.photo_path ? profile.photo_path : "",
                    ktp_photo_path: profile.ktp_photo_path
                        ? profile.ktp_photo_path
                        : "",
                    selfie_photo_path: profile.selfie_photo_path
                        ? profile.selfie_photo_path
                        : "",
                });
            } else {
                reset();
                setAddress({});
                setPreviews({
                    photo_path: "",
                    ktp_photo_path: "",
                    selfie_photo_path: "",
                });
            }
        }
    }, [show, profile]);

    const handleSubmit = (e) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            ...address,
            date_of_birth: toISODate(data.date_of_birth),
            _method: "PUT",
        }));

        post(route("admin.profile.update"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    isEditMode
                        ? role === "superadmin"
                            ? "Kontak Bisnis diperbarui!"
                            : "Profil Admin diperbarui!"
                        : role === "superadmin"
                          ? "Kontak Bisnis disimpan!"
                          : "Profil Admin disimpan!",
                );
                onClose();
            },
            onError: (err) => {
                console.error("Server Error:", err);
                toast.error(
                    role === "superadmin"
                        ? "Gagal memperbarui Kontak Bisnis!"
                        : "Gagal memperbarui Profil Admin!",
                );
            },
        });
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            maxWidth="4xl"
            className="p-4 w-full"
        >
            <AdminProfileForm
                isEditMode={isEditMode}
                profile={profile}
                role={role}
                data={data}
                setData={setData}
                errors={errors}
                address={address}
                setAddress={setAddress}
                previews={previews}
                processing={processing}
                handleSubmit={handleSubmit}
                onClose={onClose}
            />
        </Modal>
    );
}
