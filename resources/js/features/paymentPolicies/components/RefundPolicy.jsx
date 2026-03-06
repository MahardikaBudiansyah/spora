import BannerAlert from "@/components/Common/BannerAlert";
import Checkbox from "@/components/Common/Checkbox";
import ErrorInput from "@/components/Common/ErrorInput";
import LabelInput from "@/components/Common/LabelInput";
import NumericInput from "@/components/Common/NumericInput";

export default function RefundPolicy({
    venue,
    index = null,
    handleUpdateVenue,
    errors = {},
}) {
    const onUpdate = (field, value) => {
        if (index !== null) {
            handleUpdateVenue(index, field, value);
        } else {
            handleUpdateVenue(field, value);
        }
    };

    const getErrorMessage = (field) => {
        return index !== null
            ? errors[`venue_policies.${index}.${field}`]
            : errors[field];
    };

    return (
        <div className="w-full md:w-[40%] flex flex-col gap-4">
            <h4 className="text-sm font-bold text-secondary-700 dark:text-secondary-400 border-b border-secondary-100 dark:border-secondary-600 pb-2">
                Kebijakan Pembatalan
            </h4>

            <div className="flex items-start gap-3 p-4 border border-secondary-100 dark:border-secondary-800 rounded-lg bg-secondary-100 dark:bg-secondary-900">
                <Checkbox
                    id={`enable-refund-${index ?? "single"}`}
                    checked={venue.enable_refund}
                    onChange={(e) =>
                        onUpdate("enable_refund", e.target.checked)
                    }
                    className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                    <label
                        htmlFor={`enable-refund-${index ?? "single"}`}
                        className="font-bold cursor-pointer text-sm"
                    >
                        Aktifkan Refund
                    </label>
                    <p className="text-[11px] text-secondary-500">
                        Izinkan pengembalian dana pembatalan.
                    </p>
                </div>
            </div>

            {venue.enable_refund && (
                <div className="flex flex-col gap-4 p-5 border-2 border-secondary-100 dark:border-secondary-700 rounded-lg">
                    <BannerAlert
                        type="warning"
                        showIcon={false}
                        size="xs"
                        title="Informasi Pengembalian Dana"
                    >
                        <span>
                            Dana akan dikembalikan ke saldo pelanggan sesuai
                            persentase yang ditetapkan. Proses ini akan memotong
                            biaya layanan platform secara otomatis.
                        </span>
                    </BannerAlert>
                    <div className="space-y-2">
                        <LabelInput className="text-[11px] font-bold text-orange-700">
                            PERSENTASE REFUND
                        </LabelInput>
                        <NumericInput
                            value={venue.refund_percentage}
                            onChange={(val) =>
                                onUpdate("refund_percentage", val)
                            }
                            suffix=" %"
                            max={100}
                        />
                        <p className="text-[10px] text-orange-600 italic">
                            Nilai total dana yang dikembalikan.
                        </p>
                        <ErrorInput
                            message={getErrorMessage("refund_percentage")}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
