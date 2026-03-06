import { useState } from "react";
import { Link, useForm, usePage, router } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import InputError from "@/components/common/ErrorInput";
import InputLabel from "@/components/Common/LabelInput";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import TextInput from "@/components/common/TextInput";
import PhoneInput from "@/components/Common/PhoneInput";
import { formatTo08 } from "@/utils/numberPhone";
import ProfileAvatar from "@/components/Common/ProfileAvatar";
import {
    getUserStatus,
    getVerificationStatus,
} from "@/utils/attributes/userAttribute";
import { formatFullDateTime } from "@/utils/date";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;
    const [resetPreviewSignal, setResetPreviewSignal] = useState(false);

    const userStatus = getUserStatus(user.status, user.status_verified_at);
    const emailStatus = getVerificationStatus(user.email_verified_at);
    const phoneStatus = getVerificationStatus(user.phone_verified_at);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            username: user.username,
            phone_number: user.phone_number,
            email: user.email,
            photo: null,
        });

    const submit = (e) => {
        e.preventDefault();

        router.post(
            route("user.profile.update"),
            {
                name: data.name,
                username: data.username,
                phone_number: data.phone_number ?? "",
                email: data.email ?? "",
                photo: data.photo,
                _method: "patch",
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    setData("photo", null);
                    setResetPreviewSignal((prev) => !prev);

                    const updatedUser = page.props.auth.user;

                    if (updatedUser.status === "active") {
                        toast.success("Profil lengkap! Akun Anda kini Aktif.");
                    } else {
                        toast.success("Profil berhasil diperbarui!");
                    }
                },
                onError: (errs) => console.error(errs),
            },
        );
    };

    return (
        <section className={className}>
            <header>
                <div className="flex gap-2 items-center">
                    <h2 className="text-lg font-medium">Informasi Profil</h2>
                    <Badge
                        color={userStatus.color}
                        tooltip={userStatus.timestamp}
                    >
                        {userStatus.label}
                    </Badge>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Perbarui informasi profil akun dan alamat email Anda.
                </p>
            </header>

            <form
                onSubmit={submit}
                className="mt-6 flex flex-col md:flex-row gap-6"
            >
                <div className="space-y-6">
                    <ProfileAvatar
                        user={user}
                        size="2xl"
                        onChange={(file) => setData("photo", file)}
                        resetPreviewSignal={resetPreviewSignal}
                    />
                </div>
                <div className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <InputLabel htmlFor="name" value="Nama" />
                        <TextInput
                            id="name"
                            className="w-full"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                        <InputLabel htmlFor="username" value="Username" />
                        <TextInput
                            id="username"
                            className="w-full"
                            value={data.username}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            readOnly
                            required
                            autoComplete="username"
                        />
                        <InputError message={errors.username} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                            <InputLabel
                                htmlFor="phone_number"
                                value="Nomor Handphone:"
                            />
                            <Badge
                                color={phoneStatus?.color}
                                tooltip={phoneStatus.timestamp}
                            >
                                {phoneStatus?.label}
                            </Badge>
                        </div>
                        <PhoneInput
                            id="phone_number"
                            className="w-full"
                            value={formatTo08(data.phone_number) ?? ""}
                            onChange={(e) =>
                                setData("phone_number", e.target.value)
                            }
                            disabled={user.phone_number !== null}
                            autoComplete="tel"
                            placeholder="08XXXXXXXXXX"
                            isFocused={true}
                        />
                        <InputError message={errors.phone_number} />
                        {user.phone_number === null ? (
                            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                                Anda belum menambahkan nomor handphone.
                                Disarankan untuk menambahkannya agar dapat
                                menambahkan slot atau jam pada keranjang dan
                                memulai booking serta memulihkan akun.
                            </p>
                        ) : (
                            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                                Nomor handphone tidak dapat diubah setelah
                                ditambahkan.
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex gap-2 items-center">
                            <InputLabel htmlFor="email" value="Email:" />
                            <Badge
                                color={emailStatus?.color}
                                tooltip={emailStatus.timestamp}
                            >
                                {emailStatus?.label}
                            </Badge>
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            className="w-full"
                            value={data.email ?? ""}
                            onChange={(e) => setData("email", e.target.value)}
                            disabled={user.email !== null}
                            autoComplete="email"
                        />

                        <InputError message={errors.email} />
                        <div className="flex items-center gap-2">
                            {user.email === null && (
                                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                                    Anda belum menambahkan email. Disarankan
                                    untuk menambahkannya agar dapat memulihkan
                                    akun.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email Verification Notice */}
                    {user.email_verified_at === null && (
                        <div className="space-y-2">
                            <p className="text-sm text-gray-800">
                                Alamat email Anda belum diverifikasi.
                                <Link
                                    href={route("verification.send")}
                                    method="post"
                                    as="button"
                                    className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Klik di sini untuk mengirim ulang email
                                    verifikasi.
                                </Link>
                            </p>

                            {status === "verification-link-sent" && (
                                <div className="mt-2 font-medium text-sm text-green-600">
                                    Tautan verifikasi baru telah dikirim ke
                                    alamat email Anda.
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <Button
                            type="submit"
                            disabled={processing}
                            variant="primary"
                        >
                            {processing ? "Menyimpan..." : "Simpan"}
                        </Button>
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-gray-600 dark:text-gray-200">
                                Tersimpan.
                            </p>
                        </Transition>
                    </div>
                </div>
            </form>
        </section>
    );
}
