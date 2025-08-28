import AppLogo from "@/components/Common/AppLogo";

export default function NavLogo() {
    return (
        <a
            href={route("home")}
            className="flex items-center space-x-3 rtl:space-x-reverse"
        >
            <AppLogo
                variant="original"
                className="h-16 w-auto"
                alt="Ingkene Futsal Logo"
            />
        </a>
    );
}
