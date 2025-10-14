import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import InputError from "@/components/common/ErrorInput";
import InputLabel from "@/components/Common/LabelInput";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import TextInput from "@/components/common/TextInput";
import PhoneInput from "@/components/Common/PhoneInput";
import { formatTo08, normalizePhone } from "@/utils/numberPhone";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            username: user.username,
            phone_number: user.phone_number,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("user.profile.update"), {
            data: {
                ...data,
                phone_number: normalizePhone(data.phone_number),
            },
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Informasi profil berhasil diperbarui!");
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium">Informasi Profil</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Perbarui informasi profil akun dan alamat email Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Name */}
                <div>
                    <InputLabel htmlFor="name" value="Nama" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                {/* Username */}
                <div>
                    <InputLabel htmlFor="username" value="Username" />
                    <TextInput
                        id="username"
                        className="mt-1 block w-full"
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.username} />
                </div>

                {/* Phone Number */}
                <div>
                    <InputLabel
                        htmlFor="phone_number"
                        value="Nomor Handphone"
                    />
                    <PhoneInput
                        id="phone_number"
                        className="mt-1 block w-full"
                        value={formatTo08(data.phone_number) ?? ""}
                        onChange={(e) =>
                            setData("phone_number", e.target.value)
                        }
                        disabled={user.phone_number !== null} // Disable jika nomor sudah ada
                        autoComplete="tel"
                        placeholder="08XXXXXXXXXX"
                        isFocused={true} // opsional, jika ingin auto fokus
                    />
                    <InputError
                        className="mt-2"
                        message={errors.phone_number}
                    />
                    {user.phone_number === null ? (
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                            Anda belum menambahkan nomor handphone. Disarankan
                            untuk menambahkannya agar dapat menambahkan slot
                            atau jam pada keranjang dan memulai booking serta
                            memulihkan akun.
                        </p>
                    ) : (
                        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                            Nomor handphone tidak dapat diubah setelah
                            ditambahkan.
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email ?? ""}
                        onChange={(e) => setData("email", e.target.value)}
                        disabled={user.email !== null} // disable jika sudah ada
                        autoComplete="email"
                    />

                    <InputError className="mt-2" message={errors.email} />
                    <div className="flex items-center gap-2 mt-2">
                        {user.email === null && (
                            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                                Anda belum menambahkan email. Disarankan untuk
                                menambahkannya agar dapat memulihkan akun.
                            </p>
                        )}
                        {user.email && (
                            <div className="flex items-center gap-2 mt-2">
                                {user.email_verified_at ? (
                                    <Badge color="green">Terverifikasi</Badge>
                                ) : (
                                    <Badge color="red">
                                        Belum Terverifikasi
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Email Verification Notice */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
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
                                Tautan verifikasi baru telah dikirim ke alamat
                                email Anda.
                            </div>
                        )}
                    </div>
                )}

                {/* Submit */}
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
            </form>
        </section>
    );
}
