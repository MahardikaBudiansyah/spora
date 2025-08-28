import { Head } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import BannerSection from "@/components/common/BannerSection";
import { Card } from "@/components/common/Card";

export default function About() {
    return (
        <UserLayout>
            <div>
                <Head title="Tentang Kami" />
                <BannerSection height="h-64">
                    <h1 className="text-white uppercase font-normal text-4xl">
                        Lebih Dekat Dengan{" "}
                        <span className="font-extrabold">IngkeneFutsal</span>
                    </h1>
                </BannerSection>
            </div>
            <div className="p-4 max-w-screen-lg mx-auto py-8 rounded-lg text-xs text-gray-800 dark:text-white">
                <div className="py-6 flex flex-row justify-between"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="rounded-lg border-none hover:border-2 shadow-md hover:shadow-xl dark:shadow-stone-800 cursor-pointer"></Card>
                </div>
            </div>
        </UserLayout>
    );
}
