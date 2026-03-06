import AppLogo from "@/components/Common/AppLogo";

export default function FooterLogo() {
    return (
        <div className="flex justify-center items-center">
            <AppLogo
                variant="newlogo"
                className="h-32 md:h-24 w-auto dark:hidden"
                alt="Spora"
            />
            <AppLogo
                variant="newlogo3"
                className="h-32 md:h-24 w-auto hidden dark:block"
                alt="Spora"
            />
        </div>
    );
}
