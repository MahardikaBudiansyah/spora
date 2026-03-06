import { useState, useEffect } from "react";
import { Head, usePage, router, Link } from "@inertiajs/react";
import axios from "axios";
import { toast } from "react-toastify";
import MerchantLayout from "@/Layouts/MerchantLayout";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
} from "@/components/Common/Card";
import useModal from "@/hooks/useModal";
import Tabs from "@/components/Common/Tabs";
import Button from "@/components/Common/Button";
import DeleteModal from "@/components/Common/DeleteModal";

import MembershipPackageTable from "@/components/Memberships/MembershipPackageTable";
import Create from "@/Pages/Merchant/Membership/MembershipPackages/Create";
import Edit from "@/Pages/Merchant/Membership/MembershipPackages/Edit";
import DevelopmentPlaceholder from "@/components/Common/DevelopmentPlaceholder";
import { Plus, FileText } from "lucide-react";
import BannerAlert from "@/components/Common/BannerAlert";
import { getVenueStatus } from "@/utils/attributes/venueAttribute";

export default function Index() {
    const {
        merchant,
        venues: { data: venues = [] } = {},
        auth_status,
    } = usePage().props;

    const [venuesState, setVenuesState] = useState(venues || []);
    const [deleteState, setDeleteState] = useState({
        show: false,
        item: null,
        venue: null,
    });

    const { isOpen, open, close } = useModal();

    const [selectedVenue, setSelectedVenue] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);

    const fetchVenues = () => {
        router.reload({
            only: ["venues"],
            onSuccess: () => {
                console.log("Data venues berhasil disinkronkan.");
            },
            onError: () => {
                toast.error("Gagal menyinkronkan data.");
            },
        });
    };

    useEffect(() => {
        const incomingData = venues?.data || venues;
        setVenuesState(incomingData);
    }, [venues]);

    const handleToggleActive = async (pkg, venue) => {
        try {
            const newStatus = !pkg.is_active;
            await axios.patch(
                route("merchant.memberships.packages.is_active", {
                    membership_package: pkg.slug,
                }),
                { is_active: newStatus },
            );
            setVenuesState((prev) =>
                prev.map((v) =>
                    v.id === venue.id
                        ? {
                              ...v,
                              membership_packages: v.membership_packages.map(
                                  (p) =>
                                      p.slug === pkg.slug
                                          ? { ...p, is_active: newStatus }
                                          : p,
                              ),
                          }
                        : v,
                ),
            );
            toast.success(
                `Paket "${pkg.name}" berhasil ${
                    newStatus ? "diaktifkan" : "dinonaktifkan"
                }`,
            );
        } catch (err) {
            toast.error(`Gagal mengubah status paket "${pkg.name}".`);
        }
    };

    const handleEditClick = (pkg, venue) => {
        setSelectedVenue(venue);
        setSelectedPackage(pkg);
        open("EditModal");
    };

    const handleDeleteClick = (pkg, venue) => {
        setDeleteState({ show: true, item: pkg, venue: venue });
    };

    const handleConfirmDelete = async () => {
        const { venue, item } = deleteState;
        if (!venue || !item) return;

        try {
            const res = await axios.delete(
                route("merchant.memberships.packages.destroy", {
                    membership_package: item.slug,
                }),
            );

            if (res.data.success) {
                fetchVenues();

                toast.success(res.data.message || "Paket berhasil dihapus.");
            }
        } catch (err) {
            console.error(err);
            const errorMsg =
                err.response?.data?.message || "Gagal menghapus paket.";
            toast.error(errorMsg);
        } finally {
            setDeleteState({ show: false, item: null, venue: null });
        }
    };

    return (
        <MerchantLayout>
            <Head title="Paket Membership" />
            <Card className="flex flex-col h-full rounded-md shadow-none">
                <CardHeader className="p-4 md:p-6">
                    <div className="p-2 flex flex-col md:flex-row justify-between gap-6 md:items-center">
                        <div className="flex flex-col md:gap-1 md:text-left">
                            <div className="flex flex-wrap flex-row md:flex-row gap-2 font-bold text-2xl items-center ">
                                <span>Paket</span>
                                <span className="text-primary-600 dark:text-primary-500">
                                    Membership
                                </span>
                            </div>
                            <div className="text-sm text-secondary-600 dark:text-secondary-400">
                                <span>Mitra </span>
                                <span>{merchant?.name}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="px-0 pb-8">
                    <BannerAlert
                        type="warning"
                        title="Verifikasi Data Mitra Diperlukan"
                        size="xs"
                        titleClassName="text-xs"
                        className="mt-0 mb-4 mx-4 md:mx-8 "
                    >
                        <div className="mt-0.5 flex text-xs">
                            <p>
                                Anda belum dapat menambah atau mengelola paket
                                membership secara penuh sebelum verifikasi
                                profil Mitra <strong>{merchant?.name}</strong>{" "}
                                telah disetujui{" "}
                                <strong>(Terverifikasi).</strong> Silakan
                                lengkapi data profil atau tunggu proses
                                verifikasi selesai.{" "}
                                <Link
                                    href={route("merchant.profile.index")}
                                    className="font-bold underline"
                                >
                                    Kunjungi Profil {merchant.name} Sekarang.
                                </Link>
                            </p>
                        </div>
                    </BannerAlert>

                    <div className="m-4">
                        <Tabs
                            defaultActive={0}
                            orientation="horizontal"
                            className="text-sm"
                            tabs={venuesState.map((venue) => {
                                const currentVenueStatus = getVenueStatus(
                                    venue.status,
                                );

                                return {
                                    id: venue.id,
                                    label: venue.name,
                                    content: (
                                        <div className="flex flex-col gap-2">
                                            {auth_status.is_merchant_approved &&
                                                venue.status !== "approved" && (
                                                    <BannerAlert
                                                        type="warning"
                                                        title="Venue Belum Terverifikasi"
                                                        size="xs"
                                                        className="mb-4"
                                                    >
                                                        <div className="mt-0.5 flex text-xs">
                                                            <p>
                                                                Venue{" "}
                                                                <strong>
                                                                    {venue.name}
                                                                </strong>{" "}
                                                                masih dalam
                                                                tahap{" "}
                                                                <strong>
                                                                    {
                                                                        currentVenueStatus.label
                                                                    }
                                                                    .
                                                                </strong>{" "}
                                                                Kelola paket
                                                                membership dapat
                                                                dilakukan jika{" "}
                                                                <strong>
                                                                    {venue.name}
                                                                </strong>{" "}
                                                                telah
                                                                terverifikasi.{" "}
                                                                <Link
                                                                    href={route(
                                                                        "merchant.venues.show",
                                                                        venue.slug,
                                                                    )}
                                                                    className="font-bold underline"
                                                                >
                                                                    Lihat Venue{" "}
                                                                    <strong>
                                                                        {
                                                                            venue.name
                                                                        }
                                                                    </strong>{" "}
                                                                    Sekarang.
                                                                </Link>
                                                            </p>
                                                        </div>
                                                    </BannerAlert>
                                                )}
                                            <div className="m-2 flex flex-wrap gap-2 md:justify-end">
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    size="xs"
                                                    onClick={() => {
                                                        setSelectedVenue(venue);
                                                        open("CreateModal");
                                                    }}
                                                    disabled={
                                                        !auth_status.is_merchant_approved ||
                                                        venue.status !==
                                                            "approved"
                                                    }
                                                    className="px-2 md:px-3 gap-1.5"
                                                >
                                                    <Plus className="w-4 h-4 md:h-3" />
                                                    Tambah Paket
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="xs"
                                                    onClick={() => {
                                                        setSelectedVenue(venue);
                                                        open("PrintModal");
                                                    }}
                                                    disabled={
                                                        !auth_status.is_merchant_approved ||
                                                        venue.status !==
                                                            "approved"
                                                    }
                                                    className="flex gap-1.5 px-2 md:px-3"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    Cetak Data
                                                </Button>
                                            </div>

                                            <div>
                                                <MembershipPackageTable
                                                    packages={
                                                        venue.membership_packages ||
                                                        []
                                                    }
                                                    onToggle={(pkg) =>
                                                        handleToggleActive(
                                                            pkg,
                                                            venue,
                                                        )
                                                    }
                                                    onEdit={(pkg) =>
                                                        handleEditClick(
                                                            pkg,
                                                            venue,
                                                        )
                                                    }
                                                    onDelete={(pkg) =>
                                                        handleDeleteClick(
                                                            pkg,
                                                            venue,
                                                        )
                                                    }
                                                    venueContext={venue}
                                                />
                                            </div>
                                        </div>
                                    ),
                                };
                            })}
                        />
                    </div>
                </CardBody>
            </Card>

            <Create
                show={isOpen("CreateModal")}
                onClose={close}
                venue={selectedVenue}
                fetchVenues={fetchVenues}
            />
            <Edit
                show={isOpen("EditModal")}
                onClose={close}
                venue={selectedVenue}
                fetchVenues={fetchVenues}
                pkg={selectedPackage}
            />

            <DevelopmentPlaceholder
                title={`Cetak Data Paket Membership ${selectedVenue?.name}`}
                show={isOpen("PrintModal")}
                onClose={close}
            />

            <DeleteModal
                show={deleteState.show}
                onClose={() =>
                    setDeleteState({ show: false, item: null, venue: null })
                }
                onConfirm={handleConfirmDelete}
                title="Hapus Paket Membership"
                description={`Yakin ingin menghapus paket "${deleteState.item?.name}" dari venue ${deleteState.venue?.name}?`}
            />
        </MerchantLayout>
    );
}
