import AppLogo from "@/components/Common/AppLogo";

export default function FooterLogo() {
    return (
        <div className="flex justify-start items-center">
            <AppLogo
                variant="original" // Sesuaikan variant dengan yang diinginkan
                className="h-48 md:h-32 w-auto"
                alt="Ingkene Futsal Logo"
            />
        </div>
    );
}
