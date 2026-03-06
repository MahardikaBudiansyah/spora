import React from "react";
import { Head, usePage, router } from "@inertiajs/react";
import useModal from "@/hooks/useModal";
import UserLayout from "@/Layouts/UserLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/common/Card";
import BannerSection from "@/components/common/BannerSection";
import Button from "@/components/Common/Button";
import { CheckCircle } from "lucide-react";
import { formatFullDateTimeWithDay } from "@/utils/date";
import { formatTo08 } from "@/utils/numberPhone";
import { formatRupiah } from "@/utils/currency";
import {
    getPaymentMethod,
    getPaymentType,
} from "@/utils/attributes/paymentAttribute";
import DevelopmentPlaceholder from "@/components/Common/DevelopmentPlaceholder";

export default function Success() {
    const {
        user: { data: user },
        transaction: { data: transaction },
    } = usePage().props;

    console.log("transaction: ", transaction);

    const { isOpen, open, close } = useModal();

    const invoice = transaction?.invoice;
    const payment = transaction?.latest_payment;
    const paymentDetail = payment?.detail;

    return (
        <UserLayout footerType="bottom">
            <Head title="Pembayaran Berhasil" />
            <BannerSection height="h-16" />
            <div className="p-8 md:p-12 max-w-screen-sm mx-auto rounded-lg text-sm">
                <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                    <CardHeader className="p-12 border-none text-center">
                        <div className="flex flex-col gap-2 items-center justify-center text-xl md:text-3xl font-bold text-green-600">
                            <CheckCircle className="w-10 h-10 md:w-16 md:h-16" />
                            <span>Pembayaran Berhasil!</span>
                        </div>
                        <div className="py-2 flex flex-col gap-1 justify-center font-bold text-sm">
                            <span>No Pesanan: {transaction?.order_no}</span>
                            <span>No Invoice: {invoice?.invoice_no}</span>
                            <span>
                                Gateway Order Id: {payment?.gateway_order_id}
                            </span>
                        </div>
                        <span>
                            {formatFullDateTimeWithDay(
                                payment?.created_at,
                            )}{" "}
                        </span>
                    </CardHeader>
                    <CardBody className="flex flex-col max-w-md mx-auto py-0 px-12">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-2 justify-between items-center">
                                <span>Tipe Pembayaran</span>
                                <span className="text-right capitalize">
                                    {getPaymentType(payment?.type).label || "-"}
                                </span>
                            </div>
                            <div className="flex flex-row gap-2 justify-between items-center">
                                <span>Metode Pembayaran</span>
                                <span className="text-right capitalize">
                                    {getPaymentMethod(payment?.method).label ||
                                        "-"}
                                </span>
                            </div>
                            <div className="flex flex-row gap-2 justify-between items-center">
                                <span>Provider</span>
                                <span className="text-right capitalize">
                                    {paymentDetail?.provider ||
                                        "Online Gateway"}
                                </span>
                            </div>
                            <div className="flex flex-row gap-2 justify-between items-center">
                                <span>No Referensi</span>
                                <span className="text-right">
                                    {paymentDetail?.reference_no || "-"}
                                </span>
                            </div>
                            <div className="flex flex-row gap-2 justify-between items-center">
                                <span>No Handphone</span>
                                <span>
                                    {formatTo08(user?.phone_number || "-")}
                                </span>
                            </div>
                            <div className="flex flex-row gap-2 justify-between items-center">
                                <span>Email</span>
                                <span>{user?.email}</span>
                            </div>
                        </div>
                        <div className="pt-4 flex flex-col gap-2 font-bold">
                            <div className="flex flex-row gap-2 justify-between items-center">
                                <span>Total Pembayaran</span>
                                <span>{formatRupiah(payment?.amount)}</span>
                            </div>
                        </div>
                    </CardBody>

                    <CardFooter className="p-12 border-none flex flex-row gap-2 items-center justify-between max-w-md mx-auto w-full">
                        <Button
                            variant="primary"
                            size="xs"
                            onClick={() =>
                                router.visit(route("user.dashboard.index"))
                            }
                        >
                            Lihat Transaksi
                        </Button>
                        <Button
                            variant="primary"
                            size="xs"
                            onClick={() => open("PrintModal")}
                        >
                            Cetak Invoice
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <DevelopmentPlaceholder
                title={`Cetak Invoice `}
                show={isOpen("PrintModal")}
                onClose={close}
            />
        </UserLayout>
    );
}
