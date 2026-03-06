import React, {
    useState,
    useRef,
    useCallback,
    useMemo,
    useEffect,
} from "react";
import { twMerge } from "tailwind-merge";
import { Edit, Filter, Trash2 } from "lucide-react";
import Button from "@/components/Common/Button";
import DeleteModal from "@/components/Common/DeleteModal";
import Dropdown from "@/components/Common/Dropdown";
import Checkbox from "@/components/Common/Checkbox";
import { Accordion, AccordionItem } from "@/components/Common/Accordion";
import { formatWithPattern } from "@/utils/date";
import Spinner from "@/components/Common/Spinner";
import BannerAlert from "@/components/Common/BannerAlert";

// Fungsi debounce sederhana
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

export default function AssignmentList({
    staff,
    events = [],
    venues = [],
    shifts = [],
    venueColors = {},
    batchSize = 20,
    onEditEvent,
    onDeleteEvent,
}) {
    const containerRef = useRef(null);

    const defaultVenue = "all";
    const defaultShift = "all";

    const [filterVenue, setFilterVenue] = useState([defaultVenue]);
    const [filterShift, setFilterShift] = useState([defaultShift]);
    const [displayedCount, setDisplayedCount] = useState(batchSize);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    // --------------------------
    // HANDLE TOGGLE GENERIC
    // --------------------------
    const handleToggle = (value, state, setState, defaultValue) => {
        setState((prev) => {
            if (value === "all") return [defaultValue];
            const next = prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev.filter((v) => v !== defaultValue), value];
            return next.length === 0 ? [defaultValue] : next;
        });
    };

    // --------------------------
    // DELETE MODAL
    // --------------------------
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);

    const handleOpenDeleteModal = (id) => {
        setSelectedAssignmentId(id);
        setShowDeleteModal(true);
    };
    const handleCloseDeleteModal = () => {
        setSelectedAssignmentId(null);
        setShowDeleteModal(false);
    };

    // --------------------------
    // FILTERED EVENTS
    // --------------------------
    const filteredEvents = useMemo(() => {
        return events.filter(
            (ev) =>
                (filterVenue.includes("all") ||
                    filterVenue.includes(ev.venueId.toString())) &&
                (filterShift.includes("all") ||
                    filterShift.includes(ev.shiftId.toString()))
        );
    }, [events, filterVenue, filterShift]);

    const displayedEvents = useMemo(
        () => filteredEvents.slice(0, displayedCount),
        [filteredEvents, displayedCount]
    );

    // --------------------------
    // SCROLL HANDLER
    // --------------------------
    const handleScroll = useCallback(
        debounce(() => {
            const el = containerRef.current;
            if (!el) return;

            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
                if (displayedCount < filteredEvents.length) {
                    setIsLoadingMore(true);

                    // simulasi delay kecil agar spinner terlihat
                    setTimeout(() => {
                        setDisplayedCount((prev) =>
                            Math.min(prev + batchSize, filteredEvents.length)
                        );
                        setIsLoadingMore(false);
                    }, 1000);
                }
            }
        }, 150),
        [displayedCount, filteredEvents.length]
    );
    // --------------------------
    // CHECKBOX STATUS
    // --------------------------
    const venueAllChecked =
        filterVenue.includes(defaultVenue) ||
        venues.every((v) => filterVenue.includes(v.id.toString()));
    const venueIndeterminate =
        !venueAllChecked &&
        filterVenue.length > 0 &&
        !filterVenue.includes(defaultVenue);

    const shiftAllChecked =
        filterShift.includes(defaultShift) ||
        shifts.every((s) => filterShift.includes(s.id.toString()));
    const shiftIndeterminate =
        !shiftAllChecked &&
        filterShift.length > 0 &&
        !filterShift.includes(defaultShift);

    // --------------------------
    // RENDER
    // --------------------------
    return (
        <aside
            ref={containerRef}
            onScroll={handleScroll}
            className="w-72 h-[460px] bg-secondary-50 dark:bg-secondary-800 p-4 rounded-md shadow-inner flex-shrink-0 overflow-auto custom-scrollbar"
        >
            <div className="mb-4 flex flex-row justify-between items-center">
                <h2 className="font-semibold">Daftar Penugasan</h2>

                <Dropdown>
                    <Dropdown.Trigger>
                        <Button
                            variant="light"
                            tooltip="Filter"
                            className="p-2 flex items-center gap-1"
                        >
                            <Filter className="w-3 h-3" />
                        </Button>
                    </Dropdown.Trigger>

                    <Dropdown.Content
                        widthClasses="w-300"
                        contentClasses="py-2 bg-white dark:bg-secondary-900 border dark:border-secondary-700"
                    >
                        <div className="px-2">
                            <Accordion className="space-y-2">
                                {/* Venue */}
                                <AccordionItem
                                    title="Venue"
                                    defaultOpen
                                    headerLeft={
                                        <Checkbox
                                            checked={venueAllChecked}
                                            indeterminate={venueIndeterminate}
                                            onChange={() =>
                                                handleToggle(
                                                    "all",
                                                    filterVenue,
                                                    setFilterVenue,
                                                    defaultVenue
                                                )
                                            }
                                        />
                                    }
                                >
                                    <div className="flex flex-col space-y-1 mt-1">
                                        {venues.map((v) => (
                                            <label
                                                key={v.id}
                                                className="flex items-center gap-3 text-sm"
                                            >
                                                <Checkbox
                                                    checked={filterVenue.includes(
                                                        v.id.toString()
                                                    )}
                                                    onChange={() =>
                                                        handleToggle(
                                                            v.id.toString(),
                                                            filterVenue,
                                                            setFilterVenue,
                                                            defaultVenue
                                                        )
                                                    }
                                                />
                                                {v.name}
                                            </label>
                                        ))}
                                    </div>
                                </AccordionItem>

                                {/* Shift */}
                                <AccordionItem
                                    title="Shift"
                                    defaultOpen
                                    headerLeft={
                                        <Checkbox
                                            checked={shiftAllChecked}
                                            indeterminate={shiftIndeterminate}
                                            onChange={() =>
                                                handleToggle(
                                                    "all",
                                                    filterShift,
                                                    setFilterShift,
                                                    defaultShift
                                                )
                                            }
                                        />
                                    }
                                >
                                    <div className="flex flex-col space-y-1 mt-1">
                                        {shifts.map((s) => (
                                            <label
                                                key={s.id}
                                                className="flex items-center gap-3 text-sm"
                                            >
                                                <Checkbox
                                                    checked={filterShift.includes(
                                                        s.id.toString()
                                                    )}
                                                    onChange={() =>
                                                        handleToggle(
                                                            s.id.toString(),
                                                            filterShift,
                                                            setFilterShift,
                                                            defaultShift
                                                        )
                                                    }
                                                />
                                                {s.name}
                                            </label>
                                        ))}
                                    </div>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </Dropdown.Content>
                </Dropdown>
            </div>

            {displayedEvents.length === 0 ? (
                <BannerAlert type="warning" className="font-bold">
                    Belum ada penugasan!
                </BannerAlert>
            ) : (
                <ul className="space-y-2">
                    {displayedEvents.map((ev) => (
                        <li
                            key={ev.id}
                            className={twMerge(
                                "p-2 border-l-8 rounded shadow flex flex-col bg-white dark:bg-secondary-900",
                                venueColors[ev.venueId] ?? "border-gray-300"
                            )}
                        >
                            <div className="flex flex-row justify-between gap-2 items-center">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold">
                                        {ev.venueName}
                                    </span>
                                    <span className="text-xs opacity-80">
                                        {formatWithPattern(
                                            ev.start,
                                            "dd MMM yyyy"
                                        )}{" "}
                                        –{" "}
                                        {formatWithPattern(
                                            ev.end,
                                            "dd MMM yyyy"
                                        )}
                                    </span>
                                </div>

                                <div className="flex gap-1">
                                    <Button
                                        size="xs"
                                        variant="success"
                                        tooltip="Edit"
                                        onClick={() => onEditEvent(ev)}
                                        className="p-2"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="xs"
                                        variant="danger"
                                        tooltip="Hapus"
                                        onClick={() =>
                                            handleOpenDeleteModal(ev.id)
                                        }
                                        className="p-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </li>
                    ))}
                    {isLoadingMore && (
                        <li className="mt-2">
                            <Spinner size="md" type="moon" />
                        </li>
                    )}
                </ul>
            )}

            <DeleteModal
                show={showDeleteModal}
                onClose={handleCloseDeleteModal}
                onDelete={() => {
                    onDeleteEvent(selectedAssignmentId);
                    handleCloseDeleteModal();
                }}
                title="Hapus Penugasan"
                description="Apakah Anda yakin ingin menghapus penugasan ini? Tindakan ini tidak dapat dibatalkan."
            />
        </aside>
    );
}
