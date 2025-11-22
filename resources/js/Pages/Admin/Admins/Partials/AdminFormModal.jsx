import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import Modal from "@/components/common/Modal";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import InputLabel from "@/components/Common/LabelInput";
import TextInput from "@/components/Common/TextInput";
import InputError from "@/components/common/ErrorInput";
import Button from "@/components/Common/Button";
import PhoneInput from "@/components/Common/PhoneInput";
import PasswordInput from "@/components/common/PasswordInput";

import { X } from "lucide-react";
import { toast } from "react-toastify";

export default function AdminFormModal({
    show,
    onClose,
    mode = "create",
    selectedAdmin = null,
}) {
    const form = useForm({
        name: selectedAdmin?.name || "",
        phone_number: selectedAdmin?.phone_number || "",
        email: selectedAdmin?.email || "",
        password: "",
        password_confirmation: "",
    });

    // Reset form saat modal ditutup atau admin yang diedit berubah
    useEffect(() => {
        if (!show) return; // Biar tidak reset saat modal ditutup

        if (mode === "edit" && selectedAdmin) {
            form.setData({
                name: selectedAdmin.name,
                phone_number: selectedAdmin.phone_number || "",
                email: selectedAdmin.email,
                password: "",
                password_confirmation: "",
            });
        }

        if (mode === "create") {
            form.reset();
        }
    }, [selectedAdmin, show]);

    const handleClose = () => {
        onClose();
        form.reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const routeUrl =
            mode === "create"
                ? route("admin.admins.store")
                : route("admin.admins.update", selectedAdmin.id);

        const method = mode === "create" ? "post" : "put";

        form.submit(method, routeUrl, {
            onSuccess: () => {
                toast.success(
                    mode === "create"
                        ? "Admin berhasil ditambahkan."
                        : "Admin berhasil diperbarui."
                );
                handleClose();
            },
            onError: (errors) => {
                // Ambil 1 error pertama saja
                const firstError = Object.values(errors)[0];
                if (firstError) {
                    toast.error(firstError);
                }
            },
            onFinish: () => {
                // Stop loading, kalau mau kontrol loader
            },
        });
    };

    return (
        <Modal show={show} onClose={handleClose} maxWidth="md" closeable={true}>
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <button
                    onClick={handleClose}
                    className="absolute top-5 right-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>
                <form onSubmit={handleSubmit}>
                    <CardHeader className="py-6 px-8">
                        <h2 className="font-bold text-lg">
                            {" "}
                            {mode === "edit" ? "Edit Admin" : "Tambah Admin"}
                        </h2>
                    </CardHeader>

                    <CardBody className="w-full">
                        <div className="p-4 flex flex-col gap-2">
                            {/* Nama */}
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama Admin:"
                                    className="mb-2 text-xs font-bold"
                                />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={form.data.name}
                                    onChange={(e) =>
                                        form.setData("name", e.target.value)
                                    }
                                    placeholder="Masukan nama Admin"
                                    className="w-full"
                                />
                                <InputError message={form.errors.name} />
                            </div>

                            {/* Nomor Telepon */}
                            <div>
                                <InputLabel
                                    htmlFor="phone_number"
                                    value="Nomor Handphone:"
                                    className="mb-2 text-xs font-bold"
                                />
                                <PhoneInput
                                    id="phone_number"
                                    name="phone_number"
                                    value={form.data.phone_number}
                                    onChange={(e) => {
                                        form.setData(
                                            "phone_number",
                                            e.target.value
                                        );
                                    }}
                                    className="w-full"
                                />
                                <InputError
                                    message={form.errors.phone_number}
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <InputLabel
                                    htmlFor="email"
                                    value="Email:"
                                    className="mb-2 text-xs font-bold"
                                />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.data.email}
                                    onChange={(e) =>
                                        form.setData("email", e.target.value)
                                    }
                                    disabled={mode === "edit"}
                                    placeholder="Masukan email Admin"
                                    className="w-full"
                                    required
                                />
                                <InputError message={form.errors.email} />
                            </div>

                            {/* Password */}
                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value={
                                        mode === "edit"
                                            ? "Ganti Kata Sandi:"
                                            : "Kata Sandi:"
                                    }
                                    className="mb-2 text-xs font-bold"
                                />
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    value={form.data.password}
                                    onChange={(e) =>
                                        form.setData("password", e.target.value)
                                    }
                                    placeholder="********"
                                    className="mt-1 block w-full"
                                    required={mode === "create"}
                                    showInitially={mode === "edit"}
                                />
                                <InputError message={form.errors.password} />
                            </div>

                            {/* Konfirmasi Password */}
                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Konfirmasi Kata Sandi:"
                                    className="mb-2 text-xs font-bold"
                                />
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={form.data.password_confirmation}
                                    onChange={(e) =>
                                        form.setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    placeholder="********"
                                    className="mt-1 block w-full"
                                    required={mode === "create"}
                                />
                                <InputError
                                    message={form.errors.password_confirmation}
                                />
                            </div>
                        </div>
                    </CardBody>

                    <CardFooter className="px-8 py-6 flex justify-end gap-2">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={form.processing}
                        >
                            {form.processing
                                ? mode === "edit"
                                    ? "Memperbarui..."
                                    : "Menambahkan..."
                                : mode === "edit"
                                ? "Perbarui"
                                : "Tambah"}
                        </Button>
                        <Button
                            variant="light"
                            type="button"
                            onClick={handleClose}
                        >
                            Kembali
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </Modal>
    );
}
