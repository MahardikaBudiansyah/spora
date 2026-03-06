import { Head, usePage, router } from "@inertiajs/react";
import { toast } from "react-toastify";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import VenueTable from "@/features/venues/components/tables/VenueTable";
import AdminVenueTable from "@/features/venues/components/tables/AdminVenueTable";

export default function Index() {
    const {
        auth,
        venues: { data: venues },
    } = usePage().props;

    const handleInfo = (row) => {
        router.get(route("admin.venues.show", { venue: row.slug }));
    };

    return (
        <AdminLayout>
            <Head title="Daftar Venue" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader className="">
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Daftar Data Venue
                        </div>
                        <Button
                            variant="primary"
                            size="xs"
                            onClick={() => handlePrint()}
                        >
                            Cetak Data
                        </Button>
                    </div>
                </CardHeader>
                <CardBody className="py-4 md:py-6 px-0 min-h-[280px] sm:min-h-[310px] flex flex-col">
                    <AdminVenueTable
                        auth={auth}
                        venues={venues}
                        handleInfo={handleInfo}
                        // handleVerification={handleVerification}
                    />
                </CardBody>
                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end"></CardFooter>
            </Card>
        </AdminLayout>
    );
}
