import { useRef, useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import Button from "@/components/Common/Button";
import {
    Calendar,
    Edit,
    Info,
    Star,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Badge from "@/components/Common/Badge";
import {
    getCourtCategory,
    getCourtSurface,
} from "@/utils/attributes/courtAttribute";

export default function VenueCourtList({ courts = [], venue = null }) {
    const { auth } = usePage().props;

    const isMerchant = auth?.merchant;
    const isAdmin = auth?.admin;
    if (!isMerchant && !isAdmin) return null;

    const scrollRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 10);
            setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, [courts]);

    const handleScroll = (dir) => {
        const offset = dir === "left" ? -350 : 350;
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
            setTimeout(checkScroll, 500);
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseLeave = () => setIsDragging(false);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleInfo = (court) => {
        if (isAdmin) {
            console.log("courts:", courts);
            console.log("venue:", venue);
            router.get(
                route("admin.venues.courts.show", {
                    venue: venue.slug,
                    court: court.slug,
                })
            );
        } else if (isMerchant) {
            console.log("courts:", courts);
            console.log("venue:", venue);
            router.get(
                route("merchant.venues.courts.show", {
                    venue: venue.slug,
                    court: court.slug,
                })
            );
        }
    };

    const handleEdit = (court) => {
        if (isMerchant) {
            router.get(
                route("merchant.venues.courts.edit", {
                    venue: venue.slug,
                    court: court.slug,
                })
            );
        }
    };

    const handleCalendar = (court) => {
        if (isAdmin) {
            router.get(
                route("admin.venues.courts.calendar", {
                    venue: venue.slug,
                    court: court.slug,
                })
            );
        } else if (isMerchant) {
            router.get(
                route("merchant.venues.courts.calendar", {
                    venue: venue.slug,
                    court: court.slug,
                })
            );
        }
    };

    if (!courts || courts.length === 0) {
        return (
            <div className="text-sm text-center text-gray-500">
                Belum ada lapangan yang ditambahkan.
            </div>
        );
    }

    return (
        <div className="relative group/container w-full">
            {showLeftArrow && (
                <Button
                    variant="primary"
                    onClick={() => handleScroll("left")}
                    className="absolute -left-2 top-1/2 -translate-y-1/2 z-20 shadow-xl p-2 rounded-full opacity-0 group-hover/container:opacity-100 transition-opacity duration-200 hidden lg:flex items-center justify-center focus:ring-0"
                >
                    <ChevronLeft size={18} />
                </Button>
            )}

            {/* Tombol Panah Kanan */}
            {showRightArrow && (
                <Button
                    variant="primary"
                    onClick={() => handleScroll("right")}
                    className="absolute -right-2 top-1/2 -translate-y-1/2 z-20 shadow-xl p-2 rounded-full opacity-0 group-hover/container:opacity-100 transition-opacity duration-300 hidden lg:flex items-center justify-center focus:ring-0"
                >
                    <ChevronRight size={18} />
                </Button>
            )}

            <div
                ref={scrollRef}
                onScroll={checkScroll}
                className={`overflow-x-auto scrollbar-hide px-2 w-full select-none scroll-smooth ${
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            ></div>
            <div
                ref={scrollRef}
                className={`overflow-x-auto scrollbar-hide px-2 w-full select-none scroll-smooth ${
                    isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
                <div className="flex gap-4 w-max">
                    {courts.slice(0, 6).map((court) => (
                        <div
                            key={court.id}
                            className="relative w-[300px] lg:w-[360px] h-60 flex-shrink-0 rounded-lg overflow-hidden shadow-md group"
                        >
                            <img
                                src={
                                    court.image ||
                                    "/assets/images/court-default.jpg"
                                }
                                alt={court.name}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300" />

                            <div className="absolute top-0 left-0 right-0 p-3 z-10 flex items-start justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-white font-bold text-sm sm:text-base">
                                        {court.name}
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {court.categories?.map((cat, index) => {
                                            const catAttr = getCourtCategory(
                                                cat.name
                                            );
                                            return (
                                                <Badge
                                                    key={index}
                                                    color={catAttr.color}
                                                    variant="solid"
                                                    className={`flex items-center gap-1 ${
                                                        cat.is_primary == 1
                                                            ? "font-bold"
                                                            : "font-medium"
                                                    }`}
                                                >
                                                    {cat.is_primary == 1 && (
                                                        <Star
                                                            size={12}
                                                            className="fill-current"
                                                        />
                                                    )}
                                                    {catAttr.label}
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </div>

                                {(() => {
                                    const surfaceAttr = getCourtSurface(
                                        court.surface
                                    );
                                    return (
                                        <Badge
                                            color={surfaceAttr.color}
                                            variant="solid"
                                            className="font-semibold mt-1"
                                        >
                                            {surfaceAttr.label}
                                        </Badge>
                                    );
                                })()}
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-3 z-10 flex gap-2 justify-end">
                                <Button
                                    variant="info"
                                    size="xs"
                                    onClick={() => handleInfo(court)}
                                    className="flex gap-1.5 px-2 md:px-3"
                                >
                                    <Info
                                        className="w-4 h-4"
                                        strokeWidth={2.5}
                                    />
                                    <span className="hidden md:inline">
                                        Info
                                    </span>
                                </Button>

                                {isMerchant && (
                                    <>
                                        <Button
                                            variant="success"
                                            size="xs"
                                            onClick={() => handleEdit(court)}
                                            className="flex gap-1.5 px-2 md:px-3"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span className="hidden md:inline">
                                                Edit
                                            </span>
                                        </Button>
                                    </>
                                )}

                                <Button
                                    variant="warning"
                                    size="xs"
                                    onClick={() => handleCalendar(court)}
                                    className="flex gap-1.5 px-2 md:px-3"
                                >
                                    <Calendar className="w-4 h-4" />
                                    <span className="hidden md:inline">
                                        Kalender
                                    </span>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
