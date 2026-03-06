import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import TextInput from "@/components/Common/TextInput";
import PasswordInput from "@/components/Common/PasswordInput";
import InputLabel from "@/components/Common/LabelInput";
import Checkbox from "@/components/Common/Checkbox";
import Button from "@/components/Common/Button";
import BannerAlert from "@/components/common/BannerAlert";
import { toast } from "react-toastify";

export default function LoginForm({ onSuccess, defaultValues }) {
    const { login, authLoading, error } = useAuth();
    const [rememberMe, setRememberMe] = useState(false);
    const [form, setForm] = useState(
        defaultValues || { identifier: "", password: "" },
    );
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const extractSeconds = (message) => {
        const match = message?.match?.(/(\d+)\s*detik/i);
        return match ? parseInt(match[1], 10) : 60;
    };

    useEffect(() => {
        if (!isRateLimited) {
            document.getElementById("identifier")?.focus();
        }
    }, [isRateLimited]);

    useEffect(() => {
        if (defaultValues) setForm(defaultValues);
    }, [defaultValues]);

    useEffect(() => {
        if (error && error.includes && error.includes("detik")) {
            const seconds = extractSeconds(error);
            setIsRateLimited(true);
            setCountdown(seconds);

            toast.warning(error);

            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsRateLimited(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[0-9]{9,15}$/;
    const isIdentifierValid =
        emailRegex.test(form.identifier) || phoneRegex.test(form.identifier);
    const isFormValid = isIdentifierValid && form.password.length >= 8;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            toast.error("Harap isi data dengan benar.");
            return;
        }

        const { success } = await login({
            identifier: form.identifier,
            password: form.password,
            remember: rememberMe,
        });

        if (success) onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {isRateLimited && (
                <BannerAlert type="warning" className="my-0">
                    Terlalu banyak percobaan login. Silakan coba lagi dalam{" "}
                    {countdown} detik.
                </BannerAlert>
            )}

            <div>
                <InputLabel
                    htmlFor="identifier"
                    value="Email atau Nomor Telepon: "
                    className="text-xs font-bold"
                />
                <TextInput
                    id="identifier"
                    type="text"
                    name="identifier"
                    className="mt-1 block w-full"
                    autoComplete="username"
                    isFocused={true}
                    value={form.identifier}
                    onChange={handleChange}
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
                    className="mt-1"
                />
            </div>

            <div className="flex items-center justify-between">
                <label className="flex items-center text-xs text-gray-700 dark:text-gray-100">
                    <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="ml-2">Ingat Saya</span>
                </label>
                <button
                    type="button"
                    className="text-xs font-semibold text-primary-600 dark:text-primary-500 hover:underline"
                >
                    Lupa Kata Sandi?
                </button>
            </div>

            <Button
                type="submit"
                className="w-full py-3"
                disabled={!isFormValid || authLoading || isRateLimited}
                variant="primary"
            >
                {isRateLimited
                    ? `Tunggu ${countdown}s`
                    : authLoading
                      ? "Memproses..."
                      : "Masuk"}
            </Button>
        </form>
    );
}
