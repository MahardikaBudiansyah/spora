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

import { toast } from "react-toastify";
import CloseButtonModal from "@/components/Common/CloseButtonModal";
import SelectInput from "@/components/Common/SelectInput";

export default function AdminFormModal({
    show,
    onClose,
    mode = "create",
    selectedAdmin = null,
}) {
    const roleOptions = [
        { value: "admin", label: "Admin" },
        { value: "superadmin", label: "Superadmin" },
    ];

    const form = useForm({
        name: selectedAdmin?.name || "",
        role: selectedAdmin?.role || "admin",
        phone_number: selectedAdmin?.phone_number || "",
        email: selectedAdmin?.email || "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        if (!show) return;

        if (mode === "edit" && selectedAdmin) {
            form.setData({
                name: selectedAdmin.name,
                role: selectedAdmin.role,
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
                        : "Admin berhasil diperbarui.",
                );
                handleClose();
            },
            onError: (errors) => {
                const firstError = Object.values(errors)[0];
                if (firstError) {
                    toast.error(firstError);
                }
            },
            onFinish: () => {},
        });
    };

    return (
        <Modal
            show={show}
            onClose={handleClose}
            maxWidth="lg"
            closeable={true}
            className="p-4 w-full"
        >
            <Card className="relative py-2 rounded-lg shadow-none border-none dark:border-none overflow-visible">
                <CloseButtonModal onClose={onClose} />
                <form onSubmit={handleSubmit}>
                    <CardHeader className="py-2 px-4 border-none space-y-1.5 md:mr-8">
                        <h2 className="font-bold text-lg uppercase leading-tight tracking-wide">
                            {" "}
                            {mode === "edit" ? "Edit Admin" : "Tambah Admin"}
                        </h2>
                        <p className="text-xs text-secondary-600 dark:text-secondary-300">
                            {mode === "edit"
                                ? "Perbarui detail informasi dan hak akses untuk akun admin ini."
                                : "Tambahkan anggota baru ke tim pengelola Spora. Pastikan email yang didaftarkan aktif."}
                        </p>
                    </CardHeader>

                    <CardBody className="py-4 overflow-visible flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row gap-2 items-center">
                            <div className="space-y-1 w-full">
                                <InputLabel
                                    htmlFor="name"
                                    value="Nama Admin:"
                                    className="text-xs font-bold"
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
                            <div className="space-y-1 w-full">
                                <InputLabel
                                    htmlFor="role"
                                    value="Role:"
                                    className="text-xs font-bold"
                                />
                                <SelectInput
                                    id="role"
                                    options={roleOptions}
                                    value={form.data.role}
                                    onChange={(val) =>
                                        form.setData("role", val)
                                    }
                                    isClearable={false}
                                    isSearchable={false}
                                    placeholder="Pilih Role Admin..."
                                />

                                <InputError message={form.errors.role} />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 items-center">
                            <div className="space-y-1 w-full">
                                <InputLabel
                                    htmlFor="phone_number"
                                    value="Nomor Handphone:"
                                    className="text-xs font-bold"
                                />
                                <PhoneInput
                                    id="phone_number"
                                    name="phone_number"
                                    value={form.data.phone_number}
                                    onChange={(e) => {
                                        form.setData(
                                            "phone_number",
                                            e.target.value,
                                        );
                                    }}
                                    className="w-full"
                                />
                                <InputError
                                    message={form.errors.phone_number}
                                />
                            </div>

                            <div className="space-y-1 w-full">
                                <InputLabel
                                    htmlFor="email"
                                    value="Email:"
                                    className="text-xs font-bold"
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
                        </div>

                        <div className="flex flex-col md:flex-row gap-2 items-center">
                            <div className="space-y-1 w-full">
                                <InputLabel
                                    htmlFor="password"
                                    value={
                                        mode === "edit"
                                            ? "Ganti Kata Sandi:"
                                            : "Kata Sandi:"
                                    }
                                    className="text-xs font-bold"
                                />
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    value={form.data.password}
                                    onChange={(e) =>
                                        form.setData("password", e.target.value)
                                    }
                                    className="w-full"
                                    required={mode === "create"}
                                    showInitially={mode === "edit"}
                                />
                                <InputError message={form.errors.password} />
                            </div>

                            <div className="space-y-1 w-full">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Konfirmasi Kata Sandi:"
                                    className="text-xs font-bold"
                                />
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    value={form.data.password_confirmation}
                                    onChange={(e) =>
                                        form.setData(
                                            "password_confirmation",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full"
                                    required={mode === "create"}
                                />
                                <InputError
                                    message={form.errors.password_confirmation}
                                />
                            </div>
                        </div>
                    </CardBody>

                    <CardFooter className="py-2 px-4 flex justify-end items-center gap-2 border-none">
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
