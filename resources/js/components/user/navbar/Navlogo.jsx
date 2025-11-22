import AppLogo from "@/components/Common/AppLogo";

export default function NavLogo() {
    return (
        <a href={route("home")} className="flex items-center">
            <AppLogo variant="newlogo" className="h-16 w-auto" alt="Spora" />
        </a>
    );
}
