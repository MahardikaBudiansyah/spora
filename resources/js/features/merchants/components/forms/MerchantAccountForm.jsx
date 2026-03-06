import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import InputLabel from "@/components/Common/LabelInput";
import InputError from "@/components/common/ErrorInput";
import Button from "@/components/Common/Button";
import TextInput from "@/components/Common/TextInput";
import CloseButtonModal from "@/components/Common/CloseButtonModal";
import BannerAlert from "@/components/Common/BannerAlert";
import ProfileAvatar from "@/components/Common/ProfileAvatar";

import { AnimatePresence } from "framer-motion";

export default function MerchantAccountForm({
    merchant,
    isEditMode,
    data,
    setData,
    errors,
    handleLogoChange,
    processing,
    handleSubmit,
    onClose,
}) {
    const currentLogo =
        data.logo_path instanceof File
            ? URL.createObjectURL(data.logo_path)
            : data.logo_path;

    return (
        <Card className="relative rounded-lg shadow-none border-none dark:border-none overflow-visible">
            <CloseButtonModal onClose={onClose} />
            <CardHeader className="py-2 px-4 border-none">
                <h2 className="font-bold text-lg">
                    {isEditMode ? "Edit Data Mitra" : "Lengkapi Data Mitra"}
                </h2>
            </CardHeader>
            <form
                onSubmit={handleSubmit}
                className="animate-in fade-in duration-500"
            >
                <CardBody className="py-4 overflow-visible flex flex-col gap-4">
                    <AnimatePresence>
                        {isEditMode && merchant?.latest_status?.reason && (
                            <BannerAlert
                                variant="danger"
                                title="Perhatian: Verifikasi Sebelumnya Ditolak"
                                description={merchant.latest_status?.reason}
                                className="mb-2"
                            />
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col md:flex-row gap-8 md:gap-4 items-center">
                        <ProfileAvatar
                            src={currentLogo}
                            user={{
                                name: merchant?.name,
                            }}
                            size="3xl"
                            onChange={handleLogoChange}
                            isLoading={processing}
                            className="shadow-none shrink-0 bg"
                        />
                        <div className="w-full">
                            <InputLabel
                                htmlFor="name"
                                value="Nama Brand Mitra:"
                                className="mb-1 text-xs font-bold"
                            />
                            <TextInput
                                id="name"
                                placeholder="Masukan Nama Brand Mitra "
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                            <InputError message={errors.name} />
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="py-2 px-4 flex justify-end gap-2 border-none">
                    <Button
                        type="button"
                        variant="secondary"
                        size="xs"
                        onClick={onClose}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="xs"
                        disabled={processing}
                    >
                        {processing
                            ? "Memproses.."
                            : isEditMode
                              ? "Perbarui Data"
                              : "Simpan Data"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
