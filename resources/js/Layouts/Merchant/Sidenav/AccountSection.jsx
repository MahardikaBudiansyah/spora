import { usePage } from "@inertiajs/react";
import SidenavLink from "@/components/Common/SidenavLink";
import Avatar from "@/components/Common/Avatar";
import { ChevronRight, LogOut, Settings, Users } from "lucide-react";

export default function AccountSection({ src, user, role, isOpen, toggle }) {
    const getInitials = (name) =>
        name
            ?.trim()
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("")
            .toUpperCase();

    const { url } = usePage();

    const photoSrc = src
        ? src.startsWith("/assets") ||
          src.startsWith("http") ||
          src.startsWith("blob:") ||
          src.startsWith("/storage") ||
          src.startsWith("storage")
            ? src
            : `/storage/${src}`
        : null;

    const basePath =
        role === "merchant" ? "/merchant/profile" : "/staff/profile";
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
                    <div>
                        <Avatar
                            src={photoSrc}
                            fallback={getInitials(user?.name)}
                            size="md"
                        />
                    </div>
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
                            href={
                                role === "merchant"
                                    ? route("merchant.profile.index")
                                    : route("staff.profile.index")
                            }
                            routeName={
                                role === "merchant"
                                    ? "merchant.profile.index"
                                    : "staff.profile.index"
                            }
                            icon={Users}
                            label="Profil Mitra"
                            className="text-xs"
                        />
                    </li>
                    <li>
                        <SidenavLink
                            href={
                                role === "merchant"
                                    ? route("merchant.logout")
                                    : route("staff.logout")
                            }
                            routeName={
                                role === "merchant"
                                    ? "merchant.logout"
                                    : "staff.logout"
                            }
                            icon={LogOut}
                            label="Keluar"
                            method="post"
                            as="button"
                            className="w-full text-left"
                        />
                    </li>
                </div>
            )}
        </ul>
    );
}
