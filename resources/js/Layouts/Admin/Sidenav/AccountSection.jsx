import { usePage } from "@inertiajs/react";
import SidenavLink from "@/components/Common/SidenavLink";
import Avatar from "@/components/Common/Avatar";
import { ChevronRight, LogOut, Settings, Users } from "lucide-react";

export default function AccountSection({ user, isOpen, toggle }) {
    const getInitials = (name) =>
        name
            ?.trim()
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();

    const { url } = usePage();

    const basePath = "/admin/profile";
    const isAnyChildActive = url.startsWith(basePath);

    return (
        <ul className="flex flex-col py-4 space-y-2 border-y border-stone-200 dark:border-stone-700 text-sm font-medium">
            <li
                onClick={() => toggle("account")}
                className={`flex justify-between gap-2 pl-3 pr-4 py-2 rounded-md items-center cursor-pointer hover:text-dark hover:bg-primary-400 transition ${
                    isAnyChildActive ? "bg-primary-400 text-dark" : ""
                }`}
            >
                <div className="flex gap-2 items-center">
                    <Avatar
                        src={user?.photo}
                        fallback={getInitials(user?.name)}
                        size="md"
                        className="p-4"
                    />
                    <span>{user?.name}</span>
                </div>
                <ChevronRight
                    className={`w-4 transition-transform ${
                        isOpen ? "rotate-90" : ""
                    }`}
                />
            </li>

            {(isOpen || isAnyChildActive) && (
                <div className="ml-2 flex flex-col gap-2">
                    <li>
                        <SidenavLink
                            href={route("admin.profile.index")}
                            routeName={"admin.profile.index"}
                            icon={Users}
                            label="Profil Saya"
                        />
                    </li>
                    <li>
                        <SidenavLink icon={Settings} label="Pengaturan" />
                    </li>
                    <li>
                        <SidenavLink
                            href={route("admin.logout")}
                            routeName={"admin.logout"}
                            icon={LogOut}
                            label="Keluar"
                            method="post"
                            as="button"
                            className="w-full"
                        />
                    </li>
                </div>
            )}
        </ul>
    );
}
