import UserLayout from "@/Layouts/UserLayout";
import { Head } from "@inertiajs/react";
import HeroSection from "@/components/user/HeroSection";

export default function Home() {
    return (
        <UserLayout>
            <Head title="Beranda" />
            <HeroSection />
        </UserLayout>
    );
}
