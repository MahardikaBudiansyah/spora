import { useState } from "react";
import { router } from "@inertiajs/react";
import { Card, CardBody } from "@/components/common/Card";
import BannerSection from "@/components/common/BannerSection";
import { Edit, KeyRound, Mail, User } from "lucide-react";
import { getAdminStatus } from "@/utils/attributes/adminAttribute";
import ProfileAvatar from "@/components/Common/ProfileAvatar";
import { toast } from "react-toastify";
import KebabDropdown from "@/components/dropdown/KebabDropdown";
import Button from "@/components/Common/Button";
import Badge from "@/components/Common/Badge";

export default function AdminProfileHeader({ admin, onEdit, onDelete }) {
    const role = admin?.role;
    const status = getAdminStatus(admin?.status);
    const isAdmin = admin?.role === "admin";

    const [isLoading, setIsLoading] = useState(false);

    const handleAvatarChange = (selected) => {
        const value = selected.value;
        if (!value) return;

        router.post(
            route("admin.profile.update.avatar"),
            {
                _method: "put",
                avatar_path: value,
            },
            {
                forceFormData: true,
                preserveScroll: true,
                onBefore: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
                onSuccess: () => toast.success("Avatar berhasil diperbarui"),
                onError: (err) =>
                    toast.error(err.avatar_path || "Gagal memperbarui avatar"),
            },
        );
    };

    const menuItems = [
        {
            label: "Edit Akun",
            onClick: () => onEdit("account"),
            icon: Edit,
            as: "button",
        },
        {
            label: "Ubah Password",
            onClick: () => onEdit("security"),
            icon: KeyRound,
            as: "button",
        },
        ...(isAdmin
            ? [
                  {
                      label: "Hapus Akun",
                      onClick: () => onDelete(),
                      icon: User,
                      as: "button",
                  },
              ]
            : []),
    ];

    return (
        <div className="relative">
            <BannerSection
                className="rounded-lg md:rounded-xl h-48"
                overlayClass="bg-black/20 rounded-lg md:rounded-xl"
            />
            <div className="flex flex-col md:flex-row gap-6 relative z-10 -mt-24 md:-mt-16 px-4 md:px-8">
                <Card className="w-full shadow-sm">
                    <CardBody className="p-5 flex flex-row justify-center md:justify-between">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                            <ProfileAvatar
                                src={admin.avatar_path}
                                user={{
                                    name: admin?.name,
                                }}
                                mode="picker"
                                size="3xl"
                                onChange={handleAvatarChange}
                                isLoading={isLoading}
                                className="shadow-none shrink-0"
                            />
                            <div className="flex-1 text-center md:text-left mb-2 w-full">
                                <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-2 mb-2">
                                    <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 dark:text-white leading-tight">
                                        {admin?.name}
                                    </h2>
                                    <div className="flex justify-center md:justify-start gap-2">
                                        <Badge
                                            color={status.color}
                                            className="flex items-center gap-1.5 px-2 py-1 font-bold whitespace-nowrap"
                                        >
                                            <span className="text-xs">
                                                {status.label}
                                            </span>
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center md:justify-start gap-2 text-secondary-500 dark:text-stone-400">
                                    <User size={16} />
                                    <span className="text-sm font-medium">
                                        {role === "superadmin"
                                            ? "Official Spora"
                                            : "Admin Spora"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2 text-secondary-500 dark:text-stone-400">
                                    <Mail size={16} />
                                    <span className="text-sm font-medium">
                                        {admin?.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-4 right-5 lg:static flex flex-row gap-2 items-center lg:items-start">
                            <KebabDropdown menuItems={menuItems} className="" />
                            <Button
                                variant="light"
                                size="xs"
                                onClick={() => onEdit("account")}
                                tooltip="Edit Akun"
                                className="p-2 hidden lg:block"
                            >
                                <Edit size={14} />
                            </Button>
                            <Button
                                variant="light"
                                size="xs"
                                onClick={() => onEdit("security")}
                                tooltip="Ubah Passowrd"
                                className="p-2 hidden lg:block"
                            >
                                Ubah Password
                            </Button>
                            {isAdmin && (
                                <Button
                                    variant="danger"
                                    size="xs"
                                    onClick={() => onDelete()}
                                    tooltip="Hapus Akun"
                                    className="p-2 hidden lg:block"
                                >
                                    <User size={14} />
                                </Button>
                            )}
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
