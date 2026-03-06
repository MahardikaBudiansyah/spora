import React from "react";
import MerchantOrderVenueSummary from "@/features/orders/components/summaries/MerchantOrderVenueSummary";
import MerchantOrderMembershipPackageSummary from "@/features/orders/components/summaries/MerchantOrderMembershipPackageSummary";
import MerchantOrderCustomerSummary from "@/features/orders/components/summaries/MerchantOrderCustomerSummary";
import MerchantOrderBillingSummary from "@/features/orders/components/summaries/MerchantOrderBillingSummary";
import MerchantOrderPaymentTransactionSummary from "@/features/orders/components/summaries/MerchantOrderPaymentTransactionSummary";
import MerchantPreviewBooking from "@/features/orders/components/summaries/MerchantPreviewBooking";

export default function StepConfirmation({
    venue,
    value,
    activePolicy,
    minAmountRequired,
    remainingAmount,
    displayData,
    operators,
    mode = "booking",
}) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <MerchantOrderVenueSummary
                        operators={operators}
                        venue={venue}
                    />
                    {mode === "membership" ? (
                        <MerchantOrderMembershipPackageSummary
                            membershipSelection={value}
                        />
                    ) : (
                        <MerchantPreviewBooking
                            variant="elevated"
                            venue={venue}
                            bookingSelections={value.bookingSelections}
                        />
                    )}
                </div>

                <div className="space-y-6">
                    <MerchantOrderCustomerSummary
                        customer={{
                            name: value.customer_name,
                            phone: value.customer_phone,
                            email: value.customer_email,
                            member_no: value.member_no,
                        }}
                    />
                    <MerchantOrderBillingSummary
                        variant="elevated"
                        mode={mode}
                        displayData={displayData}
                        value={value}
                        activePolicy={activePolicy}
                        minAmountRequired={minAmountRequired}
                        remainingAmount={remainingAmount}
                    />

                    <MerchantOrderPaymentTransactionSummary
                        paymentData={value}
                    />
                </div>
            </div>
        </div>
    );
}
