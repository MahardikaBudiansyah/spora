import React, { useState } from "react";
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
import PhoneInput from "@/components/Common/PhoneInput";
import PasswordInput from "@/components/Common/PasswordInput";

export default function AdminAccountSecurityForm({
    admin,
    isEditMode,
    data,
    setData,
    errors,
    processing,
    handleSubmit,
    onClose,
}) {
    return (
        <Card className="relative rounded-lg shadow-none border-none overflow-visible">
            <CloseButtonModal onClose={onClose} />
            <CardHeader className="py-2 px-4 border-none">
                <h2 className="font-bold text-lg">Pengaturan Keamanan Akun</h2>
                <p className="text-xs text-secondary-500">
                    Kelola kredensial login akun Admin.
                </p>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardBody className="py-4 overflow-visible flex flex-col gap-4">
                    <div
                        className="grid grid-co
                        ls-1 md:grid-cols-2 gap-4"
                    >
                        <div className="w-full">
                            <InputLabel
                                htmlFor="email"
                                value="Email Akun:"
                                className="mb-1 text-xs font-bold"
                            />
                            <TextInput
                                id="email"
                                value={data.email}
                                readOnly={true}
                            />
                        </div>
                    </div>

                    <hr className="border-secondary-100 dark:border-secondary-600" />

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold">Ubah Kata Sandi</h3>

                        <div className="w-full">
                            <InputLabel
                                htmlFor="current_password"
                                value="Password Saat Ini:"
                                className="mb-1 text-xs font-bold"
                            />
                            <PasswordInput
                                id="current_password"
                                placeholder="Masukkan password sekarang"
                                value={data.current_password || ""}
                                onChange={(e) =>
                                    setData("current_password", e.target.value)
                                }
                            />
                            <InputError message={errors.current_password} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-full">
                                <InputLabel
                                    htmlFor="password"
                                    value="Password Baru:"
                                    className="mb-1 text-xs font-bold"
                                />
                                <PasswordInput
                                    id="password"
                                    placeholder="Minimal 8 karakter"
                                    value={data.password || ""}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    autoComplete="new-password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="w-full">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Konfirmasi Password Baru:"
                                    className="mb-1 text-xs font-bold"
                                />
                                <PasswordInput
                                    id="password_confirmation"
                                    placeholder="Ulangi password baru"
                                    value={data.password_confirmation || ""}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="py-4 px-4 flex justify-end gap-2 border-t border-secondary-50 dark:border-secondary-800">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={onClose}
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={processing}
                    >
                        {processing ? "Menyimpan..." : "Perbarui Keamanan"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
