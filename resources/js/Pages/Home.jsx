import UserLayout from "@/Layouts/UserLayout";
import { Head, usePage } from "@inertiajs/react";
import HeroSection from "@/components/user/HeroSection";
import VenueSlider from "@/components/Venues/VenueSlider";
import Button from "@/components/Common/Button";

export default function Home() {
    const {
        venues: { data: venues },
    } = usePage().props;

    console.log(venues);

    if (!venues) return null;

    return (
        <UserLayout>
            <Head title="Beranda" />
            <HeroSection />

            <section className="max-w-screen-lg flex flex-col gap-4 mx-auto py-8 px-4">
                <h2 className="text-2xl font-bold">
                    Rekomendasi Tempat Olahraga
                </h2>
                <VenueSlider venues={venues} />
                <div className="flex justify-center">
                    <Button
                        variant="primary"
                        size="xs"
                        href={route("venues.index")}
                    >
                        Lihat Semua Venue
                    </Button>
                </div>
            </section>
        </UserLayout>
    );
}
