import { useState, useEffect } from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";
import axios from "axios";
import useModal from "@/hooks/useModal";
import { toast } from "react-toastify";
import MerchantLayout from "@/Layouts/MerchantLayout";
import CreateRoleModal from "@/Pages/Merchant/Staff/Partials/CreateRoleModal";
import CreateShiftModal from "@/Pages/Merchant/Staff/Partials/CreateShiftModal";
import CreateStaffModal from "@/Pages/Merchant/Staff/Partials/CreateStaffModal";
import Pagination from "@/components/common/Pagination";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";

export default function Index() {
    const {
        staff: staffProps,
        globalRoles,
        merchantRoles,
        shifts: shiftsProps,
    } = usePage().props;
    const { isOpen, open, close } = useModal();
    const [staffState, setStaffState] = useState(staffProps);
    const [shiftsState] = useState(shiftsProps);
    const isRoleModalOpen = isOpen("RoleModal");
    const isShiftModalOpen = isOpen("ShiftModal");
    const isStaffModalOpen = isOpen("StaffModal");
    const [selectedRoles, setSelectedRoles] = useState([]);

    useEffect(() => {
        if (merchantRoles) {
            setSelectedRoles(merchantRoles.map((r) => Number(r.staff_role_id)));
        }
    }, [merchantRoles]);

    useEffect(() => {
        setStaffState(staffProps);
    }, [staffProps]);

    const handleSubmitRoles = (data) => {
        router.post(
            route("merchant.staff.syncMerchantRoles"),
            { roles: data },
            {
                onSuccess: () => {
                    toast.success("Role berhasil diperbarui");
                    close();
                },
                onError: () => toast.error("Gagal memperbarui role"),
            }
        );
    };

    const handleToggleStatus = (row) => {
        const newStatus = row.status === "active" ? "inactive" : "active";

        axios
            .patch(
                route("merchant.staff.updateStatus", { staff: row.username }),
                {
                    status: newStatus,
                }
            )
            .then((response) => {
                toast.success(`Status berhasil diubah menjadi ${newStatus}`);

                setStaffState((prev) => ({
                    ...prev,
                    data: prev.data.map((r) =>
                        r.id === row.id ? { ...r, status: newStatus } : r
                    ),
                }));
            })
            .catch((error) => {
                toast.error("Gagal mengubah status");
                console.error(error);
            });
    };

    const columns = [
        { key: "number", header: "#", className: "content-center text-center" },
        { key: "name", header: "Nama Staff", className: "content-center" },
        {
            key: "role",
            header: "Role",
            className: "content-center text-center",
            render: (val, row) => row.roles?.name || "-",
        },
        {
            key: "phone_number",
            header: "Nomor Staff",
            className: "content-center text-center",
        },
        {
            key: "status",
            header: "Status Staff",
            className: "content-center text-center",
            render: (val, row) => (
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={row.status === "active"}
                        onChange={() => handleToggleStatus(row)}
                    />
                    <div
                        className={`w-11 h-6 rounded-full relative transition-all
            ${row.status === "active" ? "bg-green-500" : "bg-red-500"}
            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary`}
                    >
                        <span
                            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md
                transition-transform
                ${row.status === "active" ? "translate-x-5" : "translate-x-0"}`}
                        ></span>
                    </div>
                    {/* Label dengan lebar tetap agar vertikal lurus */}
                    <span className="text-sm font-medium w-16">
                        {row.status === "active" ? "Active" : "Inactive"}
                    </span>
                </label>
            ),
        },
        {
            key: "updated_at",
            header: "Tanggal Pembaruan",
            className: "content-center text-center",
        },
        {
            key: "action",
            header: "Aksi",
            className: "content-center text-center",
            render: (val, row) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        variant="info"
                        size="xs"
                        onClick={() => handleInfo(row)}
                    >
                        Info
                    </Button>
                    <Button
                        variant="success"
                        size="xs"
                        onClick={() => handleEdit(row)}
                    >
                        Edit
                    </Button>
                    {row.roles?.name === "operator" && (
                        <Button
                            variant="warning"
                            size="xs"
                            onClick={() => handleAssignment(row)}
                        >
                            Penugasan
                        </Button>
                    )}
                    <Button
                        variant="danger"
                        size="xs"
                        onClick={() => handleDelete(row)}
                    >
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

    const handleInfo = (row) => {
        router.get(route("merchant.staff.show"));
    };

    const handleAssignment = (row) => {
        router.get(
            route("merchant.staff.operator.index", { staff: row.username })
        );
    };

    return (
        <MerchantLayout>
            <Head title="Staff" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader>
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">Staff</div>
                        <div className="flex flex-row gap-4">
                            <Button
                                variant="primary"
                                size="xs"
                                onClick={() => open("RoleModal")}
                            >
                                + Tambah/Edit Role
                            </Button>
                            <Button
                                variant="primary"
                                size="xs"
                                onClick={() => open("ShiftModal")}
                            >
                                + Tambah/Hapus Shift Kerja
                            </Button>
                            <Button
                                variant="primary"
                                size="xs"
                                onClick={() => {
                                    if (merchantRoles.length === 0) {
                                        open("RoleModal");
                                    } else {
                                        open("StaffModal");
                                    }
                                }}
                            >
                                + Tambah Staff
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="px-0 pb-8">
                    <Table
                        columns={columns}
                        data={staffState.data}
                        wrapperClassName="border-none rounded-none shadow-none"
                        tableClassName="text-xs items-center"
                        emptyState={
                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Tidak ada data Staff.
                            </div>
                        }
                    />
                    <Pagination
                        links={staffState.links}
                        meta={staffState}
                        className="p-6 my-2"
                    />
                </CardBody>
                <CardFooter className="my-8 p-8 flex justify-end gap-2"></CardFooter>
            </Card>

            <CreateRoleModal
                show={isRoleModalOpen}
                onClose={close}
                roles={globalRoles}
                selectedRoles={selectedRoles}
                setSelectedRoles={setSelectedRoles}
                onSubmit={handleSubmitRoles}
            />
            <CreateShiftModal
                show={isShiftModalOpen}
                onClose={close}
                initialShifts={shiftsState}
            />
            <CreateStaffModal
                show={isStaffModalOpen}
                onClose={close}
                roles={merchantRoles}
            />
        </MerchantLayout>
    );
}
