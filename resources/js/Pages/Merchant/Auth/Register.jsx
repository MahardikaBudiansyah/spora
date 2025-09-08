import { Link, Head, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import AuthMerchantLayout from "@/Layouts/AuthMerchantLayout";
import InputLabel from "@/components/Common/LabelInput";
import TextInput from "@/components/common/TextInput";
import PasswordInput from "@/components/common/PasswordInput";
import Button from "@/components/common/Button";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/common/Card";
import { toast } from "react-toastify";

export default function Register() {
    const { errors } = usePage().props;

    const [data, setData] = useState({
        name: "",
        phone_number: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [processing, setProcessing] = useState(false);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        router.post(route("merchant.register.store"), data, {
            onSuccess: () => {
                toast.success("Pendaftaran akun mitra berhasil!");
                router.visit(route("merchant.login"));
            },
            onError: () => {
                toast.error(
                    "Pendaftaran gagal. Silakan periksa kembali data Anda."
                );
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthMerchantLayout>
            <Head title="Register Mitra" />
            <div className="w-full max-w-xs mx-auto">
                <Card className="border-none shadow-none">
                    <CardHeader className="border-none">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center">
                            Daftar sebagai Mitra
                        </h2>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardBody className="space-y-5">
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama Mitra:"
                                    className="text-xs font-bold"
                                />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={handleChange}
                                    placeholder="Masukan nama dari mitra/ perusahan/ merchant"
                                    className="mt-1 block w-full"
                                    required
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        *{errors.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="phone_number"
                                    value="Nomor Handphone:"
                                    className="text-xs font-bold"
                                />
                                <TextInput
                                    id="phone_number"
                                    name="phone_number"
                                    value={data.phone_number}
                                    onChange={handleChange}
                                    placeholder="(Contoh: 08XXXXXXXXXX)"
                                    className="mt-1 block w-full"
                                    required
                                />
                                {errors.phone_number && (
                                    <p className="mt-1 text-sm text-red-600">
                                        *{errors.phone_number}
                                    </p>
                                )}
                            </div>

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
                                    placeholder="Masukan email mitra/ perusahaan/ merchant"
                                    className="mt-1 block w-full"
                                    required
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">
                                        *{errors.email}
                                    </p>
                                )}
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
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">
                                        *{errors.password}
                                    </p>
                                )}
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
                                    value={data.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="********"
                                    className="mt-1 block w-full"
                                    required
                                />
                                {errors.password_confirmation && (
                                    <p className="mt-1 text-sm text-red-600">
                                        *{errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            <Button
                                variant="primary"
                                type="submit"
                                size="lg"
                                className="w-full text-md"
                                disabled={processing}
                            >
                                {processing ? "Mendaftar..." : "Daftar"}
                            </Button>
                        </CardBody>

                        <CardFooter className="border-none text-xs text-left text-gray-700 dark:text-gray-300">
                            Sudah punya akun?{" "}
                            <Link
                                href={route("merchant.login")}
                                className="text-primary-600 dark:text-primary-500 hover:underline font-medium"
                            >
                                Masuk di sini
                            </Link>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AuthMerchantLayout>
    );
}
