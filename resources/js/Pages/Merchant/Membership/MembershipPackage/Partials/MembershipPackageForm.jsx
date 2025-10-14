import { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import InputLabel from "@/components/Common/LabelInput";
import TextInput from "@/components/Common/TextInput";
import InputError from "@/components/common/ErrorInput";
import Button from "@/components/Common/Button";
import NumericInput from "@/components/Common/NumericInput";
import CloseButtonModal from "@/components/Common/CloseButtonModal";
import MultiSelectCheckboxInput from "@/components/Common/MultiSelectCheckboxInput";
import SelectInput from "@/components/Common/SelectInput";
import { HelpCircle } from "lucide-react";
import Tippy from "@tippyjs/react";

export default function MembershipPackageForm({
    data,
    setData,
    errors,
    processing,
    handleSubmit,
    title,
    mode = "create",
    onClose,
    selectedBenefits,
    setSelectedBenefits,
}) {
    useEffect(() => {
        const resetDiscount = () => {
            setData("discount_name", null);
            setData("discount_type", null);
            setData("discount_value", null);
            setData("discount_limit", null);
            setData("discount_descriptions", null);
        };

        const resetOther = () => {
            setData("other_name", null);
            setData("other_descriptions", null);
        };

        if (selectedBenefits.includes("discount")) {
            if (!data.discount_name) {
                setData("discount_name", "Diskon");
            }
        } else {
            resetDiscount();
        }

        if (!selectedBenefits.includes("other")) {
            resetOther();
        }
    }, [selectedBenefits]);

    const benefits = [
        { value: "discount", label: "Diskon" },
        { value: "other", label: "Lainnya" },
    ];

    const discount_type = [
        { value: "percentage", label: "Persen" },
        { value: "fixed", label: "Harga Tetap" },
    ];

    return (
        <Card className="relative rounded-lg shadow-none border-none dark:border-none overflow-visible">
            <CloseButtonModal onClose={onClose} />
            <form onSubmit={handleSubmit}>
                <CardHeader className="py-2 px-4 border-none">
                    <h2 className="font-bold text-lg">{title}</h2>
                </CardHeader>

                <CardBody className="overflow-visible">
                    {/* Info Paket */}
                    <div className="flex flex-col gap-2">
                        <div className="text-sm font-bold">Informasi Dasar</div>
                        <div className="flex flex-row gap-2">
                            <div className="w-full">
                                <div className="flex flex-row gap-1 items-center">
                                    <InputLabel
                                        htmlFor="package_name"
                                        value="Nama Paket :"
                                        className="mb-1 text-xs font-bold"
                                    />
                                    <Tippy
                                        placement="top"
                                        content="Contoh: Paket (Basic, Standard, Premium), Paket (Basic, Pro, Elit), Paket (Bronze, Silver, Gold, Platinum), dan lain sebagainya"
                                    >
                                        <HelpCircle className="w-[14px] h-[14px] mb-1 text-secondary-600 dark:text-white" />
                                    </Tippy>
                                </div>
                                <TextInput
                                    id="package_name"
                                    name="package_name"
                                    placeholder="Paket (Basic, Standard, Premium), Paket (Basic, Pro, Elit)"
                                    value={data.package_name ?? ""}
                                    onChange={(e) =>
                                        setData("package_name", e.target.value)
                                    }
                                    className="w-full text-sm"
                                />
                                <InputError message={errors.package_name} />
                            </div>

                            <div className="w-full">
                                <div className="flex flex-row gap-1 items-center">
                                    <InputLabel
                                        htmlFor="package_duration_months"
                                        value="Durasi Paket (Bulan):"
                                        className="mb-1 text-xs font-bold"
                                    />
                                    <Tippy
                                        placement="top"
                                        content={
                                            <span className="text-sm">
                                                Durasi Paket dihitung
                                                berdasarkan 'x' bulan. <br />
                                                1 bulan = 30 hari. <br />
                                                Misalnya: 1 Januari - 30
                                                Januari, 30 Januari - 2 Maret,
                                                dan lain sebagainya.
                                            </span>
                                        }
                                    >
                                        <HelpCircle className="w-[14px] h-[14px] mb-1 text-secondary-600 dark:text-white" />
                                    </Tippy>
                                </div>
                                <NumericInput
                                    id="package_duration_months"
                                    name="package_duration_months"
                                    placeholder="Contoh: 1,2,3,6,12"
                                    value={data.package_duration_months ?? ""}
                                    onChange={(val) =>
                                        setData("package_duration_months", val)
                                    }
                                    className="w-full text-sm"
                                />
                                <InputError
                                    message={errors.package_duration_months}
                                />
                            </div>

                            <div className="w-full">
                                <InputLabel
                                    htmlFor="package_price"
                                    value="Harga Paket :"
                                    className="mb-1 text-xs font-bold"
                                />
                                <NumericInput
                                    id="package_price"
                                    name="package_price"
                                    placeholder="Rp. 0"
                                    prefix="Rp. "
                                    value={data.package_price ?? ""}
                                    onChange={(val) =>
                                        setData("package_price", val)
                                    }
                                    className="w-full text-sm"
                                />
                                <InputError message={errors.package_price} />
                            </div>
                        </div>

                        <div className="flex flex-row gap-2">
                            <div className="w-full">
                                <InputLabel
                                    htmlFor="package_descriptions"
                                    value="Deskripsi Paket :"
                                    className="mb-1 text-xs font-bold"
                                />
                                <TextInput
                                    id="package_descriptions"
                                    name="package_descriptions"
                                    placeholder="Tuliskan informasi singkat tentang paket keanggotaan.."
                                    value={data.package_descriptions ?? ""}
                                    onChange={(e) =>
                                        setData(
                                            "package_descriptions",
                                            e.target.value
                                        )
                                    }
                                    className="w-full text-sm"
                                />
                                <InputError
                                    message={errors.package_descriptions}
                                />
                            </div>
                            <div className="w-1/2">
                                <InputLabel
                                    htmlFor="benefit_type"
                                    value="Manfaat Paket :"
                                    className="mb-1 text-xs font-bold"
                                />
                                <MultiSelectCheckboxInput
                                    options={benefits}
                                    value={selectedBenefits}
                                    onChange={setSelectedBenefits}
                                    placeholder="Pilih Manfaat..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Manfaat */}
                    <div className="flex flex-col gap-2 mt-4">
                        {/* Diskon */}
                        {selectedBenefits.includes("discount") && (
                            <div className="flex flex-col gap-2 mt-2">
                                <div className="flex flex-row gap-1 items-center">
                                    <div className="text-sm font-bold">
                                        Potongan Harga (Diskon)
                                    </div>
                                    <Tippy
                                        placement="top"
                                        content={
                                            <span className="text-sm">
                                                Manfaat dari paket keanggotaan
                                                (membership) yang tidak
                                                terintegrasi dengan sistem
                                                booking web.
                                            </span>
                                        }
                                    >
                                        <HelpCircle className="w-[14px] h-[14px] text-secondary-600 dark:text-white" />
                                    </Tippy>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <div className="w-1/2">
                                        <InputLabel
                                            htmlFor="discount_name"
                                            value="Nama Manfaat :"
                                            className="mb-1 text-xs font-bold"
                                        />
                                        <TextInput
                                            id="discount_name"
                                            name="discount_name"
                                            value={data.discount_name ?? ""}
                                            readOnly
                                            className="w-full text-sm"
                                        />

                                        <InputError
                                            message={errors.discount_name}
                                        />
                                    </div>

                                    <div className="w-full">
                                        <InputLabel
                                            htmlFor="discount_descriptions"
                                            value="Deskripsi Manfaat :"
                                            className="mb-1 text-xs font-bold"
                                        />
                                        <TextInput
                                            id="discount_descriptions"
                                            name="discount_descriptions"
                                            placeholder="Tuliskan informasi singkat tentang manfaat dari potongan harga (diskon).."
                                            value={
                                                data.discount_descriptions ?? ""
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "discount_descriptions",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full text-sm"
                                        />
                                        <InputError
                                            message={
                                                errors.discount_descriptions
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-row gap-2">
                                    <div className="w-full">
                                        <InputLabel
                                            htmlFor="discount_type"
                                            value="Jenis Diskon :"
                                            className="mb-1 text-xs font-bold"
                                        />
                                        <SelectInput
                                            id="discount_type"
                                            name="discount_type"
                                            value={data.discount_type ?? ""}
                                            options={discount_type}
                                            onChange={(val) =>
                                                setData("discount_type", val)
                                            }
                                            placeholder="Pilih Jenis Diskon"
                                            isClearable={false}
                                            isSearchable={false}
                                            className="text-xs py-0"
                                        />
                                        <InputError
                                            message={errors.discount_type}
                                        />
                                    </div>

                                    <div className="w-full">
                                        <InputLabel
                                            htmlFor="discount_value"
                                            value="Nilai Diskon :"
                                            className="mb-1 text-xs font-bold"
                                        />
                                        <NumericInput
                                            id="discount_value"
                                            name="discount_value"
                                            placeholder={
                                                data.discount_type ===
                                                "percentage"
                                                    ? "Contoh: 10"
                                                    : "Contoh: 50000"
                                            }
                                            prefix={
                                                data.discount_type === "fixed"
                                                    ? "Rp. "
                                                    : ""
                                            }
                                            suffix={
                                                data.discount_type ===
                                                "percentage"
                                                    ? "%"
                                                    : ""
                                            }
                                            decimalSeparator=","
                                            decimalScale={
                                                data.discount_type ===
                                                    "percentage" &&
                                                mode === "edit"
                                                    ? 0
                                                    : 2
                                            }
                                            value={data.discount_value ?? ""}
                                            onChange={(val) =>
                                                setData("discount_value", val)
                                            }
                                            className="w-full text-sm"
                                        />
                                        <InputError
                                            message={errors.discount_value}
                                        />
                                    </div>

                                    <div className="w-full">
                                        <div className="flex flex-row gap-1 items-center">
                                            <InputLabel
                                                htmlFor="discount_limit"
                                                value="Batasan Diskon (Slot/ Jam) :"
                                                className="mb-1 text-xs font-bold"
                                            />
                                            <Tippy
                                                placement="top"
                                                content={
                                                    <span className="text-sm">
                                                        Contoh: Jika Durasi
                                                        Paket adalah 1 Bulan
                                                        maka batasan diskon
                                                        untuk potongan harga
                                                        hanya berlaku 4 kali
                                                        (jam/ slot). Jika
                                                        konsumen dalam 1 bulan
                                                        memesan atau bermain
                                                        dengan total 9 jam/ slot
                                                        maka diskon berlaku pada
                                                        4 jam di awal, sedangkan
                                                        5 jam dengan harga
                                                        normal.
                                                    </span>
                                                }
                                            >
                                                <HelpCircle className="w-[14px] h-[14px] mb-1 text-secondary-600 dark:text-white" />
                                            </Tippy>
                                        </div>
                                        <NumericInput
                                            id="discount_limit"
                                            name="discount_limit"
                                            placeholder="0"
                                            value={data.discount_limit ?? ""}
                                            onChange={(val) =>
                                                setData("discount_limit", val)
                                            }
                                            className="w-full text-sm"
                                        />
                                        <InputError
                                            message={errors.discount_limit}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Lainnya */}
                        {selectedBenefits.includes("other") && (
                            <div className="flex flex-col gap-2 mt-2">
                                <div className="flex flex-row gap-1 items-center">
                                    <div className="text-sm font-bold">
                                        Lainnya
                                    </div>
                                    <Tippy
                                        placement="top"
                                        content={
                                            <span className="text-sm">
                                                Manfaat dari paket keanggotaan
                                                (membership) yang tidak
                                                terintegrasi dengan sistem
                                                booking web.
                                            </span>
                                        }
                                    >
                                        <HelpCircle className="w-[14px] h-[14px] text-secondary-600 dark:text-white" />
                                    </Tippy>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <div className="w-1/2">
                                        <InputLabel
                                            htmlFor="other_name"
                                            value="Nama Manfaat :"
                                            className="mb-1 text-xs font-bold"
                                        />
                                        <TextInput
                                            id="other_name"
                                            name="other_name"
                                            placeholder="Contoh: Gratis air putih dan rompi"
                                            value={data.other_name ?? ""}
                                            onChange={(e) =>
                                                setData(
                                                    "other_name",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full text-sm"
                                        />
                                        <InputError
                                            message={errors.other_name}
                                        />
                                    </div>

                                    <div className="w-full">
                                        <InputLabel
                                            htmlFor="other_descriptions"
                                            value="Deskripsi Manfaat :"
                                            className="mb-1 text-xs font-bold"
                                        />
                                        <TextInput
                                            id="other_descriptions"
                                            name="other_descriptions"
                                            placeholder="Contoh: 2 botol air putih merek Vit dan 10 rompi"
                                            value={
                                                data.other_descriptions ?? ""
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "other_descriptions",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full text-sm"
                                        />
                                        <InputError
                                            message={errors.other_descriptions}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardBody>

                <CardFooter className="py-2 px-4 flex justify-end gap-2 border-none">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={processing}
                    >
                        {mode === "edit" ? "Perbarui" : "Tambah"}
                    </Button>
                    <Button variant="light" type="button" onClick={onClose}>
                        Batal
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
