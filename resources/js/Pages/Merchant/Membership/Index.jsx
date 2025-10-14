import { Head, usePage, router } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import { Card, CardHeader, CardBody } from "@/components/Common/Card";
import MembershipTable from "@/components/Membership/MembershipTable";

export default function Index() {
    const { memberships } = usePage().props;

    const handleInfo = (row) => {
        router.get(route("merchant.memberships.show", { booking: row.slug }));
    };

    return (
        <MerchantLayout>
            <Head title="Membership" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader>
                    <div className="flex justify-between items-center p-4">
                        <div className="font-bold">Daftar Membership</div>
                    </div>
                </CardHeader>

                <CardBody className="px-0 pb-8">
                    <MembershipTable
                        memberships={memberships}
                        onInfo={handleInfo}
                        showAddButton={false}
                        showPackagesButton={false}
                    />
                </CardBody>
            </Card>
        </MerchantLayout>
    );
}
