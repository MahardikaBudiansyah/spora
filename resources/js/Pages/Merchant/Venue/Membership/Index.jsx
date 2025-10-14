import { Head, usePage, router } from "@inertiajs/react";
import MerchantLayout from "@/Layouts/MerchantLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import MembershipTable from "@/components/Membership/MembershipTable";
import useModal from "@/hooks/useModal";
import CreateMembershipPackageModal from "@/Pages/Merchant/Membership/MembershipPackage/Create";
import Button from "@/components/Common/Button";
import SearchInput from "@/components/Common/SearchInput";
import { ChevronDown, ChevronRight, FileText, Image } from "lucide-react";

export default function Index() {
    const { memberships, membershipPackages, venue } = usePage().props;
    const { isOpen, open, close } = useModal();
    const isMembershipPackageModalOpen = isOpen("MembershipPackageModal");

    return (
        <MerchantLayout>
            <Head title={`Membership - ${venue.name}`} />
            <Card className="flex flex-col h-full rounded-lg shadow-none dark:border-none">
                <CardHeader>
                    <div className="flex justify-between items-center p-4">
                        <div className="font-bold uppercase text-lg">
                            Membership {venue.name}
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="px-0">
                    <div className="flex flex-row gap-2 justify-between py-4 px-8">
                        <div className="flex flex-row gap-2">
                            <SearchInput />
                            <Button
                                variant="primary"
                                size="xs"
                                className="gap-2"
                            >
                                Semua Status Pesanan
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="primary"
                                size="xs"
                                className="gap-2"
                            >
                                Semua Status Transaksi
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="flex flex-row gap-2">
                            <Button
                                variant="primary"
                                size="xs"
                                onClick={() =>
                                    router.get(
                                        route(
                                            "merchant.venues.memberships.create",
                                            {
                                                venue: venue.slug,
                                            }
                                        )
                                    )
                                }
                            >
                                + Tambah Membership
                            </Button>
                        </div>
                    </div>
                    <MembershipTable memberships={memberships} />
                </CardBody>

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

            <CreateMembershipPackageModal
                show={isMembershipPackageModalOpen}
                onClose={close}
                initialMembershipPackages={membershipPackages}
            />
        </MerchantLayout>
    );
}
