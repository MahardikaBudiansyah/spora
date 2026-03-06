import React from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import InputLabel from "@/components/Common/LabelInput";
import InputError from "@/components/common/ErrorInput";
import Button from "@/components/Common/Button";
import TextInput from "@/components/Common/TextInput";
import CloseButtonModal from "@/components/Common/CloseButtonModal";
import TextArea from "@/components/Common/TextArea";
import SelectInput from "@/components/Common/SelectInput";
import SuggestionDropdown from "@/components/Common/SuggestionDropdown";
import BannerAlert from "@/components/Common/BannerAlert";
import { formatTo08 } from "@/utils/numberPhone";
import { twMerge } from "tailwind-merge";

export default function MembershipCardForm({
    title,
    data,
    setData,
    errors,
    processing,
    handleSubmit,
    onClose,
    suggestions,
    banner,
    onPhoneChange,
    onEmailChange,
    onSelectSuggestion,
    renderItem,
    venueOptions = [],
    isVenueFixed = false,
    isPhoneDisabled = false,
    isNameReadOnly = false,
    isEmailReadOnly = false,
}) {
    const isEditMode = !!data.member_no;
    const isSubmitDisabled = processing || banner?.type === "error";

    return (
        <Card className="relative rounded-lg shadow-none border-none dark:border-none overflow-visible">
            <CloseButtonModal onClose={onClose} />
            <form
                onSubmit={handleSubmit}
                className="animate-in fade-in duration-500"
            >
                <CardHeader className="py-2 px-4 border-none">
                    <h2 className="font-bold text-lg md:text-xl text-primary-600 dark:text-primary-500">
                        {title}
                    </h2>
                </CardHeader>
                <CardBody className="py-4 overflow-visible flex flex-col gap-3">
                    {banner && (
                        <BannerAlert
                            type={banner.type}
                            closable={false}
                            className="py-2 px-4 font-semibold"
                        >
                            {banner.message}
                        </BannerAlert>
                    )}

                    {!isVenueFixed && (
                        <div className="w-full">
                            <InputLabel
                                htmlFor="venue_id"
                                value="Pilih Venue:"
                                className="mb-1 text-xs font-bold"
                            />
                            <SelectInput
                                id="venue_id"
                                value={data.venue_id}
                                options={venueOptions}
                                onChange={(val) => setData("venue_id", val)}
                                placeholder="Pilih Venue"
                                isClearable={false}
                                isSearchable={false}
                                disabled={isEditMode}
                            />
                            <InputError message={errors.venue_id} />
                        </div>
                    )}

                    {isEditMode && (
                        <div className="w-full">
                            <InputLabel
                                htmlFor="member_no"
                                value="Nomor Member:"
                                className="mb-1 text-xs font-bold"
                            />
                            <TextInput
                                id="member_no"
                                value={data.member_no}
                                readOnly
                                className="bg-secondary-100"
                            />
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full flex flex-col gap-3">
                            {/* 💡 Nomor Handphone dengan Suggestion */}
                            <div className="w-full">
                                <InputLabel
                                    htmlFor="customer_phone"
                                    value="Nomor Handphone:"
                                    className="mb-1 text-xs font-bold"
                                />
                                <div
                                    className={twMerge(
                                        "relative transition-opacity",
                                        !data.venue_id && !isEditMode
                                            ? "opacity-50"
                                            : "opacity-100"
                                    )}
                                >
                                    <SuggestionDropdown
                                        value={formatTo08(data.customer_phone)}
                                        onChange={(val) =>
                                            onPhoneChange({ phone: val })
                                        }
                                        suggestions={suggestions}
                                        renderItem={renderItem}
                                        onSelect={onSelectSuggestion}
                                        placeholder={
                                            !data.venue_id
                                                ? "Pilih venue terlebih dahulu..."
                                                : "0812..."
                                        }
                                        disabled={isPhoneDisabled}
                                        readOnly={isEditMode}
                                        onlyNumber
                                    />
                                    <InputError
                                        message={errors.customer_phone}
                                    />
                                </div>
                            </div>

                            <div className="w-full">
                                <InputLabel
                                    htmlFor="customer_name"
                                    value="Nama Member:"
                                    className="mb-1 text-xs font-bold"
                                />
                                <TextInput
                                    id="customer_name"
                                    value={data.customer_name}
                                    onChange={(e) =>
                                        setData("customer_name", e.target.value)
                                    }
                                    readOnly={isNameReadOnly}
                                    placeholder="Masukkan nama lengkap"
                                />
                                <InputError message={errors.customer_name} />
                            </div>

                            <div className="w-full">
                                <InputLabel
                                    htmlFor="customer_email"
                                    value="Email Member:"
                                    className="mb-1 text-xs font-bold"
                                />
                                <TextInput
                                    id="customer_email"
                                    type="email"
                                    value={data.customer_email ?? ""}
                                    onChange={onEmailChange}
                                    readOnly={isEmailReadOnly}
                                    placeholder="contoh@email.com"
                                />
                                <InputError message={errors.customer_email} />
                            </div>
                        </div>

                        <div className="w-full flex flex-col">
                            <InputLabel
                                htmlFor="notes"
                                value="Catatan:"
                                className="mb-1 text-xs font-bold"
                            />
                            <TextArea
                                id="notes"
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                placeholder="Tambah catatan tambahan..."
                                className="h-full md:min-h-[150px]"
                            />
                            <InputError message={errors.notes} />
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="py-2 px-4 flex justify-end gap-2 border-none">
                    <Button
                        type="submit"
                        variant="primary"
                        size="xs"
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                        className={
                            isSubmitDisabled
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }
                    >
                        {processing
                            ? "Memproses..."
                            : isEditMode
                            ? "Update Member"
                            : "Daftar Member"}
                    </Button>
                    <Button
                        type="button"
                        variant="light"
                        size="xs"
                        onClick={onClose}
                        disabled={processing}
                    >
                        Batal
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
