import React from "react";
import { Head, usePage } from "@inertiajs/react";
import UserLayout from "@/Layouts/UserLayout";
import { Card } from "@/components/common/Card";
import Button from "@/components/common/Button";
import { Star } from "lucide-react";
import { NumericFormat } from "react-number-format";
import BannerSection from "@/components/common/BannerSection";
import SimplePagination from "@/components/Common/SimplePagination";
import Badge from "@/components/Common/Badge";
import { getCourtCategory } from "@/utils/attributes/courtAttribute";

export default function Index() {
    const { venues } = usePage().props;

    console.log(venues);

    return (
        <UserLayout>
            <Head title="Venue" />
            <BannerSection>
                <p className="text-white text-3xl font-bold">
                    Daftarkan Venue Anda sebagai Mitra Kami!
                </p>

                <Button variant="primary" href={route("merchant.register")}>
                    Daftar Venue
                </Button>
            </BannerSection>

            <div className="p-4 max-w-screen-lg mx-auto py-8 rounded-lg text-xs text-gray-800 dark:text-white">
                <div className="py-6 flex flex-row justify-between">
                    <div className="flex gap-1">
                        <span>Menampilkan</span>
                        <span className="font-bold">
                            {venues.meta?.total || 0} Venue Tersedia
                        </span>
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
                            href={route("venues.show", {
                                venue: venue.slug,
                            })}
                            className="rounded-lg border-none hover:border-2 shadow-md hover:shadow-xl dark:shadow-stone-800 cursor-pointer"
                        >
                            <div className="relative h-52 w-full shrink-0 overflow-hidden rounded-t-lg">
                                <img
                                    src={venue.image}
                                    alt={venue.name}
                                    className="absolute object-cover h-full w-full transition-transform duration-300 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5 max-w-[90%]">
                                    {venue.court_categories?.map(
                                        (cat, index) => {
                                            const catAttr = getCourtCategory(
                                                cat.name
                                            );
                                            return (
                                                <Badge
                                                    key={index}
                                                    color={catAttr.color}
                                                    variant="solid"
                                                    className="flex items-center gap-1 px-2 py-0.5 text-[10px] border border-white/20 shadow-sm"
                                                >
                                                    {cat.is_primary == 1 && (
                                                        <Star
                                                            size={10}
                                                            className="fill-current"
                                                        />
                                                    )}
                                                    {catAttr.label}
                                                </Badge>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex gap-1 items-end font-bold text-xl">
                                    <span className="text-primary-600 dark:text-primary-400 text-base">
                                        Venue
                                    </span>
                                    <span>{venue.name}</span>
                                </div>
                                <div className="py-1 flex gap-1 items-center text-md">
                                    <div className="flex items-center gap-1">
                                        <span
                                            className={
                                                Number(venue.rating) > 0
                                                    ? "text-yellow-500"
                                                    : "text-gray-400"
                                            }
                                        >
                                            {Number(venue.rating) > 0
                                                ? Number(venue.rating).toFixed(
                                                      1
                                                  )
                                                : "0.0"}
                                        </span>
                                        <Star
                                            className={`w-3 h-3 ${
                                                Number(venue.rating) > 0
                                                    ? "text-yellow-500 fill-current"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    </div>

                                    {venue.address && (
                                        <>
                                            <span>|</span>
                                            <span>
                                                {[
                                                    venue.address?.district,
                                                    venue.address?.city
                                                        ?.replace(
                                                            /KABUPATEN|KOTA/gi,
                                                            ""
                                                        )
                                                        ?.trim(),
                                                ]
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </span>
                                        </>
                                    )}
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
                                    <span>per slot/jam</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-10">
                    <SimplePagination links={venues.links} meta={venues.meta} />
                </div>
            </div>
        </UserLayout>
    );
}
