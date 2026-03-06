import { useState, useEffect } from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";

import MerchantLayout from "@/Layouts/MerchantLayout";

import { Card, CardHeader, CardBody } from "@/components/Common/Card";

export default function Index() {
    return (
        <MerchantLayout>
            <Head title="Informasi Staff" />
            <Card className="flex flex-col h-full min-h-screen rounded-lg shadow-none dark:border-none">
                <CardHeader></CardHeader>
                <CardBody className="px-0"></CardBody>
            </Card>
        </MerchantLayout>
    );
}
