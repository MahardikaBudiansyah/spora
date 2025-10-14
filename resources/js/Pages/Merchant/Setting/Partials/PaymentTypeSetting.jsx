import { useState, useEffect } from "react";
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
import { formatAmountByType } from "@/utils/pricing";
import { HelpCircle, Eye, EyeClosed, AlertTriangle } from "lucide-react";
import Tippy from "@tippyjs/react";
import { toast } from "react-toastify";

export default function PaymentTypeSetting({ merchant }) {
    const [venueSettings, setVenueSettings] = useState([]);

    useEffect(() => {
        if (merchant?.venues) {
            setVenueSettings(
                merchant.venues.map((v) => ({
                    venue_id: v.id,
                    name: v.name,
                    enable_dp: v.payment_type?.enable_dp ?? false,
                    dp_type: v.payment_type?.dp_type ?? "fixed",
                    dp_value: v.payment_type?.dp_value ?? 0,
                    apply_to_merchant:
                        v.payment_type?.apply_to_merchant ?? false,
                    is_active: v.payment_type?.is_active ?? true,
                    full_payment_days_before:
                        v.payment_type?.full_payment_days_before ?? 1,
                    max_full_payment_days:
                        v.payment_type?.max_full_payment_days ?? 3,
                }))
            );
        }
    }, [merchant.venues]);

    const handleSave = () => {
        router.post(
            route("merchant.settings.update"),
            { venues: venueSettings },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    toast.success("Pengaturan pembayaran berhasil disimpan 🎉");
                    setVenueSettings(
                        page.props.merchant.venues.map((v) => ({
                            venue_id: v.id,
                            name: v.name,
                            enable_dp: v.paymentType?.enable_dp ?? false,
                            dp_type: v.paymentType?.dp_type ?? "fixed",
                            dp_value: v.paymentType?.dp_value ?? 0,
                            apply_to_merchant:
                                v.paymentType?.apply_to_merchant ?? false,
                            is_active: v.paymentType?.is_active ?? true,
                            full_payment_days_before:
                                v.paymentType?.full_payment_days_before ?? 1,
                            max_full_payment_days:
                                v.paymentType?.max_full_payment_days ?? 3,
                        }))
                    );
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
                    Tipe Pembayaran Booking
                </h2>
            </CardHeader>
            <CardBody className="py-4 space-y-6">
                {venueSettings.map((v, idx) => (
                    <div
                        key={`venue-${v.venue_id}`}
                        className="border border-secondary-200 dark:border-secondary-700 p-4 rounded-lg space-y-4"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div className="font-bold">{v.name}</div>
                            <div className="flex items-center gap-2 text-sm">
                                <ButtonToggle
                                    active={v.is_active}
                                    onClick={() => {
                                        const updated = [...venueSettings];
                                        updated[idx].is_active = !v.is_active;
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

                        {/* Tipe Pembayaran */}
                        <div className="flex gap-4">
                            <div className="w-full flex flex-col gap-2">
                                <LabelInput value="Tipe Pembayaran:" />

                                {/* Full Payment */}
                                <div className="flex items-center gap-2">
                                    <Checkbox checked readOnly />
                                    <span>Langsung Lunas</span>
                                </div>

                                {/* Enable DP */}
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={v.enable_dp}
                                        onChange={(e) => {
                                            const updated = [...venueSettings];
                                            updated[idx].enable_dp =
                                                e.target.checked;
                                            setVenueSettings(updated);
                                        }}
                                    />
                                    <span>Izinkan DP</span>
                                </div>
                            </div>

                            {/* DP Setting */}
                            {v.enable_dp && (
                                <div className="w-full flex flex-col gap-2">
                                    <div className="flex flex-row gap-2 items-center">
                                        <LabelInput value="Aturan DP:" />
                                        <Tippy
                                            content={
                                                "Aturan DP menentukan cara pembayaran Uang Muka di Depan. " +
                                                "Pilih 'Harga Tetap' untuk nominal tetap atau 'Presentase' untuk persentase dari harga total booking lapangan. " +
                                                "Pastikan nilai DP tidak melebihi harga total booking lapangan."
                                            }
                                            placement="top"
                                            animation="shift-away"
                                        >
                                            <span>
                                                <HelpCircle className="w-4 h-4 text-gray-500 cursor-pointer" />
                                            </span>
                                        </Tippy>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
                                            checked={v.dp_type === "fixed"}
                                            onChange={() => {
                                                const updated = [
                                                    ...venueSettings,
                                                ];
                                                updated[idx].dp_type = "fixed";
                                                setVenueSettings(updated);
                                            }}
                                        />
                                        <span>Harga Tetap (Rupiah)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox
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
                                        <span>Persentase (%)</span>
                                    </div>
                                    <NumericInput
                                        value={v.dp_value}
                                        prefix={
                                            v.dp_type === "fixed" ? "Rp " : ""
                                        }
                                        suffix={
                                            v.dp_type === "percentage"
                                                ? "%"
                                                : ""
                                        }
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        decimalScale={0}
                                        allowNegative={false}
                                        onChange={(value) => {
                                            const updated = [...venueSettings];
                                            updated[idx].dp_value = value;
                                            setVenueSettings(updated);
                                        }}
                                    />
                                </div>
                            )}

                            <div className="w-full flex flex-col gap-2">
                                <div className="flex flex-row gap-2 items-center">
                                    <LabelInput value="Aturan Pelunasan:" />
                                    <Tippy
                                        content={`Minimal H-${v.full_payment_days_before} sebelum tanggal main. Maksimal H-${v.max_full_payment_days}.`}
                                    >
                                        <span>
                                            <HelpCircle className="w-4 h-4 text-gray-500 cursor-pointer" />
                                        </span>
                                    </Tippy>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <NumericInput
                                        value={v.full_payment_days_before}
                                        min={1}
                                        max={v.max_full_payment_days ?? 3}
                                        decimalScale={0}
                                        allowNegative={false}
                                        suffix=" hari sebelumnya"
                                        onChange={(value) => {
                                            const updated = [...venueSettings];
                                            updated[
                                                idx
                                            ].full_payment_days_before = value;
                                            setVenueSettings(updated);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Aturan Tambahan */}
                        <div className="flex items-center gap-2">
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

                        {/* Preview Ringkasan */}
                        <div className="py-2 px-3 bg-secondary-50 dark:bg-secondary-800 rounded text-sm space-y-1">
                            <p>* Semua booking bisa bayar full payment.</p>

                            {v.enable_dp && (
                                <p>
                                    * Bisa juga bayar DP{" "}
                                    {formatAmountByType(v.dp_type, v.dp_value)}
                                </p>
                            )}

                            {v.full_payment_days_before &&
                                v.max_full_payment_days && (
                                    <p>
                                        * Pelunasan harus dilakukan minimal{" "}
                                        <strong>
                                            {v.full_payment_days_before} hari
                                            sebelum tanggal main
                                        </strong>
                                        .
                                    </p>
                                )}

                            {v.apply_to_merchant && (
                                <p>* Berlaku juga untuk booking manual.</p>
                            )}

                            {!v.is_active && (
                                <p className="text-red-500 flex items-center gap-1">
                                    <AlertTriangle className="w-4 h-4" />
                                    Pengaturan dinonaktifkan.
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
