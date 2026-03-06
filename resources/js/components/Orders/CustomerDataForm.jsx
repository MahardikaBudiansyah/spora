import { useCallback } from "react";
import LabelInput from "@/components/Common/LabelInput";
import TextInput from "@/components/Common/TextInput";
import BannerAlert from "@/components/Common/BannerAlert";
import SuggestionDropdown from "@/components/Common/SuggestionDropdown";
import { formatTo08 } from "@/utils/numberPhone";

export default function CustomerDataForm({
    value,
    onChange,
    suggestions,
    loading,
    banner,
    onCloseBanner,
    onPhoneChange,
    onSelectSuggestion,
    renderItem,
    isNameDisabled,
    isEmailDisabled,
}) {
    const sync = useCallback((updates) => onChange(updates), [onChange]);

    return (
        <div className="flex flex-col gap-2 text-left">
            {banner && (
                <BannerAlert
                    type={banner.type}
                    closable
                    onClose={onCloseBanner}
                    className="py-2 px-4 font-semibold"
                >
                    {banner.message}
                </BannerAlert>
            )}

            <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                    <div className="md:w-1/5 flex justify-between items-center">
                        <LabelInput
                            htmlFor="customer_phone"
                            value="Nomor Handphone"
                            className="font-bold text-sm"
                        />
                        <span>:</span>
                    </div>

                    <div className="relative flex-1">
                        <SuggestionDropdown
                            value={formatTo08(value.customer_phone ?? "")}
                            onChange={onPhoneChange}
                            suggestions={suggestions}
                            onSelect={onSelectSuggestion}
                            renderItem={renderItem}
                            placeholder="Masukan Nomor Handphone"
                            minLength={4}
                            loading={loading}
                            onlyNumber
                            maxResults={3}
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                    <div className="md:w-1/5 flex justify-between items-center">
                        <LabelInput
                            htmlFor="customer_email"
                            value="Email"
                            className="font-bold text-sm"
                        />
                        <span>:</span>
                    </div>
                    <div className="flex-1">
                        <TextInput
                            id="customer_email"
                            type="email"
                            value={value.customer_email ?? ""}
                            disabled={isEmailDisabled}
                            placeholder="Masukan Email Konsumen (opsional)"
                            onChange={(e) =>
                                sync({ customer_email: e.target.value })
                            }
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                    <div className="md:w-1/5 flex justify-between items-center">
                        <LabelInput
                            htmlFor="customer_name"
                            value="Nama"
                            className="font-bold text-sm"
                        />
                        <span>:</span>
                    </div>
                    <div className="flex-1">
                        <TextInput
                            id="customer_name"
                            value={value.customer_name ?? ""}
                            disabled={isNameDisabled}
                            placeholder="Masukan Nama Konsumen"
                            onChange={(e) =>
                                sync({ customer_name: e.target.value })
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
