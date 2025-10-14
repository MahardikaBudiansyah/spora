import BannerAlert from "@/components/Common/BannerAlert";
import { Card, CardHeader, CardBody } from "@/components/common/Card";
import Checkbox from "@/components/Common/Checkbox";
import { formatAmountByType } from "@/utils/pricing";
import { TriangleAlert } from "lucide-react";

export default function PaymentType({
    selectedPaymentType,
    setSelectedPaymentType,
    selectedItems,
    isDpAvailable,
}) {
    // Ambil payment type dari venue pertama
    const paymentSettings = selectedItems[0]?.paymentType
        ? [selectedItems[0].paymentType]
        : [];

    return (
        <Card className="rounded-xl dark:border-none shadow-sm p-4">
            <CardHeader className="pb-4 border-b text-xl font-bold text-secondary-500 dark:text-white">
                Pilih Tipe Pembayaran
            </CardHeader>

            <CardBody>
                {paymentSettings.map((setting, index) => {
                    if (!setting.is_active) return null;

                    const options = [
                        {
                            label: "Langsung Lunas",
                            value: "full_payment",
                            disabled: false,
                        },
                    ];

                    if (setting.enable_dp) {
                        options.push({
                            label: `DP dulu (${formatAmountByType(
                                setting.dp_type,
                                setting.dp_value
                            )})`,
                            value: "down_payment",
                            disabled: !isDpAvailable, // 🚫 disable jika DP tidak tersedia
                        });
                    }

                    return (
                        <div key={index}>
                            {options.map((opt) => (
                                <label
                                    key={opt.value}
                                    className={`flex items-center mb-2 cursor-pointer ${
                                        opt.disabled
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
                                    }`}
                                >
                                    <Checkbox
                                        name={`paymentType-${index}-${opt.value}`}
                                        value={opt.value}
                                        checked={
                                            selectedPaymentType === opt.value
                                        }
                                        onChange={() =>
                                            setSelectedPaymentType(opt.value)
                                        }
                                        disabled={
                                            opt.value === "down_payment" &&
                                            !isDpAvailable
                                        }
                                        className="mr-2"
                                    />

                                    <span>{opt.label}</span>
                                </label>
                            ))}

                            {/* Tampilkan pesan DP tidak tersedia */}
                            {!isDpAvailable && setting.enable_dp && (
                                <BannerAlert
                                    type="warning"
                                    variant="subtle"
                                    size="sm"
                                    showIcon={false}
                                    title={
                                        <div className="flex flex-row gap-2 items-center">
                                            <TriangleAlert className="w-4 h-4 " />{" "}
                                            Perhatian
                                        </div>
                                    }
                                >
                                    DP hanya bisa digunakan jika tanggal bermain
                                    minimal {setting.full_payment_days_before}{" "}
                                    hari dari hari ini.
                                </BannerAlert>
                            )}
                        </div>
                    );
                })}
            </CardBody>
        </Card>
    );
}
