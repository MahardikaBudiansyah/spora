import { useState } from "react";
import { router } from "@inertiajs/react";
import {
    Card,
    CardBody,
    CardHeader,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import ButtonToggle from "@/components/Common/ButtonToggle";
import Checkbox from "@/components/Common/Checkbox";
import LabelInput from "@/components/Common/LabelInput";
import NumericInput from "@/components/Common/NumericInput";
import { HelpCircle, Eye, EyeClosed } from "lucide-react";
import Tippy from "@tippyjs/react";
import { toast } from "react-toastify";

export default function PaymentMethodSetting({ merchant }) {
    const [venueSettings, setVenueSettings] = useState(
        merchant.venues.map((v) => ({
            venue_id: v.id,
            name: v.name,
            payment_type: v.payment_setting?.payment_type ?? "full_payment",
            dp_type: v.payment_setting?.dp_type ?? "fixed",
            dp_value: v.payment_setting?.dp_value ?? 0,
            apply_to_merchant: v.payment_setting?.apply_to_merchant ?? false,
            is_active: v.payment_setting?.is_active ?? true,
        }))
    );

    const handleSave = () => {
        router.post(
            route("merchant.settings.update"),
            { venues: venueSettings },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Pengaturan pembayaran berhasil disimpan 🎉");
                },
                onError: (errors) => {
                    toast.error(
                        "Gagal menyimpan pengaturan. Periksa kembali input Anda ⚠️"
                    );
                    console.error(errors);
                },
                onFinish: () => {
                    console.log("Request selesai.");
                },
            }
        );
    };

    return (
        <Card className="border-none shadow-none">
            <CardHeader className="border-none">
                <h2 className="text-lg font-semibold">
                    Metode Pembayaran Booking
                </h2>
            </CardHeader>
            <CardBody className="py-4 space-y-6">
                {venueSettings.map((v, idx) => (
                    <div
                        key={v.venue_id}
                        className="border border-secondary-200 dark:border-secondary-700 p-4 rounded-lg shadow-sm space-y-4"
                    >
                        <div className="flex flex-row gap-2 justify-between items-center">
                            <div className="font-bold">{v.name}</div>
                            <div className="flex flex-row gap-2 items-center text-sm">
                                <ButtonToggle
                                    active={v.is_active}
                                    onClick={() => {
                                        const updated = [...venueSettings];
                                        updated[idx].is_active = !v.is_active; // toggle nilai
                                        setVenueSettings(updated);
                                    }}
                                    activeIcon={<Eye className="w-4 h-4" />}
                                    inactiveIcon={
                                        <EyeClosed className="w-4 h-4" />
                                    }
                                    tooltipActive="Aktif"
                                    tooltipInactive="Nonaktif"
                                    activeVariant="success"
                                    inactiveVariant="danger"
                                    size="xs"
                                    className="rounded-md"
                                />
                                <span
                                    className={
                                        v.is_active
                                            ? "text-green-600"
                                            : "text-red-500"
                                    }
                                >
                                    {v.is_active ? "Aktif" : "Nonaktif"}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            {/* Tipe Pembayaran */}
                            <div className="w-full flex flex-col gap-2">
                                <LabelInput
                                    htmlFor="payment_type"
                                    value="Tipe Pembayaran:"
                                />
                                <div className="flex flex-row gap-2 items-center">
                                    <Checkbox
                                        value="full_payment"
                                        checked={
                                            v.payment_type === "full_payment"
                                        }
                                        onChange={() => {
                                            const updated = [...venueSettings];
                                            updated[idx].payment_type =
                                                "full_payment";
                                            setVenueSettings(updated);
                                        }}
                                    />
                                    <span>Langsung Lunas</span>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                    <Checkbox
                                        value="down_payment"
                                        checked={
                                            v.payment_type === "down_payment"
                                        }
                                        onChange={() => {
                                            const updated = [...venueSettings];
                                            updated[idx].payment_type =
                                                "down_payment";
                                            setVenueSettings(updated);
                                        }}
                                    />
                                    <span>DP dan Lunas</span>
                                </div>
                            </div>
                            {/* Kalau DP */}
                            {v.payment_type === "down_payment" && (
                                <div className="w-full flex flex-col gap-2">
                                    <LabelInput
                                        htmlFor="dp_type"
                                        value="Tipe DP:"
                                    />
                                    <div className="flex flex-row gap-2 items-center">
                                        <Checkbox
                                            value="fixed"
                                            checked={v.dp_type === "fixed"}
                                            onChange={() => {
                                                const updated = [
                                                    ...venueSettings,
                                                ];
                                                updated[idx].dp_type = "fixed";
                                                setVenueSettings(updated);
                                            }}
                                        />
                                        <span className="flex items-center gap-1">
                                            Harga Tetap (Rupiah)
                                            <Tippy content="DP dihitung berdasarkan nominal tetap. Contoh: Rp 100.000 berapapun total harga booking/sewa.">
                                                <HelpCircle className="w-4 h-4 text-gray-500 cursor-pointer" />
                                            </Tippy>
                                        </span>
                                    </div>
                                    <div className="flex flex-row gap-2 items-center">
                                        <Checkbox
                                            value="percentage"
                                            checked={v.dp_type === "percentage"}
                                            onChange={() => {
                                                const updated = [
                                                    ...venueSettings,
                                                ];
                                                updated[idx].dp_type =
                                                    "percentage";
                                                setVenueSettings(updated);
                                            }}
                                        />
                                        <span className="flex items-center gap-1">
                                            Persentase
                                            <Tippy content="DP dihitung dalam persentase dari total harga. Contoh: 30% dari total booking/sewa Rp 500.000 = Rp 150.000.">
                                                <HelpCircle className="w-4 h-4 text-gray-500 cursor-pointer" />
                                            </Tippy>
                                        </span>
                                    </div>
                                    <NumericInput
                                        value={v.dp_value}
                                        prefix={
                                            v.dp_type === "fixed" ? "Rp. " : ""
                                        }
                                        suffix={
                                            v.dp_type === "percentage"
                                                ? " %"
                                                : ""
                                        }
                                        onChange={(value) => {
                                            const updated = [...venueSettings];
                                            updated[idx].dp_value = value;
                                            setVenueSettings(updated);
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            {/* Aturan Tambahan */}
                            <Checkbox
                                checked={v.apply_to_merchant}
                                onChange={(e) => {
                                    const updated = [...venueSettings];
                                    updated[idx].apply_to_merchant =
                                        e.target.checked;
                                    setVenueSettings(updated);
                                }}
                            />
                            Berlaku untuk booking manual
                        </div>

                        {/* Preview */}
                        <div className="py-4 px-4 bg-secondary-50 dark:bg-secondary-800 rounded text-sm">
                            <div className="font-bold">Ringkasan:</div>
                            {v.payment_type === "full_payment"
                                ? "* Semua booking harus bayar full."
                                : `* DP ${v.dp_value} ${
                                      v.dp_type === "percentage" ? "%" : ""
                                  } berlaku untuk customer online.`}
                            {v.apply_to_merchant && (
                                <p>* Berlaku juga untuk booking manual.</p>
                            )}
                            {!v.is_active && (
                                <p className="text-red-500">
                                    ⚠ Pengaturan ini sedang nonaktif.
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </CardBody>

            <CardFooter className="flex justify-end border-none">
                <Button variant="primary" onClick={handleSave}>
                    Simpan Semua
                </Button>
            </CardFooter>
        </Card>
    );
}
