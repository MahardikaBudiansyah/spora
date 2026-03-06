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

export default function AdminAccountForm({
    admin,
    isEditMode,
    data,
    setData,
    errors,
    handleAvatarChange,
    processing,
    handleSubmit,
    onClose,
}) {
    const currentAvatar =
        data.avatar_path instanceof File
            ? URL.createObjectURL(data.avatar_path)
            : data.avatar_path;

    return (
        <Card className="relative rounded-lg shadow-none border-none dark:border-none overflow-visible">
            <CloseButtonModal onClose={onClose} />
            <CardHeader className="py-2 px-4 border-none">
                <h2 className="font-bold text-lg">
                    {isEditMode ? "Edit Data Admin" : "Lengkapi Data Admin"}
                </h2>
            </CardHeader>
            <form
                onSubmit={handleSubmit}
                className="animate-in fade-in duration-500"
            >
                <CardBody className="py-4 overflow-visible flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-8 md:gap-4 items-center">
                        <ProfileAvatar
                            src={currentAvatar}
                            user={{ name: data.name }}
                            mode="picker"
                            size="3xl"
                            onChange={handleAvatarChange}
                            isLoading={processing}
                            className="shadow-none shrink-0"
                        />
                        <div className="w-full">
                            <InputLabel
                                htmlFor="name"
                                value="Nama:"
                                className="mb-1 text-xs font-bold"
                            />
                            <TextInput
                                id="name"
                                placeholder="Masukan Nama "
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
