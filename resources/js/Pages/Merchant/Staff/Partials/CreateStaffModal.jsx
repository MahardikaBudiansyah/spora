import { useState, useEffect } from "react";
import { router, useForm } from "@inertiajs/react";
import { toast } from "react-toastify";
import Modal from "@/components/Common/Modal";
import CloseButtonModal from "@/components/common/CloseButtonModal";
import Button from "@/components/common/Button";
import Checkbox from "@/components/Common/Checkbox";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@/components/Common/Card";
import LabelInput from "@/components/Common/LabelInput";
import TextInput from "@/components/Common/TextInput";
import PhoneInput from "@/components/Common/PhoneInput";
import SelectInput from "@/components/Common/SelectInput";

export default function CreateStaffModal({ show, onClose, roles = [] }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        name: "",
        phone_number: "",
        email: "",
        password: "",
        role_id: "",
    });

    const staffRoleOptions = roles.map((role) => ({
        value: role.id,
        label: role.name,
    }));

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("merchant.staff.store"), {
            onSuccess: () => {
                toast.success("Staff berhasil ditambahkan");
                reset(); // reset form setelah sukses
                onClose();
            },
            onError: () => {
                toast.error("Gagal menambahkan staff");
            },
        });
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg" className="p-4">
            <Card className="relative border-none shadow-none text-gray-700 dark:text-gray-100 ">
                <CloseButtonModal onClose={onClose} />
                <form onSubmit={handleSubmit}>
                    <CardHeader className="border-none">
                        <div className="text-lg font-semibold my-2">
                            Tambah Staff untuk Merchant Anda
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-2">
                            <div className="flex flex-col md:flex-row gap-2 md:items-center">
                                <div className="md:w-1/3 flex flex-row md:justify-between gap-2 items-center">
                                    <LabelInput
                                        htmlFor="name"
                                        value="Nama Lengkap"
                                        className="font-bold"
                                    />
                                    <span>:</span>
                                </div>
                                <TextInput
                                    id="name"
                                    name="name"
                                    placeholder="Masukan nama lengkap"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    error={errors.name}
                                />
                            </div>
                            <div className="flex flex-col md:flex-row gap-2 md:items-center">
                                <div className="md:w-1/3 flex flex-row md:justify-between gap-2 items-center">
                                    <LabelInput
                                        htmlFor="role"
                                        value="Role"
                                        className="font-bold"
                                    />
                                    <span>:</span>
                                </div>
                                <SelectInput
                                    id="role"
                                    name="role"
                                    options={staffRoleOptions}
                                    value={data.role_id}
                                    onChange={(value) =>
                                        setData("role_id", value)
                                    }
                                    placeholder="Pilih role staff"
                                    isClearable={false}
                                    isSearchable={false}
                                />
                            </div>
                            <div className="flex flex-col md:flex-row gap-2 md:items-center">
                                <div className="md:w-1/3 flex flex-row md:justify-between gap-2 items-center">
                                    <LabelInput
                                        htmlFor="phone_number"
                                        value="Nomor Handphone"
                                        className="font-bold"
                                    />
                                    <span>:</span>
                                </div>
                                <PhoneInput
                                    id="phone_number"
                                    name="phone_number"
                                    placeholder="Masukan nomor staff"
                                    value={data.phone_number}
                                    onChange={(e) =>
                                        setData("phone_number", e.target.value)
                                    }
                                    error={errors.phone_number}
                                />
                            </div>
                            <div className="flex flex-col md:flex-row gap-2 md:items-center">
                                <div className="md:w-1/3 flex flex-row md:justify-between gap-2 items-center">
                                    <LabelInput
                                        htmlFor="email"
                                        value="Email"
                                        className="font-bold"
                                    />
                                    <span>:</span>
                                </div>
                                <TextInput
                                    id="email"
                                    name="email"
                                    placeholder="Masukan email staff"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    error={errors.email}
                                />
                            </div>
                            <div className="flex flex-col md:flex-row gap-2 md:items-center">
                                <div className="md:w-1/3 flex flex-row md:justify-between gap-2 items-center">
                                    <LabelInput
                                        htmlFor="password"
                                        value="Kata Sandi"
                                        className="font-bold"
                                    />
                                    <span>:</span>
                                </div>
                                <TextInput
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="********"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    error={errors.password}
                                />
                            </div>
                        </div>
                    </CardBody>
                    <CardFooter className="p-4 border-none flex justify-end gap-2">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={processing}
                        >
                            Simpan
                        </Button>
                        <Button
                            variant="light"
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-200 text-sm"
                        >
                            Batal
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </Modal>
    );
}
