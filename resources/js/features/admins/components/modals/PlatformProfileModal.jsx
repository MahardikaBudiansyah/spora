import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import Modal from "@/components/Common/Modal";
import PlatformProfileForm from "@/features/admins/components/forms/PlatformProfileForm";

export default function PlatformProfileModal({
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
            business_name: "",
            business_email: "",
            business_phone_number: "",
            business_type: "",
            nib: "",
            logo_path: null,
        });

    const [address, setAddress] = useState({
        address: "",
        province_code: null,
        city_code: null,
        district_code: null,
        village_code: null,
        postal_code: "",
        latitude: "",
        longitude: "",
    });

    const handleLogoChange = (selected) => {
        setData("logo_path", selected.value);
    };

    useEffect(() => {
        if (show && profile) {
            if (isEditMode) {
                setData({
                    admin_id: profile.admin_id || "",
                    business_name: profile.business_name || "",
                    business_email: profile.business_email || "",
                    business_phone_number: profile.business_phone_number || "",
                    business_type: profile.business_type || "",
                    nib: profile.nib || "",
                    logo_path: profile.logo_path || "",
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
            } else {
                reset();
                setAddress({});
            }
        }
    }, [show, profile]);

    const handleSubmit = (e) => {
        e.preventDefault();

        transform((data) => ({
            ...data,
            ...address,
            _method: isEditMode ? "PUT" : "POST",
        }));

        post(route("admin.profile.platform.update"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    isEditMode
                        ? "Data Profil Bisnis diperbarui!"
                        : "Data Profil Bisnis disimpan!",
                );
                onClose();
            },
            onError: (err) => {
                console.error("Server Error:", err);
                toast.error("Gagal memperbarui Profil Bisnis Platform.");
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
            <PlatformProfileForm
                isEditMode={isEditMode}
                profile={profile}
                data={data}
                setData={setData}
                errors={errors}
                address={address}
                setAddress={setAddress}
                handleLogoChange={handleLogoChange}
                processing={processing}
                handleSubmit={handleSubmit}
                onClose={onClose}
            />
        </Modal>
    );
}
