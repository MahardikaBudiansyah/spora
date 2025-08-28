import { Link, Head, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AuthMerchantLayout from "@/Layouts/AuthMerchantLayout";
import InputLabel from "@/components/common/Labelnput";
import PhoneInput from "@/components/Common/PhoneInput";
import PasswordInput from "@/components/common/PasswordInput";
import { Card, CardHeader, CardBody } from "@/components/common/Card";
import Button from "@/components/common/Button";
import BannerAlert from "@/components/common/BannerAlert";
import Checkbox from "@/components/Common/Checkbox";

export default function Login() {
    const { prefill, errors: backendErrors = {} } = usePage().props;

    const [data, setData] = useState({
        phone_number: prefill?.phone_number || "",
        password: "",
        remember: false,
    });

    const [processing, setProcessing] = useState(false);
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [countdown, setCountdown] = useState(0);

    // Extract detik dari pesan throttle
    const extractSeconds = (message) => {
        const match = message.match(/(\d+)\s*detik/i);
        return match ? parseInt(match[1], 10) : 60;
    };

    // Universal handleChange untuk input & checkbox
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post(route("staff.login.attempt"), data, {
            onSuccess: () => {
                toast.success("Login berhasil!");
            },
            onError: () => {
                const errors = router.page.props.errors || {};

                if (errors.phone_number) {
                    // Throttle detection
                    if (errors.phone_number.includes("coba lagi dalam")) {
                        const seconds = extractSeconds(errors.phone_number);
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
                    toast.error(errors.phone_number);
                } else if (errors.password) {
                    toast.error(errors.password);
                }
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthMerchantLayout>
            <Head title="Login Staff" />
            <div className="w-full max-w-xs mx-auto">
                <Card className="border-none shadow-none">
                    <CardHeader className="border-none">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center">
                            Masuk akun Staff
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
                                    htmlFor="phone_number"
                                    value="Nomor Handphone:"
                                    className="text-xs font-bold"
                                />
                                <PhoneInput
                                    id="phone_number"
                                    name="phone_number"
                                    value={data.phone_number}
                                    onChange={handleChange} // handleChange menerima { target: { name, value } }
                                    placeholder="Masukan Nomor Handphone"
                                    className="mt-1 block w-full"
                                    required
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
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={handleChange}
                                        className="mr-2"
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
                    </form>
                </Card>
            </div>
        </AuthMerchantLayout>
    );
}
