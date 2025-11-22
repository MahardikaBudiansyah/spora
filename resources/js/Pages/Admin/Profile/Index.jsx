import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage } from "@inertiajs/react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/common/Card";
import Button from "@/components/common/Button";
import BannerSection from "@/components/common/BannerSection";
import Avatar from "@/components/common/Avatar";

const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    return words
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
};

export default function Index() {
    const admin = usePage().props.auth?.admin;

    return (
        <AdminLayout>
            <Head title="Profil Saya" />
            <div className="relative">
                <BannerSection className="rounded-xl"></BannerSection>
                <div className="relative z-10 -mt-20 px-8">
                    <Card className="flex flex-col h-full min-h-screen rounded-lg shadow-none dark:border-none">
                        <CardHeader className="border-none">
                            <div className="flex justify-between">
                                <div className="flex flex-row gap-2 items-center">
                                    {admin && (
                                        <>
                                            <Avatar
                                                src={admin.photo}
                                                fallback={getInitials(
                                                    admin.name
                                                )}
                                                size="xxl"
                                            />
                                            <span className="text-xs">
                                                {admin.name}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="px-0"></CardBody>
                        <CardFooter className="border-none shadow-none "></CardFooter>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
