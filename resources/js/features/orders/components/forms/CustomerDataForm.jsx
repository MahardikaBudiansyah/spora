import { useCallback } from "react";
import LabelInput from "@/components/Common/LabelInput";
import TextInput from "@/components/Common/TextInput";
import BannerAlert from "@/components/Common/BannerAlert";
import SuggestionDropdown from "@/components/Common/SuggestionDropdown";
import { formatTo08 } from "@/utils/numberPhone";
import ErrorInput from "@/components/Common/ErrorInput";

export default function CustomerDataForm({
    value,
    onChange,
    suggestions,
    loading,
    errors = {},
    banner,
    onCloseBanner,
    onPhoneChange,
    onEmailBlur,
    onSelectSuggestion,
    renderItem,
    isNameDisabled,
    isEmailDisabled,
}) {
    const sync = useCallback(
        (field, val) => {
            onChange((prev) => ({
                ...prev,
                [field]: val,
            }));
        },
        [onChange]
    );

    return (
        <div className="flex flex-col gap-2 text-left">
            {banner && (
                <BannerAlert
                    type={banner.type}
                    closable
                    onClose={onCloseBanner}
                    className="py-2 px-4 font-semibold mb-4"
                >
                    {banner.message}
                </BannerAlert>
            )}

            <div className="flex flex-col gap-5">
                <FormRow
                    label="Nomor HP"
                    htmlFor="customer_phone"
                    errorKey="customer_phone"
                    errors={errors}
                >
                    <SuggestionDropdown
                        value={formatTo08(value.customer_phone ?? "")}
                        onChange={onPhoneChange}
                        isError={!!errors.customer_phone}
                        suggestions={suggestions}
                        onSelect={onSelectSuggestion}
                        renderItem={renderItem}
                        placeholder="Masukan Nomor Handphone"
                        loading={loading}
                        onlyNumber
                    />
                </FormRow>

                <div className="space-y-5">
                    <FormRow
                        label="Email"
                        htmlFor="customer_email"
                        errorKey="customer_email"
                        errors={errors}
                    >
                        <TextInput
                            id="customer_email"
                            type="email"
                            value={value.customer_email ?? ""}
                            disabled={isEmailDisabled}
                            placeholder="Masukan Email Konsumen (opsional)"
                            onChange={(e) =>
                                sync("customer_email", e.target.value)
                            }
                            onBlur={onEmailBlur}
                            isError={!!errors.customer_email}
                        />
                    </FormRow>

                    <FormRow
                        label="Nama"
                        htmlFor="customer_name"
                        errorKey="customer_name"
                        errors={errors}
                    >
                        <TextInput
                            id="customer_name"
                            value={value.customer_name ?? ""}
                            disabled={isNameDisabled}
                            placeholder="Masukan Nama Konsumen"
                            onChange={(e) =>
                                sync("customer_name", e.target.value)
                            }
                            isError={!!errors.customer_name}
                        />
                    </FormRow>
                </div>
            </div>
        </div>
    );
}

const FormRow = ({ label, children, htmlFor, errorKey, errors }) => (
    <div className="flex flex-col md:flex-row gap-2 md:items-start">
        <div className="md:w-1/5 flex md:justify-between items-center md:pt-2.5">
            <LabelInput
                htmlFor={htmlFor}
                value={label}
                className="font-bold text-sm"
            />
            <span className="hidden md:inline">:</span>
        </div>
        <div className="flex flex-col gap-1 flex-1">
            {children}
            {errors[errorKey] && <ErrorInput message={errors[errorKey]} />}
        </div>
    </div>
);
