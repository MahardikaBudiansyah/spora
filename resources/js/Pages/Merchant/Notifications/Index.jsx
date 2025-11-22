import { useState } from "react";
import { Head } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import { Card, CardHeader, CardBody } from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import SearchInput from "@/components/Common/SearchInput";
import { Filter } from "lucide-react";
import NotificationCard from "@/components/Common/NotificationCard";
import Checkbox from "@/components/Common/Checkbox";

export default function Index() {
    const notifications = [
        {
            id: 1,
            title: "Booking diterima",
            message: "Booking lapangan futsal berhasil dibuat",
            time: "21-11-2025 19:00",
            isRead: false,
        },
        {
            id: 2,
            title: "Pembayaran berhasil",
            message: "Pembayaran Anda telah diverifikasi",
            time: "20-11-2025 15:30",
            isRead: true,
        },
    ];

    const [selectedNotifications, setSelectedNotifications] = useState([]);

    const toggleSelectAll = (checked) => {
        if (checked) setSelectedNotifications(notifications.map((n) => n.id));
        else setSelectedNotifications([]);
    };

    const toggleSelectOne = (id, checked) => {
        if (checked) setSelectedNotifications((prev) => [...prev, id]);
        else
            setSelectedNotifications((prev) =>
                prev.filter((nid) => nid !== id)
            );
    };

    const applyAction = (action) => {
        if (selectedNotifications.length === 0) return;
        console.log("Apply action", action, "on", selectedNotifications);
        setSelectedNotifications([]);
    };

    return (
        <MerchantLayout>
            <Head title="Notifikasi" />
            <Card>
                <CardHeader>
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Notifikasi Aktif
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="px-0 pb-8">
                    {/* Toolbar */}
                    <div className="py-4 px-12 flex flex-row justify-between items-center">
                        <div className="flex flex-row gap-4 justify-start items-center">
                            {/* Checkbox all */}
                            <Checkbox
                                checked={
                                    selectedNotifications.length ===
                                        notifications.length &&
                                    notifications.length > 0
                                }
                                onChange={toggleSelectAll}
                            />
                            {/* Action buttons */}
                            {selectedNotifications.length > 0 && (
                                <>
                                    <Button
                                        variant="success"
                                        size="xs"
                                        onClick={() => applyAction("read")}
                                    >
                                        Tandai dibaca
                                    </Button>
                                    <Button
                                        variant="info"
                                        size="xs"
                                        onClick={() => applyAction("archive")}
                                    >
                                        Tandai Arsip
                                    </Button>
                                    <Button
                                        variant="warning"
                                        size="xs"
                                        onClick={() => applyAction("pin")}
                                    >
                                        Tandai Pin
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="xs"
                                        onClick={() => applyAction("delete")}
                                    >
                                        Tandai Hapus
                                    </Button>
                                </>
                            )}
                        </div>

                        <div className="flex flex-row gap-4 justify-start items-center">
                            <SearchInput />
                            <Button variant="primary" className="p-2">
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* List notifikasi */}
                    <div className="py-4 px-8 flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
                        {notifications.map((n) => (
                            <NotificationCard
                                key={n.id}
                                title={n.title}
                                message={n.message}
                                time={n.time}
                                isRead={n.isRead}
                                onDelete={() => console.log("hapus", n.id)}
                                className="w-full"
                                checked={selectedNotifications.includes(n.id)}
                                onChange={(checked) =>
                                    toggleSelectOne(n.id, checked)
                                }
                            />
                        ))}
                    </div>
                </CardBody>
            </Card>
        </MerchantLayout>
    );
}
