import { Link, Head, usePage, router } from "@inertiajs/react";
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

export default function Login() {
    const { props } = usePage();
    const errors = props.errors || {};

    const { prefill, registration_success } = usePage().props;

    useEffect(() => {
        if (registration_success) {
            toast.success("Pendaftaran berhasil! Silakan login.");
        }
    }, [registration_success]);

    const [data, setData] = useState({
        email: prefill.email || "",
        password: "",
    });

    const [processing, setProcessing] = useState(false);

    const [isRateLimited, setIsRateLimited] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const extractSeconds = (message) => {
        const match = message.match(/(\d+)\s*detik/i);
        return match ? parseInt(match[1], 10) : 60;
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post(
            route("admin.login.attempt"),
            {
                email: data.email,
                password: data.password,
            },
            {
                onSuccess: () => {
                    toast.success("Login berhasil!");
                },
                onError: () => {
                    const errors = router.page?.props?.errors;

                    if (errors?.email) {
                        if (errors.email.includes("coba lagi dalam")) {
                            const seconds = extractSeconds(errors.email);
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
                        toast.error(errors.email);
                    } else if (errors?.password) {
                        toast.error(errors.password);
                    } else {
                        toast.error(
                            "Gagal masuk. Periksa kembali email dan kata sandi Anda."
                        );
                    }
                },
                onFinish: () => setProcessing(false),
            }
        );
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
                            <div>
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
                                    onChange={handleChange}
                                    placeholder="Masukan email admin"
                                    className="mt-1 block w-full"
                                    required
                                    autoFocus
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
                                    value={data.password}
                                    onChange={handleChange}
                                    placeholder="********"
                                    className="mt-1 block w-full"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        className="mr-2 rounded border-gray-300 text-primary-600 shadow-sm focus:ring-primary-500"
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
