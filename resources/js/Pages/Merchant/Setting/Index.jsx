import { Head, usePage } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import { Card, CardHeader, CardBody } from "@/components/Common/Card";
import Tabs from "@/components/Common/Tabs";
import { CreditCard } from "lucide-react";
import PaymentTypeSetting from "@/Pages/Merchant/Setting/Partials/PaymentTypeSetting";
import PaymentMethodSetting from "@/Pages/Merchant/Setting/Partials/PaymentMethodSetting";

export default function Index() {
    const { merchant } = usePage().props;

    console.log("merchant: ", merchant);

    const tabs = [
        {
            id: "payment",
            label: (
                <span className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pembayaran
                </span>
            ),
            children: [
                {
                    id: "payment-type",
                    label: "Tipe Pembayaran",
                    content: <PaymentTypeSetting merchant={merchant} />,
                },
                {
                    id: "payment-method",
                    label: "Metode Pembayaran",
                    content: <PaymentMethodSetting merchant={merchant} />,
                },
            ],
        },
    ];

    return (
        <MerchantLayout>
            <Head title="Pengaturan Merchant" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader>
                    <div className="flex justify-between items-center p-4">
                        <div className="font-bold uppercase text-xl">
                            Pengaturan {merchant.name}
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="px-4 pb-8">
                    <div className="m-4">
                        <Tabs
                            tabs={tabs}
                            defaultActive={0}
                            orientation="vertical"
                            className="text-sm"
                        />
                    </div>
                </CardBody>
            </Card>
        </MerchantLayout>
    );
}
