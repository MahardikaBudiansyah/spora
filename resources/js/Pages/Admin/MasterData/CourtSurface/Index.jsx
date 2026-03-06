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
import { formatFullDate } from "@/utils/date";
import useInlineEditing from "@/hooks/useInlineEditing";
import InlineEditingCell from "@/components/Common/InlineEditingCell";
import axios from "axios";

export default function Index() {
    const { court_surfaces = [] } = usePage().props;

    const [rows, setRows] = useState(court_surfaces.data || []);
    const [focusedRow, setFocusedRow] = useState(null);
    const [focusedCourt, setFocusedCourt] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedCourtSurface, setSelectedCourtSurface] = useState(null);
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
            route("admin.master-data.court-surfaces.inline-update", { id }),
        debounce: 400,
    });

    // -----------------------------
    // DELETE
    // -----------------------------
    const handleDelete = (row) => {
        setSelectedCourtSurface(row);
        setShowModal(true);
    };

    const deleteCourtSurface = () => {
        if (!selectedCourtSurface) return;

        router.delete(
            route("admin.master-data.court-surfaces.destroy", {
                id: selectedCourtSurface.id,
            }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Data berhasil dihapus!");
                    setShowModal(false);

                    // 🔥 Hapus dari state `rows`
                    setRows((prev) =>
                        prev.filter((r) => r.id !== selectedCourtSurface.id)
                    );

                    setSelectedCourtSurface(null);
                },
            }
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
                route("admin.master-data.court-surfaces.store"),
                { name: row.name }
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
                        : r
                )
            );
        } catch (err) {
            console.error(err);
        } finally {
            setSavingNew(false);
        }
    };

    const handleNewRowChange = (rowId, court, value) => {
        setRows((prev) => {
            const updated = prev.map((r) =>
                r.id === rowId ? { ...r, [court]: value } : r
            );
            const newRow = updated.find((r) => r.id === rowId);

            if (newRow.isNew && !savingNew) {
                const hasValue = (newRow.name || "").trim() !== "";
                if (hasValue) saveNewRow(newRow);
            }

            return updated;
        });
    };

    // -----------------------------
    // TABLE COLUMNS
    // -----------------------------
    const columns = [
        { key: "index", header: "#", className: "text-center content-center" },
        {
            key: "name",
            header: "Nama Kategori",
            editable: true,
            inputType: "text",
            className: "text-center content-center",
        },
        {
            key: "created_at",
            header: "Tanggal Ditambahkan",
            className: "text-center content-center",
        },
        {
            key: "updated_at",
            header: "Tanggal Diperbarui",
            className: "text-center content-center",
        },
        {
            key: "action",
            header: "Aksi",
            className: "text-center content-center",
        },
    ];

    return (
        <AdminLayout>
            <Head title="Kelola Tipe Lapangan" />

            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader>
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Kelola Tipe Lapangan
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
                                            created_at: null,
                                            updated_at: null,
                                            isNew: true,
                                        },
                                        ...prev,
                                    ])
                                }
                            >
                                Tambah Data Tipe
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="px-0 pb-8">
                    <Table
                        columns={columns}
                        data={rows}
                        wrapperClassName="border-none rounded-none shadow-none"
                        tableClassName="text-xs"
                        renderCell={(col, row, rowIndex) => {
                            // 1️⃣ KOLOM INDEX
                            if (col.key === "index") {
                                const from = Number(court_surfaces?.from ?? 0);
                                const indexValue = from + rowIndex; // ✅ hapus +1
                                return String(indexValue);
                            }

                            // 2️⃣ KOLOM CREATED/UPDATED
                            if (
                                col.key === "created_at" ||
                                col.key === "updated_at"
                            ) {
                                return formatFullDate(row[col.key]) || "-";
                            }

                            // 3️⃣ KOLOM ACTION
                            if (col.key === "action") {
                                return (
                                    <div className="flex gap-2 justify-center">
                                        <Button
                                            type="button"
                                            variant="danger"
                                            size="xs"
                                            onClick={() => handleDelete(row)}
                                        >
                                            Hapus
                                        </Button>
                                    </div>
                                );
                            }

                            // 4️⃣ KOLOM EDITABLE
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
                                                    val
                                                );
                                            else handleChange(id, key, val);
                                        }}
                                        handleBlur={handleBlur}
                                        focusedField={focusedCourt}
                                        setFocusedField={setFocusedCourt}
                                        savingCell={savingCell}
                                        successCell={successCell}
                                        errorCell={errorCell}
                                    />
                                );
                            }

                            // 5️⃣ DEFAULT
                            return row[col.key] ?? "";
                        }}
                        emptyState={
                            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                Tidak ada data Tipe Lapangan.
                            </div>
                        }
                    />

                    <Pagination
                        links={court_surfaces.links}
                        meta={court_surfaces}
                        className="p-6 my-2"
                    />
                </CardBody>

                {showModal && selectedCourtSurface && (
                    <DeleteModal
                        show={showModal}
                        onClose={() => setShowModal(false)}
                        onDelete={deleteCourtSurface}
                        title="Hapus Data Tipe Lapangan"
                        description={`Yakin ingin menghapus data kategori "${selectedCourtSurface.name}"?`}
                    />
                )}
            </Card>
        </AdminLayout>
    );
}
