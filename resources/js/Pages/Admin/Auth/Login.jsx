import { Link, Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AuthAdminLayout from "@/Layouts/AuthAdminLayout";
import InputLabel from "@/components/Common/LabelInput";
import TextInput from "@/components/common/TextInput";
import PasswordInput from "@/components/common/PasswordInput";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/common/Card";
import Button from "@/components/common/Button";
import BannerAlert from "@/components/common/BannerAlert";
import Checkbox from "@/components/Common/Checkbox";
import ErrorInput from "@/components/Common/ErrorInput";

export default function Login({ prefill = {}, registration_success }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: prefill?.email || "",
        password: "",
        remember: false,
    });

    const [isRateLimited, setIsRateLimited] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (registration_success) {
            toast.success("Pendaftaran berhasil! Silakan login.");
        }
    }, [registration_success]);

    const extractSeconds = (message) => {
        const match = message.match(/(\d+)\s*detik/i);
        return match ? parseInt(match[1], 10) : 60;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("admin.login.attempt"), {
            onSuccess: () => {
                toast.success("Login berhasil!");
            },
            onError: (err) => {
                if (err.email && err.email.includes("coba lagi dalam")) {
                    const seconds = extractSeconds(err.email);
                    setCountdown(seconds);
                    setIsRateLimited(true);

                    const interval = setInterval(() => {
                        setCountdown((prev) => {
                            if (prev <= 1) {
                                clearInterval(interval);
                                setIsRateLimited(false);
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                }

                const firstError = Object.values(err)[0];
                toast.error(
                    firstError || "Gagal masuk. Periksa kembali data Anda.",
                );
            },
            onFinish: () => reset("password"),
        });
    };

    return (
        <AuthAdminLayout>
            <Head title="Login Admin" />
            <div className="w-full max-w-xs mx-auto">
                <Card className="border-none shadow-none">
                    <CardHeader className="border-none">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center">
                            Masuk akun Admin
                        </h2>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        {isRateLimited && (
                            <BannerAlert type="warning" className="mx-4 my-0">
                                Terlalu banyak percobaan login. Silakan coba
                                lagi dalam {countdown} detik.
                            </BannerAlert>
                        )}

                        <CardBody className="space-y-5">
                            <div className="space-y-1">
                                <InputLabel
                                    htmlFor="email"
                                    value="Email:"
                                    className="text-xs font-bold"
                                />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="Masukan email admin"
                                    className="w-full"
                                    required
                                    autoFocus
                                />
                                {errors.email && (
                                    <ErrorInput message={errors.email} />
                                )}
                            </div>

                            <div className="space-y-1">
                                <InputLabel
                                    htmlFor="password"
                                    value="Kata Sandi:"
                                    className="text-xs font-bold"
                                />
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="w-full"
                                    required
                                />
                                {errors.password && (
                                    <ErrorInput message={errors.password} />
                                )}
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                                <label className="flex items-center gap-2">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked,
                                            )
                                        }
                                    />
                                    Ingat saya
                                </label>
                                <Link
                                    href="#"
                                    className="text-xs font-semibold text-primary-600 dark:text-primary-500 hover:underline"
                                >
                                    Lupa password?
                                </Link>
                            </div>

                            <Button
                                variant="primary"
                                type="submit"
                                size="lg"
                                className="w-full text-md"
                                disabled={processing || isRateLimited}
                            >
                                {processing
                                    ? "Memproses..."
                                    : isRateLimited
                                      ? `Tunggu ${countdown} detik...`
                                      : "Masuk"}
                            </Button>
                        </CardBody>

                        <CardFooter className="border-none text-xs text-left text-gray-700 dark:text-gray-300"></CardFooter>
                    </form>
                </Card>
            </div>
        </AuthAdminLayout>
    );
}
