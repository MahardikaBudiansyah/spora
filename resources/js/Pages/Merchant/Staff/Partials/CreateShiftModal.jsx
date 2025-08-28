import { useState, useEffect, useRef } from "react";
import Modal from "@/components/Common/Modal";
import CloseButtonModal from "@/components/common/CloseButtonModal";
import Button from "@/components/common/Button";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Table from "@/components/Common/Table";
import axios from "axios";
import { toast } from "react-toastify";
import TextInput from "@/components/Common/TextInput";
import TimeInput from "@/components/Common/TimeInput";
import BannerAlert from "@/components/Common/BannerAlert";
import { Info, X } from "lucide-react";

export default function CreateShiftModal({
    show,
    onClose,
    initialShifts = [],
}) {
    const [processing, setProcessing] = useState(false);
    const [shifts, setShifts] = useState(
        Array.isArray(initialShifts) ? initialShifts : []
    );
    const inputRefs = useRef({});
    const [showBanner, setShowBanner] = useState(true);
    const [confirmDelete, setConfirmDelete] = useState({}); // { [shiftId]: true/false }

    useEffect(() => {
        if (show) setShifts(initialShifts);
    }, [show, initialShifts]);

    const handleAddShift = () => {
        const newShift = {
            id: Date.now(),
            name: "",
            start_time: "",
            end_time: "",
            isNew: true,
        };
        setShifts((prev) => [...prev, newShift]);
        setTimeout(() => {
            inputRefs.current[newShift.id]?.focus();
        }, 50);
    };

    const handleDelete = async (shift) => {
        try {
            await axios.delete(
                route("merchant.shift.destroy", { shift: shift.id })
            );
            setShifts((prev) => prev.filter((s) => s.id !== shift.id));
            toast.success("Shift berhasil dihapus.");
        } catch (err) {
            toast.error("Gagal menghapus shift.");
        } finally {
            setConfirmDelete((prev) => ({ ...prev, [shift.id]: false }));
        }
    };

    const handleChange = (index, key, value) => {
        setShifts((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [key]: value };
            return copy;
        });
    };

    const handleSaveAll = async () => {
        const validShifts = shifts.filter(
            (s) => s.isNew && s.name.trim() && s.start_time && s.end_time
        );
        if (!validShifts.length) {
            toast.error("Tidak ada shift baru yang valid untuk disimpan.");
            return;
        }

        const invalidShift = validShifts.find(
            (s) => s.start_time === s.end_time
        );
        if (invalidShift) {
            toast.error(
                `Shift "${invalidShift.name}" start dan end time tidak boleh sama.`
            );
            return;
        }

        setProcessing(true);
        try {
            await Promise.all(
                validShifts.map((shift) =>
                    axios.post(route("merchant.shift.store"), shift)
                )
            );
            toast.success("Shift baru berhasil disimpan!");
            setShifts((prev) => prev.map((s) => ({ ...s, isNew: false })));
        } catch (err) {
            toast.error("Beberapa shift gagal disimpan.");
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const columns = [
        {
            key: "number",
            header: "#",
            className: "text-center content-center",
            render: (_, __, i) => (i + 1).toString(),
        },
        {
            key: "name",
            header: "NAMA SHIFT",
            className: "content-center",
            render: (_, row, i) =>
                row.isNew ? (
                    <TextInput
                        ref={(el) => (inputRefs.current[row.id] = el)}
                        value={row.name}
                        onChange={(e) =>
                            handleChange(i, "name", e.target.value)
                        }
                        placeholder="Nama Shift"
                        className="py-1"
                    />
                ) : (
                    <span>{row.name}</span>
                ),
        },
        {
            key: "start_time",
            header: "SHIFT DIMULAI",
            className: "text-center content-center",
            render: (_, row, i) =>
                row.isNew ? (
                    <TimeInput
                        value={row.start_time}
                        onChange={(e) =>
                            handleChange(i, "start_time", e.target.value)
                        }
                        className="py-1 text-center content-center"
                    />
                ) : (
                    <span>{row.start_time}</span>
                ),
        },
        {
            key: "end_time",
            header: "SHIFT BERAKHIR",
            className: "text-center content-center",
            render: (_, row, i) =>
                row.isNew ? (
                    <TimeInput
                        value={row.end_time}
                        onChange={(e) =>
                            handleChange(i, "end_time", e.target.value)
                        }
                        className="py-1 text-center content-center"
                    />
                ) : (
                    <span>{row.end_time}</span>
                ),
        },
        {
            key: "action",
            header: "AKSI",
            className: "text-center content-center",
            render: (_, row) =>
                confirmDelete[row.id] ? (
                    <div className="flex gap-1 justify-center">
                        <Button
                            variant="danger"
                            size="xs"
                            onClick={() => handleDelete(row)}
                        >
                            Yakin
                        </Button>
                        <Button
                            variant="light"
                            size="xs"
                            onClick={() =>
                                setConfirmDelete((prev) => ({
                                    ...prev,
                                    [row.id]: false,
                                }))
                            }
                        >
                            Batal
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="danger"
                        size="xs"
                        onClick={() =>
                            setConfirmDelete((prev) => ({
                                ...prev,
                                [row.id]: true,
                            }))
                        }
                    >
                        Hapus
                    </Button>
                ),
        },
    ];

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl" className="p-4">
            <Card className="relative border-none shadow-none text-gray-700 dark:text-gray-100">
                <CloseButtonModal onClose={onClose} />
                <CardHeader className="border-none">
                    <div className="text-lg font-semibold mt-2">
                        Tambah Shift Kerja untuk Merchant Anda
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <div className="mt-2 flex gap-2">
                            <Button
                                type="button"
                                variant="success"
                                onClick={handleAddShift}
                            >
                                + Tambah Shift
                            </Button>
                        </div>
                        {showBanner && (
                            <BannerAlert
                                type="error"
                                className="flex flex-row justify-between items-center"
                            >
                                <div className="flex items-center gap-2">
                                    <Info className="w-5" />
                                    Setelah shift kerja disimpan tidak akan bisa
                                    diperbarui kembali kecuali dihapus!
                                </div>
                                <button onClick={() => setShowBanner(false)}>
                                    <X className="w-4 h-4 cursor-pointer hover:text-blue-700 " />
                                </button>
                            </BannerAlert>
                        )}
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            <Table
                                columns={columns}
                                data={shifts}
                                rowKey={(row) => row.id}
                                wrapperClassName="rounded-none border-none"
                            />
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="p-4 border-none flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleSaveAll}
                        disabled={processing || !shifts.some((s) => s.isNew)}
                    >
                        {processing ? "Menyimpan..." : "Simpan Semua"}
                    </Button>
                    <Button
                        variant="light"
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 text-sm"
                    >
                        Kembali
                    </Button>
                </CardFooter>
            </Card>
        </Modal>
    );
}
