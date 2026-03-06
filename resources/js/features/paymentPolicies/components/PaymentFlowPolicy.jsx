import BannerAlert from "@/components/Common/BannerAlert";
import Checkbox from "@/components/Common/Checkbox";
import ErrorInput from "@/components/Common/ErrorInput";
import LabelInput from "@/components/Common/LabelInput";
import NumericInput from "@/components/Common/NumericInput";
import SelectInput from "@/components/Common/SelectInput";

export default function PaymentFlowPolicy({
    venue,
    index = null,
    handleUpdateVenue,
    errors = {},
}) {
    const paymentTypeOptions = [
        { label: "Harga Tetap (Rp)", value: "fixed" },
        { label: "Persentase (%)", value: "percentage" },
    ];

    const onUpdate = (field, value) => {
        if (index !== null) {
            handleUpdateVenue(index, field, value);
        } else {
            handleUpdateVenue(field, value);
        }
    };

    return (
        <div className="flex-1 flex flex-col gap-4">
            <h4 className="text-sm font-bold text-secondary-700 dark:text-secondary-400 border-b border-secondary-100 dark:border-secondary-600 pb-2">
                Alur Pembayaran
            </h4>

            <div className="flex items-start gap-3 p-4 border border-secondary-100 dark:border-secondary-800 rounded-lg bg-secondary-100 dark:bg-secondary-900">
                <Checkbox
                    id={`enable-dp-${index ?? "single"}`}
                    checked={venue.enable_dp}
                    onChange={(e) => onUpdate("enable_dp", e.target.checked)}
                    className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                    <label
                        htmlFor={`enable-dp-${index ?? "single"}`}
                        className="font-bold cursor-pointer text-sm"
                    >
                        Aktifkan Pembayaran DP
                    </label>
                    <p className="text-[11px] text-secondary-500">
                        Pelanggan bisa membayar sebagian untuk booking.
                    </p>
                </div>
            </div>

            {venue.enable_dp && (
                <div className="flex flex-col gap-4 p-5 border-2 border-secondary-100 dark:border-secondary-700 rounded-lg ">
                    <div className="space-y-2">
                        <LabelInput className="text-[11px] font-bold text-primary-700">
                            NOMINAL DP
                        </LabelInput>
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="space-y-2 w-full">
                                <SelectInput
                                    value={venue.dp_type}
                                    options={paymentTypeOptions}
                                    onChange={(val) =>
                                        onUpdate(
                                            "dp_type",
                                            val?.target
                                                ? val.target.value
                                                : val,
                                        )
                                    }
                                    isClearable={false}
                                    isSearchable={false}
                                />
                                <ErrorInput
                                    message={
                                        index !== null
                                            ? errors[
                                                  `venue_policies.${index}.dp_type`
                                              ]
                                            : errors.dp_type
                                    }
                                />
                            </div>

                            <div className="space-y-2 w-full">
                                <NumericInput
                                    value={venue.dp_value}
                                    onChange={(val) =>
                                        onUpdate("dp_value", val)
                                    }
                                    prefix={
                                        venue.dp_type === "fixed" ? "Rp " : ""
                                    }
                                    suffix={
                                        venue.dp_type === "percentage"
                                            ? " %"
                                            : ""
                                    }
                                />
                                <ErrorInput
                                    message={
                                        index !== null
                                            ? errors[
                                                  `venue_policies.${index}.dp_value`
                                              ]
                                            : errors.dp_value
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <BannerAlert
                        type="info"
                        showIcon={false}
                        size="xs"
                        title="Kebijakan Standar Platform"
                    >
                        <span>
                            Batas pelunasan dan waktu bayar diatur secara
                            otomatis oleh sistem untuk menjamin keamanan
                            transaksi antara Mitra dan Pelanggan.
                        </span>
                    </BannerAlert>

                    <div className="flex flex-col 2xl:flex-row gap-4">
                        <div className="w-full space-y-2">
                            <LabelInput className="text-[11px] font-bold text-primary-700">
                                BATAS PELUNASAN (H- SEBELUM MAIN)
                            </LabelInput>
                            <NumericInput
                                value={venue.full_payment_days_before}
                                onChange={(val) =>
                                    onUpdate("full_payment_days_before", val)
                                }
                                suffix=" Hari"
                                readOnly={true}
                            />
                            <ErrorInput
                                message={errors.full_payment_days_before}
                            />
                        </div>

                        <div className="w-full space-y-2">
                            <LabelInput className="text-[11px] font-bold text-primary-700">
                                BATAS WAKTU BAYAR LUNAS (DARI PESAN)
                            </LabelInput>
                            <NumericInput
                                value={venue.max_full_payment_days}
                                onChange={(val) =>
                                    onUpdate("max_full_payment_days", val)
                                }
                                suffix=" Hari"
                                readOnly={true}
                            />
                            <ErrorInput
                                message={errors.max_full_payment_days}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
