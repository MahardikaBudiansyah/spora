import { useState } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { toast } from "react-toastify";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import Pagination from "@/components/common/Pagination";
import DeleteModal from "@/components/common/DeleteModal";
import { formatFullDate, formatFullDateTime } from "@/utils/date";
import useInlineEditing from "@/hooks/useInlineEditing";
import InlineEditingCell from "@/components/Common/InlineEditingCell";
import axios from "axios";

export default function Index() {
    const { venue_facilities = [] } = usePage().props;

    console.log(venue_facilities);

    const [rows, setRows] = useState(venue_facilities.data || []);
    const [focusedRow, setFocusedRow] = useState(null);
    const [focusedFacility, setFocusedFacility] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedVenueFacility, setSelectedVenueFaciity] = useState(null);
    const [savingNew, setSavingNew] = useState(false);

    // -----------------------------
    // INLINE EDITING HOOK
    // -----------------------------
    const {
        tempValues,
        handleChange,
        handleBlur,
        savingCell,
        successCell,
        errorCell,
    } = useInlineEditing({
        endpoint: (id) =>
            route("admin.master-data.venue-facilities.inline-update", { id }),
        debounce: 400,
    });

    const handleEdit = () => {};

    const handleDelete = (row) => {
        setSelectedVenueFaciity(row);
        setShowModal(true);
    };

    const deleteVenueFacility = () => {
        if (!selectedVenueFacility) return;

        router.delete(
            route("admin.master-data.venue-facilities.destroy", {
                id: selectedVenueFacility.id,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data berhasil dihapus!");
                    setShowModal(false);

                    // 🔥 Hapus dari state `rows`
                    setRows((prev) =>
                        prev.filter((r) => r.id !== selectedVenueFacility.id),
                    );

                    setSelectedVenueFaciity(null);
                },
            },
        );
    };

    // -----------------------------
    // AUTO SAVE ROW BARU
    // -----------------------------
    const saveNewRow = async (row) => {
        if (savingNew) return;
        setSavingNew(true);

        try {
            const response = await axios.post(
                route("admin.master-data.venue-facilities.store"),
                { name: row.name, label: row.label },
            );

            const saved = response.data;

            setRows((prev) =>
                prev.map((r) =>
                    r.id === row.id
                        ? {
                              ...r,
                              id: saved.id,
                              isNew: false,
                              created_at: saved.created_at,
                              updated_at: saved.updated_at,
                          }
                        : r,
                ),
            );
        } catch (err) {
            console.error(err);
        } finally {
            setSavingNew(false);
        }
    };

    const handleNewRowChange = (rowId, facility, value) => {
        setRows((prev) => {
            const updated = prev.map((r) =>
                r.id === rowId ? { ...r, [facility]: value } : r,
            );
            const newRow = updated.find((r) => r.id === rowId);

            if (newRow.isNew && !savingNew) {
                const hasValue =
                    (newRow.name || "").trim() !== "" ||
                    (newRow.label || "").trim() !== "";
                if (hasValue) saveNewRow(newRow);
            }

            return updated;
        });
    };

    // -----------------------------
    // TABLE COLUMNS
    // -----------------------------
    const columns = [
        {
            key: "number",
            header: "#",
            className: "text-center content-center",
            render: (_, __, index) => {
                const currentPage =
                    venue_facilities.current_page ||
                    venue_facilities.meta?.current_page ||
                    1;
                const perPage =
                    venue_facilities.per_page ||
                    venue_facilities.meta?.per_page ||
                    10;
                return (currentPage - 1) * perPage + index + 1;
            },
        },
        {
            key: "name",
            header: "Fasilitas",
            editable: true,
            inputType: "text",
            className: "text-left content-center",
        },
        {
            key: "icon",
            header: "Icon",
            editable: true,
            inputType: "text",
            render: (val, row) => (
                <div className="flex gap-2 justify-center">
                    <img
                        src={`/assets/icons/facilities/${row?.icon}`}
                        alt={row.name}
                        className="w-6 h-6 object-contain"
                    />
                </div>
            ),
            className: "text-left content-center",
        },
        {
            key: "created_at",
            header: "Tanggal Ditambahkan",
            render: (val, row) => formatFullDateTime(row.created_at) || "-",
            className: "text-center content-center whitespace-nowrap",
        },
        {
            key: "updated_at",
            header: "Tanggal Diperbarui",
            render: (val, row) => formatFullDateTime(row.updated_at) || "-",
            className: "text-center content-center whitespace-nowrap",
        },
        {
            key: "action",
            header: "Aksi",
            className: "text-center content-center",
            render: (val, row) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        variant="success"
                        size="xs"
                        onClick={() => handleEdit(row)}
                    >
                        Edit
                    </Button>
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

    return (
        <AdminLayout>
            <Head title="Kelola Kategori Lapangan" />

            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Kelola</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Fasilitas Venue
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                size="xs"
                                onClick={() =>
                                    setRows((prev) => [
                                        {
                                            id: `new-${Date.now()}`,
                                            name: "",
                                            label: "",
                                            created_at: null,
                                            updated_at: null,
                                            isNew: true,
                                        },
                                        ...prev,
                                    ])
                                }
                            >
                                + Tambah Fasilitas
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="py-4 md:py-6 px-0 min-h-[280px] sm:min-h-[310px] flex flex-col">
                    <div className="py-2 flex-1 overflow-visible overflow-x-auto">
                        <Table
                            columns={columns}
                            data={rows}
                            wrapperClassName="border-none rounded-none shadow-none"
                            tableClassName="text-xs"
                            renderCell={(col, row, rowIndex) => {
                                if (col.key === "index") {
                                    const from = Number(
                                        venue_facilities?.from ?? 0,
                                    );
                                    const indexValue = from + rowIndex;
                                    return String(indexValue);
                                }

                                if (
                                    col.key === "created_at" ||
                                    col.key === "updated_at"
                                ) {
                                    return formatFullDate(row[col.key]) || "-";
                                }

                                if (col.key === "action") {
                                    return (
                                        <div className="flex gap-2 justify-center">
                                            <Button
                                                type="button"
                                                variant="danger"
                                                size="xs"
                                                onClick={() =>
                                                    handleDelete(row)
                                                }
                                            >
                                                Hapus
                                            </Button>
                                        </div>
                                    );
                                }

                                if (col.editable) {
                                    const value =
                                        tempValues[`${row.id}-${col.key}`] ??
                                        row[col.key] ??
                                        "";
                                    return (
                                        <InlineEditingCell
                                            value={value}
                                            col={col}
                                            row={row}
                                            rowIndex={rowIndex}
                                            handleChange={(id, key, val) => {
                                                if (row.isNew)
                                                    handleNewRowChange(
                                                        id,
                                                        key,
                                                        val,
                                                    );
                                                else handleChange(id, key, val);
                                            }}
                                            handleBlur={handleBlur}
                                            focusedField={focusedFacility}
                                            setFocusedField={setFocusedFacility}
                                            savingCell={savingCell}
                                            successCell={successCell}
                                            errorCell={errorCell}
                                        />
                                    );
                                }

                                return row[col.key] ?? "";
                            }}
                            emptyState={
                                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                    Tidak ada data Kategori Lapangan.
                                </div>
                            }
                        />

                        <Pagination
                            links={venue_facilities.links}
                            meta={venue_facilities}
                            className="p-6 my-2"
                        />
                    </div>
                </CardBody>
                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end"></CardFooter>

                {showModal && selectedVenueFacility && (
                    <DeleteModal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        onDelete={deleteVenueFacility}
                        title="Hapus Data Kategori Lapangan"
                        description={`Yakin ingin menghapus data kategori "${selectedVenueFacility.name}"?`}
                    />
                )}
            </Card>
        </AdminLayout>
    );
}
