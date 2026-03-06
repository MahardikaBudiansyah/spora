import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/common/Card";
import { ChevronRight } from "lucide-react";
import { formatRupiah } from "@/utils/currency";
import { formatShortDate } from "@/utils/date";
import BannerAlert from "@/components/Common/BannerAlert";

export default function SummaryPayment({ membershipPackage }) {
    const price = membershipPackage?.price || 0;

    // Contoh kalau nanti kamu mau hitung diskon:
    const discount =
        membershipPackage?.discounts?.length > 0
            ? membershipPackage.discounts.reduce((total, d) => {
                  return total + (d.amount || 0);
              }, 0)
            : 0;

    const additionalFee = 0; // kalau ada biaya admin dsb

    // Total akhir (price - discount + tambahan)
    const grossAmount = price - discount + additionalFee;

    return (
        <Card className="rounded-xl dark:border-none shadow-sm p-4">
            <CardHeader className="pb-4 border-b text-xl font-bold text-secondary-500 dark:text-white">
                Rincian Pembayaran
            </CardHeader>
            <CardBody className="space-y-2">
                {/* Biaya Tambahan */}
                <div className="flex flex-row justify-between gap-2">
                    <div className="flex gap-2 items-center">
                        <ChevronRight className="w-3 h-3 opacity-50" />
                        <span>Biaya Membership</span>
                    </div>
                    <span>{formatRupiah(price)}</span>
                </div>
                {/* Diskon (jika ada) */}
                {discount > 0 && (
                    <div className="flex flex-row justify-between gap-2 text-green-600">
                        <div className="flex gap-2 items-center">
                            <ChevronRight className="w-3 h-3 opacity-50" />
                            <span>Diskon</span>
                        </div>
                        <span>-{formatRupiah(discount)}</span>
                    </div>
                )}
                <div className="flex flex-row justify-between gap-2">
                    <div className="flex gap-2 items-center">
                        <ChevronRight className="w-3 h-3 opacity-50" />
                        <span>Biaya Tambahan</span>
                    </div>
                    <span>{formatRupiah(0)}</span>
                </div>
            </CardBody>

            <CardFooter className="pt-4 border-t space-y-1">
                <div className="flex justify-between font-bold">
                    <span>Total Pembayaran </span>
                    <span>{formatRupiah(grossAmount)}</span>
                </div>
            </CardFooter>
        </Card>
    );
}
