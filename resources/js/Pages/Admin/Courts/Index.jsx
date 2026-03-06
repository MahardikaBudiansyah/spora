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
            <Head title="Daftar Lapangan" />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader className="">
                    <div className="flex flex-row justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Daftar Data Lapangan
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
                    <CourtTable auth={auth} courts={courts} />
                </CardBody>
                <CardFooter className="p-6 md:p-8 flex gap-2 justify-end"></CardFooter>
            </Card>
        </AdminLayout>
    );
}
