import { Head, usePage, router } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import Button from "@/components/Common/Button";

export default function Index() {
    const { venue } = usePage().props;

    return (
        <MerchantLayout>
            <Head title={`Pengaturan - ${venue.name}`} />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader>
                    <div className="flex justify-between items-center p-4">
                        <div className="font-bold">Pengaturan {venue.name}</div>
                    </div>
                </CardHeader>

                <CardBody className="px-0 pb-8"></CardBody>

                <CardFooter className="my-8 p-8 flex justify-end gap-2">
                    <Button
                        variant="light"
                        type="button"
                        onClick={() =>
                            router.get(route("merchant.venues.index"))
                        }
                    >
                        Kembali ke Venue
                    </Button>
                </CardFooter>
            </Card>
        </MerchantLayout>
    );
}
