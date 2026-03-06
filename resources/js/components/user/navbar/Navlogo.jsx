import AppLogo from "@/components/Common/AppLogo";
import { Link } from "@inertiajs/react";

export default function NavLogo() {
    return (
        <Link href={route("home")} className="flex items-center outline-none">
            <AppLogo
                variant="newlogo"
                className="h-16 w-auto dark:hidden"
                alt="Spora"
            />
            <AppLogo
                variant="newlogo3"
                className="h-16 w-auto hidden dark:block"
                alt="Spora"
            />
        </Link>
    );
}
