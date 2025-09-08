import React from "react";
import { Head, usePage, router } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import { Card } from "@/components/common/Card";
import Button from "@/components/common/Button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { NumericFormat } from "react-number-format";

export default function Venue() {
    const { venues } = usePage().props;
    // console.log("venues:", venues);

    // Fungsi handle pagination klik
    const handlePageChange = (url) => {
        if (url) {
            Inertia.get(url);
        }
    };

    return (
        <UserLayout>
            <Head title="Venue" />

            <div className="p-4 max-w-screen-lg mx-auto py-8 rounded-lg text-xs text-gray-800 dark:text-white">
                <div className="py-6 flex flex-row justify-between">
                    <div className="flex gap-1">
                        <span>Menampilkan</span>
                        <span>{venues?.total || 0} Venue Tersedia</span>
                    </div>
                    <div className="flex gap-1">
                        <span>Urutkan berdasarkan</span>
                        <span className="font-bold">popularitas</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {venues.data.map((venue) => (
                        <Card
                            key={venue.id}
                            onClick={() =>
                                router.visit(`/venues/${venue.slug}`)
                            }
                            className="rounded-lg border-none hover:border-2 shadow-md hover:shadow-xl dark:shadow-stone-800 cursor-pointer"
                        >
                            <div className="relative h-52 w-full">
                                <img
                                    src={venue.image}
                                    alt={venue.name}
                                    className="absolute object-cover h-full w-full rounded-t-md"
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex gap-1 items-end font-bold text-2xl">
                                    <span className="text-primary-600 dark:text-primary-400 text-base">
                                        Venue
                                    </span>
                                    <span>{venue.name}</span>
                                </div>
                                <div className="py-1 flex gap-1 items-start text-md">
                                    <Star className="w-4 h-4" />
                                    <span>
                                        {(venue.rating ?? 0).toFixed(2)}
                                    </span>
                                    <span>|</span>
                                    <span>
                                        {venue.address?.district ?? "-"},{" "}
                                        {venue.address?.city ?? "-"}
                                    </span>
                                </div>

                                <div className="py-2 flex gap-2 items-center">
                                    <span>Mulai</span>
                                    <NumericFormat
                                        displayType="text"
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        prefix="Rp "
                                        allowNegative={false}
                                        decimalScale={0}
                                        value={
                                            venue.min_price
                                                ? venue.min_price.toLocaleString()
                                                : "0"
                                        }
                                        className="text-xl font-bold"
                                    />
                                    <span>/sesi</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-center space-x-2">
                    {/* Previous */}
                    <Button
                        onClick={() => handlePageChange(venues.prev_page_url)}
                        disabled={!venues.prev_page_url}
                        className="px-3 py-1"
                    >
                        <ChevronLeft className="w-5" />
                    </Button>

                    {/* Numbered pages */}
                    {Array.from(
                        { length: venues.last_page },
                        (_, i) => i + 1
                    ).map((page) => (
                        <Button
                            key={page}
                            onClick={() =>
                                handlePageChange(
                                    `${venues.path}?page=${page}${
                                        venues.query ? `&${venues.query}` : ""
                                    }`
                                )
                            }
                            className={`px-3 py-1 ${
                                page === venues.current_page
                                    ? "bg-primary-600 text-white"
                                    : "bg-white text-primary-600 hover:bg-primary-100"
                            }`}
                        >
                            {page}
                        </Button>
                    ))}

                    {/* Next */}
                    <Button
                        onClick={() => handlePageChange(venues.next_page_url)}
                        disabled={!venues.next_page_url}
                        className="px-3 py-1"
                    >
                        <ChevronRight className="w-5" />
                    </Button>
                </div>
            </div>
        </UserLayout>
    );
}
