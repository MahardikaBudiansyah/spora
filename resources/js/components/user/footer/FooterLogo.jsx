import AppLogo from "@/components/Common/AppLogo";

export default function FooterLogo() {
    return (
        <div className="flex justify-center items-center">
            <AppLogo
                variant="newlogo" // Sesuaikan variant dengan yang diinginkan
                className="h-32 md:h-24 w-auto"
                alt="Spora"
            />
        </div>
    );
}
