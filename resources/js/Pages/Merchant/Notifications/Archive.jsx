import { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import NotificationCard from "@/components/Common/NotificationCard";
import Checkbox from "@/components/Common/Checkbox";
import { Bell, Eye, Filter, Pin, Trash2 } from "lucide-react";
import IconButton from "@/components/Common/IconButton";
import DeleteModal from "@/components/Common/DeleteModal";
import Tippy from "@tippyjs/react";

export default function Archive() {
    const {
        merchant,
        notification_list: { data: notifications, links, meta },
    } = usePage().props;

    const hasUnread = notifications.some((n) => !n.is_read);

    const [isProcessing, setIsProcessing] = useState(false);

    const [selectedNotifications, setSelectedNotifications] = useState([]);

    const toggleSelectAll = (e) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            setSelectedNotifications(notifications.map((n) => n.id));
        } else {
            setSelectedNotifications([]);
        }
    };

    const toggleSelectOne = (id) => {
        setSelectedNotifications((prev) =>
            prev.includes(id)
                ? prev.filter((nid) => nid !== id)
                : [...prev, id],
        );
    };

    const applyAction = (action, id = null) => {
        const idsToProcess = id ? [id] : selectedNotifications;

        if (idsToProcess.length === 0) {
            return;
        }

        setIsProcessing(true);

        router.post(
            route("merchant.notifications.bulkAction"),
            {
                ids: idsToProcess,
                action: action,
            },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    if (!id) setSelectedNotifications([]);
                    closeDeleteModal();
                },
                onError: (errors) => {},
                onFinish: () => {
                    setIsProcessing(false);
                },
            },
        );
    };

    const handleNotificationClick = (id) => {
        if (isProcessing) return;
        router.post(route("merchant.notifications.markAsRead", id));
    };

    const handleMarkAllRead = () => {
        setIsProcessing(true);
        router.post(
            route("merchant.notifications.markAllRead"),
            {},
            {
                preserveScroll: true,
                onFinish: () => setIsProcessing(false),
            },
        );
    };

    const [confirmDelete, setConfirmDelete] = useState({
        show: false,
        id: null,
    });

    const confirmAction = (id = null) => {
        setConfirmDelete({
            show: true,
            id: id,
        });
    };

    const handleConfirmDelete = () => {
        applyAction("delete", confirmDelete.id);
    };

    const closeDeleteModal = () => {
        if (isProcessing) return;
        setConfirmDelete({ show: false, id: null });
    };

    return (
        <MerchantLayout>
            <Head
                title={`Daftar Notifikasi - ${merchant?.name || "Merchant"}`}
            />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Arsip Notifikasi</span>
                            </div>
                            <div className="text-sm text-secondary-600 dark:text-secondary-400">
                                <span>Mitra </span>
                                <span>{merchant.name}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="py-4 md:py-6 px-0 min-h-[280px] sm:min-h-[310px] flex flex-col">
                    <div className="py-2 flex-1 overflow-visible overflow-x-auto">
                        <div className="py-2 px-6 md:px-12 flex flex-col-reverse md:flex-row gap-2 items-center">
                            {selectedNotifications.length > 0 && (
                                <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-4 justify-start items-start md:items-center">
                                    <div className="flex flex-row gap-2">
                                        <Checkbox
                                            tooltip="Pilih Semua Notifikasi"
                                            checked={
                                                notifications.length > 0 &&
                                                selectedNotifications.length ===
                                                    notification.length
                                            }
                                            indeterminate={
                                                selectedNotifications.length >
                                                    0 &&
                                                selectedNotifications.length <
                                                    notifications.length
                                            }
                                            onChange={toggleSelectAll}
                                        />
                                        <span className="text-xs font-medium text-primary-600 dark:text-primary-400 whitespace-nowrap">
                                            {selectedNotifications.length}{" "}
                                            terpilih
                                        </span>
                                    </div>
                                    <div className="hidden md:block h-4 w-[1px] bg-secondary-300 dark:bg-secondary-600"></div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant="success"
                                            size="xs"
                                            tooltip="Tandai Dibaca Notifikasi Yang Dipilih"
                                            onClick={() => applyAction("read")}
                                            disabled={isProcessing}
                                            className="p-1 px-2 flex gap-1 items-center text-[10px] rounded-md"
                                        >
                                            {" "}
                                            <Eye size={12} />
                                            Tandai Dibaca
                                        </Button>
                                        <Button
                                            variant="info"
                                            size="xs"
                                            tooltip="Arsipkan Notifikasi Yang Dipilih"
                                            onClick={() =>
                                                applyAction("archive")
                                            }
                                            disabled={isProcessing}
                                            className="p-1 px-2 flex gap-1 items-center text-[10px] rounded-md"
                                        >
                                            <Archive size={12} />
                                            Tandai Arsip
                                        </Button>
                                        <Button
                                            variant="warning"
                                            size="xs"
                                            tooltip="Pin Notifikasi Yang Dipilih"
                                            onClick={() => applyAction("pin")}
                                            disabled={isProcessing}
                                            className="p-1 px-2 flex gap-1 items-center text-[10px] rounded-md"
                                        >
                                            {" "}
                                            <Pin size={12} />
                                            Tandai Pin
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="xs"
                                            tooltip="Hapus Notifikasi Yang Dipilih"
                                            onClick={() => confirmAction()}
                                            disabled={isProcessing}
                                            className="p-1 px-2 flex gap-1 items-center text-[10px] rounded-md"
                                        >
                                            {" "}
                                            <Trash2 size={12} />
                                            Tandai Hapus
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {notifications.length > 0 && (
                                <div className="ms-auto flex flex-row gap-2 items-center">
                                    {selectedNotifications.length === 0 && (
                                        <Button
                                            variant="success"
                                            size="xs"
                                            onClick={handleMarkAllRead}
                                            disabled={
                                                isProcessing || !hasUnread
                                            }
                                            className="px-2 py-1.5 rounded-md text-xs"
                                        >
                                            {isProcessing
                                                ? "Memproses..."
                                                : "Semua Dibaca"}
                                        </Button>
                                    )}
                                    <IconButton
                                        variant="primary"
                                        size="xs"
                                        tooltip="Filter"
                                        className="rounded-md"
                                    >
                                        <Filter size={12} />
                                    </IconButton>
                                </div>
                            )}
                        </div>

                        <div className="py-2 px-2 md:px-8 flex flex-col max-h-[60vh] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map((n, i) => (
                                    <Tippy
                                        key={n.id || i}
                                        content={
                                            n.is_read
                                                ? "Lihat detail"
                                                : "Tandai sudah dibaca"
                                        }
                                        disabled={
                                            isProcessing ||
                                            selectedNotifications.includes(n.id)
                                        }
                                        placement="top"
                                        delay={[500, 0]}
                                    >
                                        <div
                                            onClick={() =>
                                                handleNotificationClick(n.id)
                                            }
                                            className="cursor-pointer transition"
                                        >
                                            <NotificationCard
                                                key={n.data.id}
                                                title={n.data.title}
                                                type={n.data.type}
                                                message={n.data.message}
                                                time={n.created_at_human}
                                                isRead={n.is_read}
                                                className="w-full"
                                                checked={selectedNotifications.includes(
                                                    n.id,
                                                )}
                                                isProcessing={isProcessing}
                                                onChange={() =>
                                                    toggleSelectOne(n.id)
                                                }
                                                onArchive={() =>
                                                    applyAction("archive", n.id)
                                                }
                                                onPin={() =>
                                                    applyAction(
                                                        n.is_pinned
                                                            ? "unpin"
                                                            : "pin",
                                                        n.id,
                                                    )
                                                }
                                                onDelete={() =>
                                                    confirmAction(n.id)
                                                }
                                            />
                                        </div>
                                    </Tippy>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="bg-secondary-100 dark:bg-secondary-800 p-4 rounded-full mb-4">
                                        <Bell className="w-8 h-8 text-secondary-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                                        Tidak ada Arsip Notifikasi
                                    </h3>
                                    <p className="text-sm text-secondary-500 dark:text-secondary-400 max-w-xs mx-auto">
                                        Semua notifikasi Anda belum diarsipkan.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end"></CardFooter>
            </Card>
            <DeleteModal
                show={confirmDelete.show}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                isProcessing={isProcessing}
                title="Hapus Notifikasi"
                description={
                    confirmDelete.id
                        ? "Apakah Anda yakin ingin menghapus notifikasi ini?"
                        : `Apakah Anda yakin ingin menghapus ${selectedNotifications.length} notifikasi yang dipilih?`
                }
                confirmText="Hapus Sekarang"
            />
        </MerchantLayout>
    );
}
