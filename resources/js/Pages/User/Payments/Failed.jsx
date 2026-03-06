import React from "react";
import { Head, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/common/Card";
import BannerSection from "@/components/common/BannerSection";
import Button from "@/components/Common/Button";
import { CircleX } from "lucide-react";

export default function Failed() {
    return (
        <UserLayout footerType="bottom">
            <Head title="Booking" />
            <BannerSection height="h-16" />
            <div className="px-4 py-8 max-w-screen-lg mx-auto rounded-lg text-sm">
                <Card className="flex flex-col h-full min-h-screen rounded-lg shadow-none dark:border-none">
                    <CardHeader className="px-8 pt-16 pb-8 border-none text-center">
                        <div className="flex flex-col gap-2 items-center justify-center text-2xl md:text-4xl font-bold text-red-600">
                            <CircleX className="w-8 h-8 md:w-16 md:h-16" />
                            <span className="">Pembayaran Gagal!</span>
                        </div>
                        <div className="py-2 flex flex-row gap-2 justify-center font-bold text-base">
                            <span>Order no</span>
                            <span>Gateway Order Id</span>
                        </div>
                        <span>Tanggal order dan jam</span>
                    </CardHeader>
                    <CardBody className="flex flex-col max-w-lg mx-auto w-full "></CardBody>
                    <CardFooter className="py-16 border-none flex flex-row gap-2 items-center justify-between max-w-lg mx-auto w-full">
                        <Button
                            variant="primary"
                            onClick={() =>
                                router.visit(route("user.dashboard"))
                            }
                        >
                            Lihat Booking
                        </Button>
                        <Button variant="primary">Coba Bayar Lagi</Button>
                    </CardFooter>
                </Card>
            </div>
        </UserLayout>
    );
}
