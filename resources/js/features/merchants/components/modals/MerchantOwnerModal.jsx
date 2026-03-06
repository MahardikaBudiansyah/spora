import React, { useState, useEffect } from "react";
import { router, useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import Modal from "@/components/Common/Modal";
import MerchantOwnerForm from "@/features/merchants/components/forms/MerchantOwnerForm";
import { toISODate } from "@/utils/date";
import ConfirmModal from "@/components/Common/ConfirmModal";

export default function MerchantOwnerModal({
    show,
    onClose,
    merchant,
    owner,
    ...props
}) {
    const isEditMode = !!owner;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, transform, processing, errors, reset } =
        useForm({
            name: "",
            email: "",
            phone_number: "",
            nik: "",
            date_of_birth: "",
            gender: "",
            photo_path: null,
            ktp_photo_path: null,
            selfie_photo_path: null,
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

    const [previews, setPreviews] = React.useState({
        photo_path: "",
        ktp_photo_path: "",
        selfie_photo_path: "",
    });

    useEffect(() => {
        if (show && owner) {
            if (isEditMode) {
                setData({
                    merchant_id: owner.merchant_id || "",
                    name: owner.name || "",
                    email: owner.email || "",
                    phone_number: owner.phone_number || "",
                    nik: owner.nik || "",
                    date_of_birth: owner.date_of_birth || "",
                    gender: owner.gender || "",
                    photo_path: null,
                    ktp_photo_path: null,
                    selfie_photo_path: null,
                });

                if (owner.address) {
                    setAddress({
                        address: owner.address.address || "",
                        province_code: owner.address.province_code || null,
                        city_code: owner.address.city_code || null,
                        district_code: owner.address.district_code || null,
                        village_code: owner.address.village_code || null,
                        postal_code: owner.address.postal_code || "",
                        latitude: owner.address.latitude || "",
                        longitude: owner.address.longitude || "",
                    });
                }

                setPreviews({
                    photo_path: owner.photo_path ? owner.photo_path : "",
                    ktp_photo_path: owner.ktp_photo_path
                        ? owner.ktp_photo_path
                        : "",
                    selfie_photo_path: owner.selfie_photo_path
                        ? owner.selfie_photo_path
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
    }, [show, owner]);

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
            date_of_birth: toISODate(data.date_of_birth),
            _method: isEditMode ? "PUT" : "POST",
        }));

        post(route("merchant.owner.update"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    isEditMode
                        ? "Data Owner diperbarui!"
                        : "Data Owner disimpan!",
                );
                onClose();
            },
            onError: (err) => {
                toast.error("Terjadi kesalahan, periksa kembali inputan Anda.");
            },
        });
    };

    const handleDiscardDraft = () => {
        router.delete(route("merchant.owner.discard"), {
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
            maxWidth="4xl"
            className="p-4 w-full"
        >
            <MerchantOwnerForm
                isEditMode={isEditMode}
                merchant={merchant}
                owner={owner}
                data={data}
                setData={setData}
                errors={errors}
                address={address}
                setAddress={setAddress}
                previews={previews}
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
                            Apakah Anda ingin yakin membatalkan perubahan data{" "}
                            {owner?.name}?
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
