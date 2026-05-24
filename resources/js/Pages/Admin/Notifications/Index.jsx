import { Head, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import NotificationCard from "@/components/Common/NotificationCard";
import Checkbox from "@/components/Common/Checkbox";
import { Archive, Bell, Eye, Pin, PinOff, Trash2 } from "lucide-react";
import DeleteModal from "@/components/Common/DeleteModal";
import Tippy from "@tippyjs/react";
import Tabs from "@/components/Common/Tabs";
import AdminTransactionNotification from "@/features/notifications/components/contents/AdminTransactionNotification";
import AdminUpdateNotification from "@/features/notifications/components/contents/AdminUpdateNotification";
import { useAdminNotification } from "@/features/notifications/hooks/useAdminNotification";

export default function Index() {
    const { admin } = usePage().props;

    const adminNotification = useAdminNotification();

    const notificationTabs = [
        {
            id: "transactions",
            label: "Transaksi",
        },
        {
            id: "updates",
            label: "Update",
        },
    ];

    return (
        <AdminLayout>
            <Head title={`Kelola Notifikasi - ${admin?.name || "Admin"}`} />
            <div className="mt-2 mb-4 px-4 md:px-2">
                <h1 className="text-2xl font-bold">Notifikasi</h1>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 font-semibold">
                    Kelola Pemberitahuan Admin{" "}
                    <span className="text-primary-500">{admin.name}</span>
                </p>
            </div>
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="pt-4 pb-0 mb-0 border-none">
                    <Tabs
                        tabs={notificationTabs}
                        onChange={(idx, tab) =>
                            adminNotification.setActiveCategory(tab.id)
                        }
                    />
                </CardHeader>
                <CardBody className="py-4 md:py-0 px-0 min-h-[280px] sm:min-h-[310px] flex flex-col">
                    {adminNotification.activeCategory === "transactions" ? (
                        <AdminTransactionNotification
                            activeFilter={adminNotification.transSubFilter}
                            setFilter={adminNotification.setTransSubFilter}
                            getCount={adminNotification.getCount}
                        />
                    ) : (
                        <AdminUpdateNotification
                            activeFilter={adminNotification.subFilter}
                            setFilter={adminNotification.setSubFilter}
                            getCount={adminNotification.getCount}
                        />
                    )}

                    <div className="py-2 flex-1 overflow-visible overflow-x-auto">
                        <div className="py-2 px-6 md:px-12 flex flex-col-reverse md:flex-row gap-2 items-center">
                            {adminNotification.selectedNotifications.length >
                                0 && (
                                <div className="flex flex-col-reverse md:flex-row gap-2 md:gap-4 justify-start items-start md:items-center">
                                    <div className="flex flex-row gap-2">
                                        <Checkbox
                                            tooltip="Pilih Semua Notifikasi"
                                            checked={
                                                adminNotification
                                                    .filteredNotifications
                                                    .length > 0 &&
                                                adminNotification
                                                    .selectedNotifications
                                                    .length ===
                                                    adminNotification
                                                        .filteredNotifications
                                                        .length
                                            }
                                            onChange={
                                                adminNotification.toggleSelectAll
                                            }
                                        />
                                        <span className="text-xs font-medium text-primary-600 dark:text-primary-400 whitespace-nowrap">
                                            {
                                                adminNotification
                                                    .selectedNotifications
                                                    .length
                                            }{" "}
                                            terpilih
                                        </span>
                                    </div>
                                    <div className="hidden md:block h-4 w-[1px] bg-secondary-300 dark:bg-secondary-600"></div>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant="success"
                                            size="xs"
                                            tooltip="Tandai Dibaca Notifikasi Yang Dipilih"
                                            onClick={() =>
                                                adminNotification.applyAction(
                                                    "read",
                                                )
                                            }
                                            disabled={
                                                adminNotification.isProcessing
                                            }
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
                                                adminNotification.applyAction(
                                                    "archive",
                                                )
                                            }
                                            disabled={
                                                adminNotification.isProcessing
                                            }
                                            className="p-1 px-2 flex gap-1 items-center text-[10px] rounded-md"
                                        >
                                            <Archive size={12} />
                                            Tandai Arsip
                                        </Button>
                                        <Button
                                            variant="warning"
                                            size="xs"
                                            tooltip={
                                                adminNotification.bulkPinStatus
                                                    .allPinned
                                                    ? "Lepas Pin Terpilih"
                                                    : "Pin Terpilih"
                                            }
                                            onClick={() =>
                                                adminNotification.applyAction(
                                                    "pin",
                                                )
                                            }
                                            disabled={
                                                adminNotification.isProcessing
                                            }
                                            className="p-1 px-2 flex gap-1 items-center text-[10px] rounded-md"
                                        >
                                            {adminNotification.bulkPinStatus
                                                .allPinned ? (
                                                <>
                                                    <PinOff size={12} />
                                                    Lepas Pin
                                                </>
                                            ) : (
                                                <>
                                                    <Pin
                                                        size={12}
                                                        className="rotate-45"
                                                    />
                                                    Tandai Pin
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="xs"
                                            tooltip="Hapus Notifikasi Yang Dipilih"
                                            onClick={() =>
                                                adminNotification.confirmAction()
                                            }
                                            disabled={
                                                adminNotification.isProcessing
                                            }
                                            className="p-1 px-2 flex gap-1 items-center text-[10px] rounded-md"
                                        >
                                            {" "}
                                            <Trash2 size={12} />
                                            Tandai Hapus
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {adminNotification.filteredNotifications.length >
                                0 && (
                                <div className="ms-auto flex flex-row gap-2 items-center">
                                    {adminNotification.selectedNotifications
                                        .length === 0 && (
                                        <Button
                                            variant="success"
                                            size="xs"
                                            onClick={() =>
                                                adminNotification.applyAction(
                                                    "read",
                                                    adminNotification.filteredNotifications.map(
                                                        (n) => n.id,
                                                    ),
                                                )
                                            }
                                            disabled={
                                                adminNotification.isProcessing ||
                                                !adminNotification.filteredNotifications.some(
                                                    (n) => !n.is_read,
                                                )
                                            }
                                            className="px-2 py-1.5 rounded-md text-xs"
                                        >
                                            {adminNotification.isProcessing
                                                ? "Memproses..."
                                                : "Semua Dibaca"}
                                        </Button>
                                    )}
                                    {/*  <IconButton
                                        variant="primary"
                                        size="xs"
                                        tooltip="Filter"
                                        className="rounded-md"
                                    >
                                        <Filter size={12} />
                                    </IconButton> */}
                                </div>
                            )}
                        </div>

                        <div className="py-2 px-2 md:px-8 flex flex-col  overflow-y-auto">
                            {adminNotification.filteredNotifications.length >
                            0 ? (
                                adminNotification.filteredNotifications.map(
                                    (n, i) => (
                                        <Tippy
                                            key={n.id || i}
                                            content={
                                                n.is_read
                                                    ? "Lihat detail"
                                                    : "Tandai sudah dibaca"
                                            }
                                            disabled={
                                                adminNotification.isProcessing ||
                                                adminNotification.selectedNotifications.includes(
                                                    n.id,
                                                )
                                            }
                                            placement="top"
                                            delay={[500, 0]}
                                        >
                                            <div
                                                onClick={() =>
                                                    adminNotification.handleNotificationClick(
                                                        n.id,
                                                    )
                                                }
                                                className="cursor-pointer transition"
                                            >
                                                <NotificationCard
                                                    key={n.id}
                                                    title={n.data.title}
                                                    type={n.data.type}
                                                    message={n.data.message}
                                                    category={n.category}
                                                    source={n.source}
                                                    time={n.created_at_human}
                                                    isRead={n.is_read}
                                                    isPinned={n.is_pinned}
                                                    className="w-full"
                                                    checked={adminNotification.selectedNotifications.includes(
                                                        n.id,
                                                    )}
                                                    isProcessing={
                                                        adminNotification.isProcessing
                                                    }
                                                    onChange={() =>
                                                        adminNotification.toggleSelectOne(
                                                            n.id,
                                                        )
                                                    }
                                                    onArchive={() =>
                                                        adminNotification.applyAction(
                                                            "archive",
                                                            n.id,
                                                        )
                                                    }
                                                    onPin={() =>
                                                        adminNotification.applyAction(
                                                            n.is_pinned
                                                                ? "unpin"
                                                                : "pin",
                                                            n.id,
                                                        )
                                                    }
                                                    onDelete={() =>
                                                        adminNotification.confirmAction(
                                                            n.id,
                                                        )
                                                    }
                                                />
                                            </div>
                                        </Tippy>
                                    ),
                                )
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8 text-center">
                                    <div className="bg-secondary-100 dark:bg-secondary-800 p-4 rounded-full mb-4">
                                        <Bell className="w-8 h-8 text-secondary-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                                        Tidak ada notifikasi
                                    </h3>
                                    <p className="text-sm text-secondary-500 dark:text-secondary-400 max-w-xs mx-auto">
                                        Belum ada pemberitahuan terbaru saat
                                        ini.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end"></CardFooter>
            </Card>
            <DeleteModal
                show={adminNotification.confirmDelete.show}
                onClose={adminNotification.closeDeleteModal}
                onConfirm={adminNotification.confirmAction}
                isProcessing={adminNotification.isProcessing}
                title="Hapus Notifikasi"
                description={
                    adminNotification.confirmDelete.id
                        ? "Apakah Anda yakin ingin menghapus notifikasi ini?"
                        : `Apakah Anda yakin ingin menghapus ${adminNotification.selectedNotifications.length} notifikasi yang dipilih?`
                }
                confirmText="Hapus Sekarang"
            />
        </AdminLayout>
    );
}
