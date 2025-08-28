import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import BannerSection from "@/components/common/BannerSection";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/common/Card";
import SelectInput from "@/components/Common/SelectInput";
import RadioGroup from "@/components/Common/RadioGroup";
import Radio from "@/components/Common/Radio";
import {
    ChevronRight,
    Dot,
    DotIcon,
    ShieldCheck,
    Trash2,
    UserRoundX,
} from "lucide-react";
import Button from "@/components/Common/Button";

export default function Create() {
    const [paymentType, setPaymentType] = useState("");
    const paymentTypeOptions = [
        { value: "dp", label: "DP" },
        { value: "full", label: "Full Pembayaran" },
    ];

    const paymentMethodOptions = [
        { value: "bank_transfer", label: "Transfer Bank" },
        { value: "e_wallet", label: "Transfer Dompet Digital" },
        { value: "cash", label: "Tunai (Cash)" },
    ];

    const [method, setMethod] = useState("transfer");

    return (
        <UserLayout>
            <Head title="Booking" />
            <BannerSection height="h-16" />
            <div className="px-4 py-8 max-w-screen-lg mx-auto rounded-xl text-xs">
                <div className="pb-4 text-2xl font-bold dark:text-white">
                    Checkout Lapangan
                </div>
                <div className=" flex flex-row gap-8">
                    <div className="w-1/2 flex flex-col gap-4">
                        <Card className="rounded-xl dark:border-none p-4 text-sm">
                            <CardHeader className="pb-4 border-b text-xl font-bold text-secondary-500 dark:text-white ">
                                Jakal Seven Futsal
                            </CardHeader>
                            <CardBody>
                                <div className="flex flex-col">
                                    <div className="flex flex-row justify-between items-center">
                                        <span className="font-semibold text-base mb-2">
                                            Lapangan Lama - Vynil
                                        </span>
                                        <ChevronRight className="w-4" />
                                    </div>
                                    <div className="px-4 py-3 flex justify-between items-center border-l-4 mb-2 bg-primary-200 dark:bg-primary-800 border-primary-700 dark:border-primary-900 hover:bg-primary-300 dark:hover:bg-primary-900 rounded-md">
                                        <div className="flex flex-row gap-4 items-center">
                                            <div className="flex flex-col gap-1 dark:text-gray-200 ">
                                                <span className="flex flex-row">
                                                    Sabtu, 16 Agustus 2025
                                                    <Dot />
                                                    15:00-16:00
                                                </span>
                                                <span className="font-semibold">
                                                    Rp. 100.000
                                                </span>
                                            </div>
                                        </div>

                                        <Trash2 className="text-primary-700 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-600 cursor-pointer" />
                                    </div>
                                    <div className="px-4 py-3 flex justify-between items-center border-l-4 mb-2 bg-primary-200 dark:bg-primary-800 border-primary-700 dark:border-primary-900 hover:bg-primary-300 dark:hover:bg-primary-900 rounded-md">
                                        <div className="flex flex-row gap-4 items-center">
                                            <div className="flex flex-col gap-1 dark:text-gray-200 ">
                                                <span className="flex flex-row">
                                                    Sabtu, 16 Agustus 2025
                                                    <Dot />
                                                    15:00-16:00
                                                </span>
                                                <span className="font-semibold">
                                                    Rp. 100.000
                                                </span>
                                            </div>
                                        </div>

                                        <Trash2 className="text-primary-700 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-600 cursor-pointer" />
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-row justify-between items-center">
                                        <span className="font-semibold text-base mb-2">
                                            Lapangan Lama - Vynil
                                        </span>
                                        <ChevronRight className="w-4" />
                                    </div>
                                    <div className="px-4 py-3 flex justify-between items-center border-l-4 mb-2 bg-primary-200 dark:bg-primary-800 border-primary-700 dark:border-primary-900 hover:bg-primary-300 dark:hover:bg-primary-900 rounded-md">
                                        <div className="flex flex-row gap-4 items-center">
                                            <div className="flex flex-col gap-1 dark:text-gray-200 ">
                                                <span className="flex flex-row">
                                                    Sabtu, 16 Agustus 2025
                                                    <Dot />
                                                    15:00-16:00
                                                </span>
                                                <span className="font-semibold">
                                                    Rp. 100.000
                                                </span>
                                            </div>
                                        </div>

                                        <Trash2 className="text-primary-700 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-600 cursor-pointer" />
                                    </div>
                                    <div className="px-4 py-3 flex justify-between items-center border-l-4 mb-2 bg-primary-200 dark:bg-primary-800 border-primary-700 dark:border-primary-900 hover:bg-primary-300 dark:hover:bg-primary-900 rounded-md">
                                        <div className="flex flex-row gap-4 items-center">
                                            <div className="flex flex-col gap-1 dark:text-gray-200 ">
                                                <span className="flex flex-row">
                                                    Sabtu, 16 Agustus 2025
                                                    <Dot />
                                                    15:00-16:00
                                                </span>
                                                <span className="font-semibold">
                                                    Rp. 100.000
                                                </span>
                                            </div>
                                        </div>

                                        <Trash2 className="text-primary-700 dark:text-primary-500 hover:text-primary-800 dark:hover:text-primary-600 cursor-pointer" />
                                    </div>
                                </div>
                            </CardBody>
                            <CardFooter className="pt-4 border-t text-right text-xl font-bold text-secondary-500 dark:text-white">
                                <Button variant="light">Tambah Jadwal</Button>
                            </CardFooter>
                        </Card>
                    </div>
                    <div className="flex flex-col gap-4">
                        <Card className="rounded-xl dark:border-none p-4 text-sm">
                            <CardHeader className="pb-4 border-b text-xl font-bold text-secondary-500 dark:text-white ">
                                Penyewa
                            </CardHeader>
                            <CardBody>
                                <span className="flex gap-2 font-bold">
                                    Mahardika Budiansyah
                                    <DotIcon className="W-4" />
                                    089629792894
                                </span>
                                <span className="flex gap-2">
                                    <UserRoundX className="w-4" /> Non
                                    Memberships
                                </span>
                            </CardBody>
                        </Card>

                        <Card className="rounded-xl dark:border-none p-4 text-sm">
                            <CardHeader className="pb-4 border-b text-xl font-bold text-secondary-500 dark:text-white ">
                                Rincian Pembyaran
                            </CardHeader>
                            <CardBody>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-row justify-between">
                                        <span>Biaya Sewa</span>
                                        <span>Rp. 400.000</span>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <span>Biaya Tambahan</span>
                                        <span>Rp. 0</span>
                                    </div>
                                </div>
                            </CardBody>
                            <CardFooter className="pt-4 border-t text-right text-xl font-bold text-secondary-500 dark:text-white">
                                <div className="flex flex-row justify-between ">
                                    <span>Total Pembayaran</span>
                                    <span>Rp. 400.000</span>
                                </div>
                            </CardFooter>
                        </Card>

                        <Card className="rounded-xl dark:border-none p-4 text-sm cursor-pointer">
                            <div className="flex flex-row justify-between">
                                <div className="flex gap-2 items-center font-bold">
                                    <ShieldCheck className="w-5 text-red-600" />
                                    <span>
                                        Kebijakan Resechedule & Pembatalan
                                    </span>
                                </div>
                                <ChevronRight className="w-4" />
                            </div>
                        </Card>
                        <Button variant="primary" className="flex py-3">
                            Lanjutkan Pembayaran
                        </Button>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
