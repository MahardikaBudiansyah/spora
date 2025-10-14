import React from "react";
import Button from "@/components/Common/Button";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
} from "@/components/Common/Card";
import { getMembershipStatus } from "@/utils/membershipAttribute";
import { getInvoiceStatus } from "@/utils/invoiceAttribute";
import { formatShortDate } from "@/utils/date";
import { formatRupiah } from "@/utils/currency";
import Badge from "@/components/common/Badge";
import { CreditCard, IdCard, RectangleEllipsis, FileText } from "lucide-react";
import Pagination from "@/components/Common/Pagination";

export default function MembershipHistory({
    memberships,
    pagination,
    meta,
    className = "",
}) {
    if (!memberships || memberships.length === 0) {
        return <p className="text-gray-500">Belum ada riwayat membership.</p>;
    }

    console.log("memberships: ", memberships);

    const getPaymentButtonLabel = (status) => {
        const map = {
            unpaid: "Bayar Sekarang",
            partial: "Bayar Lunas (DP)",
            paid: "Membership Venue Lainnya",
        };
        return map[status] || null;
    };

    const getCardActions = (membership) => {
        const actions = [];
        const invoice = membership.invoice;
        if (!invoice) return actions;

        const label = getPaymentButtonLabel(invoice.status);

        if (invoice.status === "unpaid" || invoice.status === "partial") {
            actions.push({ label, type: "payment" });
        } else if (invoice.status === "paid") {
            actions.push({ label, type: "rebook" });
        }

        if (membership.status === "active" && !membership.has_review) {
            actions.push({ label: "Isi Testimoni", type: "review" });
        }

        return actions;
    };

    const handleAction = (action, membership) => {
        switch (action.type) {
            case "payment":
                window.location.href = route(
                    "user.memberships.payment",
                    membership.id
                );
                break;
            case "review":
                window.location.href = route(
                    "user.memberships.review",
                    membership.id
                );
                break;
            case "rebook":
                window.location.href = route("venue");
                break;
            default:
                break;
        }
    };

    const handleNavigate = (url) => {
        if (url) Inertia.visit(url, { preserveScroll: true });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium">Riwayat Membership</h2>
            </header>

            <div className="mt-6 flex flex-col gap-6">
                {memberships.map((membership) => {
                    const { label, color } = getMembershipStatus(
                        membership.status,
                        membership.is_queued
                    );
                    const invoice = membership.invoice;
                    const invoiceInfo = invoice
                        ? getInvoiceStatus(invoice.status)
                        : null;

                    const pkg = membership.membership_package;

                    return (
                        <Card
                            key={membership.id}
                            id={`order-${
                                membership.invoice?.invoice_no || membership.id
                            }`}
                            className="py-6 px-4 border rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-secondary-800 transition"
                        >
                            {/* HEADER */}
                            <CardHeader className="flex flex-col gap-2 border-none">
                                <div className="flex items-center gap-2">
                                    <div className="font-bold">
                                        {membership?.order_no || "-"}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatShortDate(membership.created_at)}
                                    </div>
                                    <Badge color={color} className="font-bold">
                                        {label}
                                    </Badge>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {invoice && invoice.status !== "unpaid" && (
                                        <>
                                            <FileText className="w-5 h-5" />
                                            <div className="uppercase font-semibold text-gray-700 dark:text-gray-300">
                                                {invoice.invoice_no}
                                            </div>
                                            <Badge
                                                color={invoiceInfo.color}
                                                className="font-bold"
                                            >
                                                {invoiceInfo.label}
                                            </Badge>
                                        </>
                                    )}
                                </div>
                            </CardHeader>

                            {/* BODY */}
                            <CardBody className="flex flex-col gap-2">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <IdCard className="w-5 h-5" />
                                            <div className="font-bold">
                                                {membership?.membership_user
                                                    ?.member_no || "-"}
                                            </div>
                                            <div className="font-semibold">
                                                {
                                                    membership
                                                        ?.membership_package
                                                        ?.venue?.name
                                                }
                                            </div>
                                        </div>
                                        <div className="font-semibold text-primary-600 dark:text-primary-400">
                                            {pkg?.name}
                                        </div>

                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            Periode:{" "}
                                            {formatShortDate(
                                                membership.start_date
                                            )}{" "}
                                            -{" "}
                                            {formatShortDate(
                                                membership.end_date
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-2 sm:mt-0 text-right">
                                        <span className="font-bold ">
                                            {formatRupiah(
                                                membership.total_price
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </CardBody>

                            {/* FOOTER */}
                            <CardFooter className="flex gap-2 justify-end items-center border-none">
                                {getCardActions(membership).map(
                                    (action, idx) => (
                                        <Button
                                            key={idx}
                                            variant="primary"
                                            onClick={() =>
                                                handleAction(action, membership)
                                            }
                                        >
                                            {action.label}
                                        </Button>
                                    )
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            <div className="my-8">
                <Pagination
                    links={pagination}
                    meta={meta}
                    onNavigate={handleNavigate}
                    className="justify-center"
                />
            </div>
        </section>
    );
}
