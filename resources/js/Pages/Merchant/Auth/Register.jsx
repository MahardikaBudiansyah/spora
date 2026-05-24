import { Link, Head, useForm } from "@inertiajs/react";
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
import PhoneInput from "@/components/Common/PhoneInput";
import ErrorInput from "@/components/Common/ErrorInput";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        phone_number: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("merchant.register.store"), {
            onSuccess: () => {
                toast.success("Pendaftaran akun mitra berhasil!");
            },
            onError: () => {
                toast.error(
                    "Pendaftaran gagal. Silakan periksa kembali data Anda.",
                );
            },
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <AuthMerchantLayout>
            <Head title="Pendaftaran Mitra" />
            <div className="w-full max-w-xs mx-auto">
                <Card className="border-none shadow-none">
                    <CardHeader className="border-none">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center">
                            Daftar sebagai Mitra
                        </h2>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardBody className="space-y-5">
                            <div className="space-y-1">
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama Brand Mitra:"
                                    className="text-xs font-bold"
                                />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Masukan nama Brand Mitra..."
                                    className=" w-full"
                                    required
                                />
                                {errors.name && (
                                    <ErrorInput message={errors.name} />
                                )}
                            </div>
                            <div className="space-y-1">
                                <InputLabel
                                    htmlFor="phone_number"
                                    value="Nomor Handphone:"
                                    className="text-xs font-bold"
                                />
                                <PhoneInput
                                    id="phone_number"
                                    name="phone_number"
                                    value={data.phone_number}
                                    onChange={(e) =>
                                        setData("phone_number", e.target.value)
                                    }
                                    className="w-full"
                                    required
                                />
                                {errors.phone_number && (
                                    <ErrorInput message={errors.phone_number} />
                                )}
                            </div>

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
                                    placeholder="Masukan email mitra/ perusahaan/ merchant"
                                    className="w-full"
                                    required
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
                                    placeholder="********"
                                    className="w-full"
                                    required
                                />
                                {errors.password && (
                                    <ErrorInput message={errors.password} />
                                )}
                            </div>

                            <div className="space-y-1">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Konfirmasi Kata Sandi:"
                                    className="text-xs font-bold"
                                />
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="********"
                                    className="w-full"
                                    required
                                />
                                {errors.password_confirmation && (
                                    <ErrorInput
                                        message={errors.password_confirmation}
                                    />
                                )}
                            </div>

                            <Button
                                variant="primary"
                                type="submit"
                                size="md"
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
