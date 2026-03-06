import React, { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";
import Modal from "@/components/Common/Modal";
import MerchantProfileForm from "@/features/merchants/components/forms/MerchantProfileForm";

import { toast } from "react-toastify";
import ConfirmModal from "@/components/Common/ConfirmModal";

export default function MerchantProfileModal({
    show,
    onClose,
    merchant,
    profile,
    ...props
}) {
    const isEditMode = !!profile;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, transform, processing, errors, reset } =
        useForm({
            merchant_id: "",
            business_name: "",
            business_email: "",
            business_phone_number: "",
            business_type: "",
            nib: "",
        });

    const [address, setAddress] = useState({
        full_address: "",
        label: "",
        province_code: null,
        city_code: null,
        district_code: null,
        village_code: null,
        postal_code: "",
        latitude: "",
        longitude: "",
    });

    useEffect(() => {
        if (show && profile) {
            if (isEditMode) {
                setData({
                    merchant_id: profile.merchant_id || "",
                    business_name: profile.business_name || "",
                    business_email: profile.business_email || "",
                    business_phone_number: profile.business_phone_number || "",
                    business_type: profile.business_type || "",
                    nib: profile.nib || "",
                });
            }
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
    }, [show, profile]);

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

        transform((data) => ({
            ...data,
            ...address,
            _method: isEditMode ? "PUT" : "POST",
        }));

        post(route("merchant.profile.update.profile"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    isEditMode
                        ? "Data Profile Bisnis diperbarui!"
                        : "Data Profile Bisnis disimpan!",
                );
                onClose();
            },
            onError: (err) => {
                console.error("Server Error:", err);
                toast.error("Gagal memperbarui profil.");
            },
        });
    };

    const handleDiscardDraft = () => {
        router.delete(route("merchant.profile.discard"), {
            onSuccess: () => {
                setIsModalOpen(false);
                onClose();
                toast.success(
                    "Perubahan dibatalkan. Kembali ke data terverifikasi.",
                );
            },
            onError: () => {
                setIsModalOpen(false);
                toast.error("Gagal membatalkan perubahan.");
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
            <MerchantProfileForm
                isEditMode={isEditMode}
                merchant={merchant}
                profile={profile}
                data={data}
                setData={setData}
                errors={errors}
                address={address}
                setAddress={setAddress}
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
                            {profile?.business_name}?
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
