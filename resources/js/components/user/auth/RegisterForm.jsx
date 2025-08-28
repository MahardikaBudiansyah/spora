import { useState } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";
import { toast } from "react-toastify";
import InputLabel from "@/components/common/Labelnput";
import TextInput from "@/components/Common/TextInput";
import PasswordInput from "@/components/Common/PasswordInput";
import Button from "@/components/Common/Button";

export default function RegisterForm({ onSuccess }) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const [form, setForm] = useState({
        identifier: "", // email atau no hp
        name: "",
        password: "",
        password_confirmation: "",
    });

    const [isRecovery, setIsRecovery] = useState(false);
    const [recoveryName, setRecoveryName] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "identifier" ? { name: "" } : {}), // reset name jika ubah identifier
        }));

        if (name === "identifier") {
            setIsRecovery(false);
            setRecoveryName("");
        }
    };

    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[0-9]{9,15}$/;
    const isIdentifierValid =
        emailRegex.test(form.identifier) || phoneRegex.test(form.identifier);

    const step1Valid = isIdentifierValid;
    const step2Valid =
        (isRecovery || form.name.trim().length > 0) &&
        form.password.length >= 8 &&
        form.password === form.password_confirmation;

    const handleStep1Next = async (e) => {
        e.preventDefault();

        if (!step1Valid) {
            toast.error("Masukkan email atau nomor HP yang valid.");
            return;
        }

        setIsChecking(true);

        try {
            const response = await axios.post("/register/check-identifier", {
                identifier: form.identifier,
            });

            if (response.data.status === "soft_deleted") {
                toast.info(
                    "Akun Anda sebelumnya terhapus. Silakan pulihkan akun."
                );
                setIsRecovery(true);
                setRecoveryName(response.data.name);
                setForm((prev) => ({ ...prev, name: response.data.name }));
            } else {
                setIsRecovery(false);
                setRecoveryName("");
            }

            setStep(2);
        } catch (error) {
            if (!error.response) {
                toast.error(
                    "Tidak ada koneksi ke server. Silakan coba lagi nanti."
                );
            } else if (error.response.status === 409) {
                toast.error("Akun sudah terdaftar. Silakan masuk.");
            } else {
                toast.error(
                    error.response.data?.message ||
                        "Terjadi kesalahan saat memeriksa akun."
                );
            }
        } finally {
            setIsChecking(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!step2Valid) {
            toast.error("Harap lengkapi semua data dengan benar.");
            return;
        }

        setIsSubmitting(true);

        router.post("/register", form, {
            onSuccess: () => {
                toast.success("Pendaftaran berhasil!");
                onSuccess?.({
                    identifier: form.identifier,
                    password: form.password,
                });

                setForm({
                    identifier: "",
                    name: "",
                    password: "",
                    password_confirmation: "",
                });
                setStep(1);
                setIsRecovery(false);
                setRecoveryName("");
                setIsSubmitting(false);
            },
            onError: () => {
                toast.error("Pendaftaran gagal. Periksa kembali isian Anda.");
                setIsSubmitting(false);
            },
        });
    };

    return (
        <form
            onSubmit={step === 1 ? handleStep1Next : handleSubmit}
            className="space-y-4"
        >
            {step === 1 && (
                <div>
                    <InputLabel
                        htmlFor="identifier"
                        value="Email atau Nomor Handphone:"
                        className="text-xs font-bold"
                    />
                    <TextInput
                        id="identifier"
                        name="identifier"
                        type="text"
                        value={form.identifier}
                        onChange={handleChange}
                        placeholder="Masukan Email atau Nomor Handphone"
                        className="mt-1 block w-full"
                        autoFocus
                    />
                    <Button
                        type="submit"
                        className="mt-4 w-full py-3"
                        disabled={!step1Valid || isChecking}
                    >
                        {isChecking ? "Memeriksa..." : "Selanjutnya"}
                    </Button>
                </div>
            )}

            {step === 2 && (
                <>
                    {isRecovery && (
                        <div className="text-sm text-amber-600 dark:text-amber-400 font-medium -mb-2">
                            Mode pemulihan akun — isi ulang password untuk
                            mengaktifkan akun.
                        </div>
                    )}

                    <div>
                        <InputLabel
                            htmlFor="identifier"
                            value="Email atau Nomor Handphone:"
                            className="text-xs font-bold"
                        />
                        <TextInput
                            id="identifier"
                            name="identifier"
                            type="text"
                            value={form.identifier}
                            disabled
                            className="mt-1 block w-full bg-gray-100 dark:bg-gray-700"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="name"
                            value="Nama Lengkap:"
                            className="text-xs font-bold"
                        />
                        <TextInput
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="mt-1 block w-full"
                            disabled={isRecovery}
                            placeholder={
                                isRecovery
                                    ? "Nama akun pemulihan"
                                    : "Masukan Nama Lengkap"
                            }
                            autoFocus={!isRecovery}
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="Kata Sandi:"
                            className="text-xs font-bold"
                        />
                        <PasswordInput
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="********"
                            className="mt-1"
                            autoComplete="new-password"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Konfirmasi Kata Sandi:"
                            className="text-xs font-bold"
                        />
                        <PasswordInput
                            id="password_confirmation"
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={handleChange}
                            placeholder="********"
                            className="mt-1"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="flex justify-between gap-4 mt-4">
                        <Button
                            type="button"
                            className="w-1/2 py-3"
                            variant="secondary"
                            onClick={() => setStep(1)}
                        >
                            Kembali
                        </Button>

                        <Button
                            type="submit"
                            className="w-1/2 py-3"
                            disabled={!step2Valid || isSubmitting}
                        >
                            {isSubmitting
                                ? "Memproses..."
                                : isRecovery
                                ? "Pulihkan Akun"
                                : "Daftar"}
                        </Button>
                    </div>
                </>
            )}
        </form>
    );
}
