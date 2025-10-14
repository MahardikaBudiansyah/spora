import React, { useState, useEffect, useMemo } from "react";
import { Head, usePage } from "@inertiajs/react";
import axios from "axios";
import UserLayout from "@/Layouts/UserLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/common/Card";
import { useCart } from "@/contexts/CartContext";
import BannerSection from "@/components/common/BannerSection";
import Button from "@/components/Common/Button";

import PreviewBooking from "@/Pages/User/Booking/Partials/PreviewBooking";
import CustomerData from "@/Pages/User/Booking/Partials/CustomerData";
import PaymentType from "@/Pages/User/Booking/Partials/PaymentType";
import SummaryPayment from "@/Pages/User/Booking/Partials/SummaryPayment";
import BookingPolicy from "@/Pages/User/Booking/Partials/BookingPolicy";
import { toast } from "react-toastify";
import { CheckCircle } from "lucide-react";
import { formatFullDateTimeWithDay, formatFullDate } from "@/utils/date";

export default function Success() {
    const { transaction, user, type, profileIncomplete } = usePage().props;

    // Optional: ambil invoice/booking details
    const invoice = transaction.invoices; // contoh ambil invoice pertama
    const customer = transaction.customers || {
        name: "",
        phone_number: "",
    };
    const payment = invoice?.payments;
    return (
        <UserLayout footerType="bottom">
            <Head title="Booking" />
            <BannerSection height="h-16" />
            <div className="px-4 py-8 max-w-screen-lg mx-auto rounded-lg text-sm">
                <Card className="flex flex-col h-full min-h-screen rounded-lg shadow-none dark:border-none">
                    <CardHeader className="px-8 pt-16 pb-8 border-none text-center">
                        <div className="flex flex-col gap-2 items-center justify-center text-2xl md:text-4xl font-bold text-green-600">
                            <CheckCircle className="w-8 h-8 md:w-16 md:h-16" />
                            <span>Pembayaran Berhasil!</span>
                        </div>
                        <div className="py-2 flex flex-row gap-2 justify-center font-bold text-base">
                            <span>No Invoice: {invoice?.invoice_number}</span>
                            <span>
                                Gateway Order Id: {transaction?.order_id}
                            </span>
                        </div>
                        <span>
                            {formatFullDateTimeWithDay(transaction?.created_at)}
                        </span>
                    </CardHeader>
                    <CardBody className="flex flex-col max-w-lg mx-auto w-full ">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-2 justify-between items-center">
                                <div>Tipe Pembayaran</div>
                                <div>
                                    {payment?.type === "dp" ? "DP" : "Lunas"}
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 justify-between items-center">
                                <div>Provider</div>
                                <div>{payment?.provider || "Midtrans"}</div>
                            </div>
                            <div className="flex flex-row gap-2 justify-between items-center">
                                <div>No Referensi</div>
                                <div>{payment?.reference_number || "-"}</div>
                            </div>
                            <div className="flex flex-row gap-2 justify-between items-center">
                                <div>No Handphone</div>
                                <div>{user?.phone_number}</div>
                            </div>
                            <div className="flex flex-row gap-2 justify-between items-center">
                                <div>Email</div>
                                <div>{user?.email}</div>
                            </div>
                        </div>
                        <div className="pt-4 flex flex-col gap-2 font-bold">
                            <div className="flex flex-row gap-2 justify-between items-center">
                                <div>Total Pembayaran</div>
                                <div>
                                    Rp.{" "}
                                    {payment?.amount?.toLocaleString("id-ID")}
                                </div>
                            </div>
                        </div>
                    </CardBody>

                    <CardFooter className="py-16 border-none flex flex-row gap-2 items-center justify-between max-w-lg mx-auto w-full">
                        <Button
                            variant="primary"
                            onClick={() =>
                                router.visit(route("user.dashboard"))
                            }
                        >
                            Lihat Booking
                        </Button>
                        <Button variant="primary">Cetak Invoice</Button>
                    </CardFooter>
                </Card>
            </div>
        </UserLayout>
    );
}
