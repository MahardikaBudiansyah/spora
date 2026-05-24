import { Head, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";
import CourtTable from "@/features/courts/components/tables/CourtTable";

export default function Index() {
    const {
        auth,
        venue,
        courts: { data: courts },
    } = usePage().props;

    return (
        <AdminLayout>
            <Head title="Kelola Data Lapangan" />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Kelola</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Data Lapangan
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                size="xs"
                                onClick={() => handlePrint()}
                            >
                                Cetak Data
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="py-4 md:py-6 px-0 min-h-[280px] sm:min-h-[310px] flex flex-col">
                    <CourtTable auth={auth} courts={courts} />
                </CardBody>
                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end"></CardFooter>
            </Card>
        </AdminLayout>
    );
}
