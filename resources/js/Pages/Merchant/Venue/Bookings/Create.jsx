import { useState, useMemo } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import StepCourtSelection from "@/features/orders/components/steps/StepCourtSelection";
import StepCustomerData from "@/features/orders/components/steps/StepCustomerData";
import StepPayment from "@/features/orders/components/steps/StepPayment";
import StepConfirmation from "@/features/orders/components/steps/StepConfirmation";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import Stepper from "@/components/Common/Stepper";
import Step from "@/components/Common/Step";
import ConfirmModal from "@/components/Common/ConfirmModal";
import {
    Calendar,
    User,
    CreditCard,
    ClipboardCheck,
    ArrowLeft,
} from "lucide-react";
import { useMerchantBooking } from "@/features/orders/hooks/useMerchantBooking";

const steps = [
    { label: "Lapangan", icon: Calendar },
    { label: "Konsumen", icon: User },
    { label: "Pembayaran", icon: CreditCard },
    { label: "Konfirmasi", icon: ClipboardCheck },
];

export default function Create() {
    const {
        venue: { data: venue },
        courts = { data: courts },
        operators,
    } = usePage().props;

    const {
        form,
        currentStep,
        setCurrentStep,
        stepErrors,
        handleNext,
        handleBack,
        handleStepChange,
        activePolicy,
        minAmountRequired,
        remainingAmount,
        displayData,
        submit,
    } = useMerchantBooking(venue, "venue");

    const { processing, errors: serverErrors } = form;
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const isNextDisabled = useMemo(() => {
        return form.processing;
    }, [form.processing, currentStep, form.data]);

    const handleDirectStepClick = (targetStep) => {
        if (targetStep < currentStep) {
            setCurrentStep(targetStep);
        }
    };

    const handleConfirmSubmit = () => {
        setIsConfirmOpen(false);
        submit();
    };

    return (
        <MerchantLayout>
            <Head title="Tambah Booking" />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <form onSubmit={(e) => e.preventDefault()}>
                    <CardHeader className="p-4 md:p-6">
                        <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                            <div className="flex flex-col md:gap-1 md:text-left">
                                <div className="flex flex-wrap flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                    <span>Tambah</span>
                                    <span className="text-primary-600 dark:text-primary-500">
                                        Booking
                                    </span>
                                </div>
                                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                                    {venue.name}
                                </span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="p-0 my-8 max-w-5xl mx-4 sm:mx-8 md:mx-12 lg:mx-20 xl:mx-28 2xl:mx-auto items-center text-center align-middle">
                        <Stepper
                            steps={steps}
                            currentStep={currentStep}
                            onStepClick={handleDirectStepClick}
                        />

                        <div className="my-12">
                            {/* Step 1 - Pilih Lapangan */}
                            <Step isActive={currentStep === 0}>
                                <StepCourtSelection
                                    venue={venue}
                                    courts={courts}
                                    bookingSelections={
                                        form.data.bookingSelections || []
                                    }
                                    onChange={(updateFn) => {
                                        form.setData(
                                            "bookingSelections",
                                            updateFn(
                                                form.data.bookingSelections,
                                            ),
                                        );
                                    }}
                                    errors={form.errors}
                                />
                            </Step>

                            {/* Step 2 - Data Konsumen */}
                            <Step isActive={currentStep === 1}>
                                <StepCustomerData
                                    venue={venue}
                                    value={form.data}
                                    onChange={handleStepChange}
                                    mode="booking"
                                    errors={{ ...stepErrors, ...serverErrors }}
                                />
                            </Step>

                            {/* Step 3 - Pembayaran */}
                            <Step isActive={currentStep === 2}>
                                <StepPayment
                                    venue={venue}
                                    value={form.data}
                                    activePolicy={activePolicy}
                                    minAmountRequired={minAmountRequired}
                                    remainingAmount={remainingAmount}
                                    displayData={displayData}
                                    onChange={handleStepChange}
                                    mode="booking"
                                    errors={{ ...stepErrors, ...serverErrors }}
                                />
                            </Step>

                            <Step isActive={currentStep === 3}>
                                <StepConfirmation
                                    venue={venue}
                                    value={form.data}
                                    activePolicy={activePolicy}
                                    minAmountRequired={minAmountRequired}
                                    remainingAmount={remainingAmount}
                                    displayData={displayData}
                                    mode="booking"
                                    // operators={operators}
                                />
                            </Step>
                        </div>

                        <div className="mt-4 flex justify-between">
                            <Button
                                type="button"
                                disabled={currentStep === 0 || processing}
                                onClick={handleBack}
                            >
                                Sebelumnya
                            </Button>

                            {currentStep === 3 ? (
                                <Button
                                    type="submit"
                                    onClick={() => setIsConfirmOpen(true)}
                                    disabled={processing}
                                    variant="primary"
                                >
                                    {processing ? "Memproses..." : "Simpan"}
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={isNextDisabled}
                                >
                                    Selanjutnya
                                </Button>
                            )}
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
                                    }),
                                )
                            }
                            className="flex gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Kembali</span>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </MerchantLayout>
    );
}
