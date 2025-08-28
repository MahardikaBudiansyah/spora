import { useState, useCallback } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import StepFieldSelection from "@/Pages/Merchant/Booking/Partials/StepFieldSelection";
import StepCustomerData from "@/Pages/Merchant/Booking/Partials/StepCustomerData";
import StepPayment from "@/Pages/Merchant/Booking/Partials/StepPayment";
import StepConfirmation from "@/Pages/Merchant/Booking/Partials/StepConfirmation";
import StepCompleted from "@/Pages/Merchant/Booking/Partials/StepCompleted";
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

const steps = [
    { label: "Lapangan", icon: Calendar },
    { label: "Konsumen", icon: User },
    { label: "Pembayaran", icon: CreditCard },
    { label: "Konfirmasi", icon: ClipboardCheck },
    { label: "Selesai", icon: CheckCircle },
];

export default function Create() {
    const { venue, fields = [] } = usePage().props;
    const [currentStep, setCurrentStep] = useState(0);

    const [formData, setFormData] = useState({
        bookingSelections: [], // hasil dari StepFieldSelection
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
    console.log("booking: ", formData.bookingSelections);

    const handleChange = (updates) => {
        setFormData((prev) => {
            const newData = { ...prev, ...updates };
            return newData;
        });
    };

    const handleSelectionsChange = useCallback((selections) => {
        setFormData((prev) => ({
            ...prev,
            bookingSelections: selections,
        }));
    }, []);

    const handleNext = () => setCurrentStep((prev) => prev + 1);
    const handleBack = () => setCurrentStep((prev) => prev - 1);

    const handleSubmit = () => {
        router.post("/merchant/bookings", formData);
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
                            {currentStep === steps.length - 1 ? (
                                <Button onClick={handleSubmit}>Simpan</Button>
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
        </MerchantLayout>
    );
}
