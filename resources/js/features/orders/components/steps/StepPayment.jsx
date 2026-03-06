import React, { useState } from "react";
import PreviewOrderMembershipPackage from "@/features/orders/components/summaries/MerchantPreviewOrderMembershipPackage";
import MerchantPreviewBooking from "@/features/orders/components/summaries/MerchantPreviewBooking";
import MerchantOrderBillingSummary from "@/features/orders/components/summaries/MerchantOrderBillingSummary";
import PaymentForm from "@/features/orders/components/forms/PaymentForm";
import ContentCard from "@/components/cards/ContentCard";
import { Wallet } from "lucide-react";

export default function StepPayment({
    venue,
    value,
    activePolicy,
    minAmountRequired,
    remainingAmount,
    displayData,
    onChange,
    mode = "booking",
    errors = {},
}) {
    const [previewOpen, setPreviewOpen] = useState(true);

    return (
        <div className="flex flex-col gap-2 text-left overflow-visible">
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full">
                    {mode === "membership" ? (
                        <PreviewOrderMembershipPackage
                            venue={venue}
                            membershipPackage={value.package}
                            startDate={value.start_date}
                            endDate={value.end_date}
                            price={value.price}
                            duration={value.duration}
                            open={previewOpen}
                            onToggleOpen={() => setPreviewOpen((v) => !v)}
                        />
                    ) : (
                        <MerchantPreviewBooking
                            variant="plain"
                            venue={venue}
                            bookingSelections={value.bookingSelections}
                        />
                    )}
                </div>

                <div className="w-full flex flex-col gap-8">
                    <MerchantOrderBillingSummary
                        variant="plain"
                        mode={mode}
                        displayData={displayData}
                        value={value}
                        activePolicy={activePolicy}
                        minAmountRequired={minAmountRequired}
                        remainingAmount={remainingAmount}
                    />

                    <ContentCard
                        title="Formulir Pembayaran"
                        icon={Wallet}
                        className="shadow-none"
                    >
                        <PaymentForm
                            type={mode}
                            formData={value}
                            onChange={onChange}
                            errors={errors}
                            showProof={true}
                            paymentPolicy={activePolicy}
                            minAmountRequired={minAmountRequired}
                        />
                    </ContentCard>
                </div>
            </div>
        </div>
    );
}
