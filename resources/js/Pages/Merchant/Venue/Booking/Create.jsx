import { useState, useCallback } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import StepFieldSelection from "@/Pages/Merchant/Venue/Booking/Partials/StepFieldSelection";
import StepCustomerData from "@/Pages/Merchant/Venue/Booking/Partials/StepCustomerData";
import StepPayment from "@/Pages/Merchant/Venue/Booking/Partials/StepPayment";
import StepConfirmation from "@/Pages/Merchant/Venue/Booking/Partials/StepConfirmation";
import StepCompleted from "@/Pages/Merchant/Venue/Booking/Partials/StepCompleted";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import Stepper from "@/components/Common/Stepper";
import Step from "@/components/Common/Step";
import {
    Calendar,
    User,
    CreditCard,
    CheckCircle,
    ClipboardCheck,
} from "lucide-react";
import ConfirmModal from "@/components/Common/ConfirmModal";
import { toast } from "react-toastify";

const steps = [
    { label: "Lapangan", icon: Calendar },
    { label: "Konsumen", icon: User },
    { label: "Pembayaran", icon: CreditCard },
    { label: "Konfirmasi", icon: ClipboardCheck },
    { label: "Selesai", icon: CheckCircle },
];

export default function Create() {
    const { venue, fields = [], operators } = usePage().props;
    const [currentStep, setCurrentStep] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [formData, setFormData] = useState({
        bookingSelections: [],
        customer_id: null,
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        payment_type: "",
        payment_method: "",
        payment_date: null,
        payment_time: "",
        bank: "",
        digital_wallet: "",
        reference_number: "",
        sender_name: "",
        payment_amount: "",
    });

    const handleChange = (updates) => {
        setFormData((prev) => {
            const newData = { ...prev, ...updates };
            return newData;
        });
    };

    const handleNext = () => {
        // Step 0: Pilih Lapangan → wajib ada minimal 1 slot
        if (currentStep === 0 && formData.bookingSelections.length === 0) {
            toast.warning(
                "Pilih minimal 1 jadwal jam lapangan terlebih dahulu!"
            );
            return;
        }

        // Step 1: Data Konsumen → wajib nama & nomor HP
        if (currentStep === 1) {
            if (!formData.customer_name || !formData.customer_phone) {
                toast.warning(
                    "Isi nama dan nomor handphone konsumen terlebih dahulu!"
                );
                return;
            }
        }

        if (currentStep === 2) {
            if (!formData.payment_type || !formData.payment_method) {
                toast.warning("Pilih tipe dan metode pembayaran!");
                return;
            }

            const totalPrice = formData.bookingSelections.reduce(
                (sumDate, d) => {
                    const fieldsArr = Array.isArray(d.fields) ? d.fields : [];
                    return (
                        sumDate +
                        fieldsArr.reduce((sumF, f) => {
                            const slotsArr = Array.isArray(f.slots)
                                ? f.slots
                                : [];
                            return (
                                sumF +
                                slotsArr.reduce(
                                    (sumS, s) => sumS + Number(s.price),
                                    0
                                )
                            );
                        }, 0)
                    );
                },
                0
            );

            if (
                !formData.payment_amount ||
                Number(formData.payment_amount) <= 0
            ) {
                toast.warning("Masukkan jumlah pembayaran!");
                return;
            }

            if (Number(formData.payment_amount) > totalPrice) {
                toast.warning(
                    "Jumlah pembayaran tidak boleh melebihi total harga!"
                );
                return;
            }

            if (
                formData.payment_method === "bank_transfer" &&
                (!formData.bank ||
                    !formData.reference_number ||
                    !formData.sender_name ||
                    !formData.payment_proof)
            ) {
                toast.warning("Lengkapi semua data transfer bank!");
                return;
            }

            if (
                formData.payment_method === "e_wallet" &&
                (!formData.digital_wallet ||
                    !formData.reference_number ||
                    !formData.sender_name ||
                    !formData.payment_proof)
            ) {
                toast.warning("Lengkapi semua data e-wallet!");
                return;
            }
        }

        setCurrentStep((prev) => prev + 1);
    };

    const handleBack = () => setCurrentStep((prev) => prev - 1);
    // const handleNext = () => setCurrentStep((prev) => prev + 1);

    const handleSubmit = () => {
        if (!formData.bookingSelections.length) {
            return toast.warning("Silakan pilih minimal 1 slot booking.");
        }

        const payload = {
            customer: {
                name: formData.customer_name,
                phone_number: formData.customer_phone,
                user_id: formData.customer_id ?? null,
            },
            operator_assignment_id: formData.operator_id,
            details: formData.bookingSelections.flatMap((d) =>
                d.fields.flatMap((f) =>
                    f.slots.map((s) => ({
                        field_id: f.field_id,
                        time_slot_id: s.timeslot_id,
                        price: s.price,
                        booking_date: d.date,
                    }))
                )
            ),
            payment: {
                type: formData.payment_type,
                method: formData.payment_method,
                amount: formData.payment_amount,
                bank: formData.bank,
                digital_wallet: formData.digital_wallet,
                reference_number: formData.reference_number,
                sender_name: formData.sender_name,
                payment_date: formData.payment_date,
                payment_time: formData.payment_time,
            },
        };

        setIsProcessing(true);

        router.post(
            route("merchant.venues.bookings.store", { venue: venue.slug }),
            payload,
            {
                preserveState: false,
                preserveScroll: true,
                onSuccess: () => {
                    setIsProcessing(false);
                    setShowConfirm(false);
                    setCurrentStep(4);
                    toast.success("Booking berhasil dibuat!");
                },
                onError: (errors) => {
                    setIsProcessing(false);

                    if (errors && Object.keys(errors).length) {
                        const showErrors = (errs) => {
                            Object.values(errs).forEach((val) => {
                                if (Array.isArray(val)) {
                                    val.forEach((msg) => toast.error(msg));
                                } else if (typeof val === "object") {
                                    showErrors(val);
                                } else {
                                    toast.error(val);
                                }
                            });
                        };
                        showErrors(errors);
                    } else {
                        toast.error(
                            "Gagal membuat booking. Silakan coba lagi."
                        );
                    }
                },
            }
        );
    };

    return (
        <MerchantLayout>
            <Head title="Booking" />

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center p-4">
                        <h2 className="font-bold text-lg">Form Booking</h2>
                    </div>
                </CardHeader>
                <CardBody>
                    <div className="my-8 max-w-5xl mx-4 sm:mx-8 md:mx-12 lg:mx-20 xl:mx-28 2xl:mx-auto items-center text-center align-middle text-sm z-10">
                        <Stepper
                            steps={steps}
                            currentStep={currentStep}
                            onStepClick={setCurrentStep}
                        />

                        <div className="my-12">
                            {/* Step 1 - Pilih Lapangan */}
                            <Step isActive={currentStep === 0}>
                                <StepFieldSelection
                                    venue={venue}
                                    fields={fields}
                                    bookingSelections={
                                        formData.bookingSelections
                                    } // ✅ controlled by parent
                                    onChange={(selections) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            bookingSelections: selections,
                                        }))
                                    }
                                />
                            </Step>

                            {/* Step 2 - Data Konsumen */}
                            <Step isActive={currentStep === 1}>
                                <StepCustomerData
                                    venue={venue}
                                    onChange={handleChange}
                                />
                            </Step>

                            {/* Step 3 - Pembayaran */}
                            <Step isActive={currentStep === 2}>
                                <StepPayment
                                    formData={formData}
                                    fields={fields}
                                    bookingSelections={
                                        formData.bookingSelections
                                    } // ✅ lempar data
                                    onChange={handleChange}
                                />
                            </Step>

                            {/* Step 4 - Konfirmasi */}
                            <Step isActive={currentStep === 3}>
                                <StepConfirmation
                                    data={formData}
                                    venue={venue}
                                    fields={fields}
                                    operators={operators}
                                />
                            </Step>

                            {/* Step 5 - Selesai */}
                            <Step isActive={currentStep === 4}>
                                <StepCompleted data={formData} />
                            </Step>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="mt-4 flex justify-between">
                            <Button
                                disabled={currentStep === 0}
                                onClick={handleBack}
                            >
                                Sebelumnya
                            </Button>

                            {currentStep === 3 ? (
                                <Button onClick={() => setShowConfirm(true)}>
                                    Simpan
                                </Button>
                            ) : (
                                <Button onClick={handleNext}>
                                    Selanjutnya
                                </Button>
                            )}
                        </div>
                    </div>
                </CardBody>

                <CardFooter className="p-8 flex justify-end gap-2">
                    <Button
                        variant="light"
                        type="button"
                        onClick={() =>
                            router.get(
                                route("merchant.venues.bookings.index", {
                                    venue: venue.slug,
                                })
                            )
                        }
                    >
                        Kembali
                    </Button>
                </CardFooter>
            </Card>
            <ConfirmModal
                show={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleSubmit}
                title="Konfirmasi Simpan"
                description="Apakah Anda yakin ingin menyimpan booking ini?"
                confirmText="Ya, Simpan"
                cancelText="Batal"
                isProcessing={isProcessing}
            />
        </MerchantLayout>
    );
}
