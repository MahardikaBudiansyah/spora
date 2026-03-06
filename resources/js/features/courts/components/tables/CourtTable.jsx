import Table from "@/components/Common/Table";
import Button from "@/components/Common/Button";
import Pagination from "@/components/common/Pagination";
import Badge from "@/components/Common/Badge";
import { Calendar, Edit, Info, Trash2 } from "lucide-react";
import { formatFullDateTime } from "@/utils/date";
import { getCourtSurface } from "@/utils/attributes/courtAttribute";

export default function CourtTable({ auth, venue, courts, handleDelete }) {
    const baseColumns = [
        {
            key: "number",
            header: "#",
            className: "text-center content-start",
            render: (_, __, index) => {
                const currentPage =
                    courts.current_page || courts.meta?.current_page || 1;
                const perPage = courts.per_page || courts.meta?.per_page || 10;
                return (currentPage - 1) * perPage + index + 1;
            },
        },
        {
            key: "name",
            header: "Nama Lapangan",
            className: "text-left content-start whitespace-nowrap",
        },
        {
            key: "court_surface",
            header: "Tipe Lantai",
            render: (val) => {
                const { label, color } = getCourtSurface(val);
                return <Badge color={color}>{label}</Badge>;
            },
            className: "text-center content-start whitespace-nowrap",
        },
        {
            key: "description",
            header: "Deskripsi",
            className: "min-w-[200px] max-w-[500px] content-start",
            render: (val, row) => (
                <div className="break-words line-clamp-4">
                    {row?.description || "-"}
                </div>
            ),
        },
        {
            key: "venue_name",
            header: "Venue",
            render: (val, row) => (row.venue ? row.venue.name : "-"),
            className: "text-center content-start whitespace-nowrap",
        },
    ];

    const adminColumns = auth.admin
        ? [
              {
                  key: "merchant_name",
                  header: "Mitra",
                  className: "text-center content-start whitespace-nowrap",
                  render: (val, row) => row.venue?.merchant?.name || "-",
              },
          ]
        : [];

    const commonDateColumns = [
        {
            key: "created_at",
            header: "Ditambahkan",
            render: (val, row) => formatFullDateTime(row.created_at) || "-",
            className: "text-center content-start whitespace-nowrap",
        },
    ];

    const merchantColumns = auth.merchant
        ? [
              {
                  key: "updated_at",
                  header: "Pembaruan",
                  render: (val, row) =>
                      formatFullDateTime(row.updated_at) || "-",
                  className: "text-center content-start whitespace-nowrap",
              },
          ]
        : [];

    const actionColumn = [
        {
            key: "action",
            header: "Aksi",
            className: "text-center content-start",
            render: (val, row) => (
                <div className="flex gap-2 justify-center">
                    {auth.admin && (
                        <Button
                            variant="info"
                            size="xs"
                            href={route("admin.venues.courts.show", {
                                venue: row.venue.slug,
                                court: row.slug,
                            })}
                        >
                            Info
                        </Button>
                    )}
                    {auth.merchant && (
                        <>
                            <Button
                                variant="info"
                                size="xs"
                                href={route("merchant.venues.courts.show", {
                                    venue: venue.slug,
                                    court: row.slug,
                                })}
                                className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                            >
                                <Info className="w-4 h-4" strokeWidth={2.5} />
                                <span>Info</span>
                            </Button>
                            <Button
                                variant="success"
                                size="xs"
                                href={route("merchant.venues.courts.edit", {
                                    venue: venue.slug,
                                    court: row.slug,
                                })}
                                className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit</span>
                            </Button>
                            <Button
                                variant="warning"
                                size="xs"
                                href={route("merchant.venues.courts.calendar", {
                                    venue: venue.slug,
                                    court: row.slug,
                                })}
                                className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Kalender</span>
                            </Button>
                            <Button
                                variant="danger"
                                size="xs"
                                onClick={() => handleDelete(row)}
                                className="flex items-center w-auto gap-1.5 px-3 min-w-max"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Hapus</span>
                            </Button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    const columns = [
        ...baseColumns,
        ...adminColumns,
        ...commonDateColumns,
        ...merchantColumns,
        ...actionColumn,
    ];

    return (
        <div className="py-2 flex-1 overflow-x-auto">
            <Table
                columns={columns}
                data={courts}
                wrapperClassName="border-none rounded-none shadow-none"
                tableClassName="text-xs"
                emptyState={
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Tidak ada data Court.{" "}
                    </div>
                }
            />
            {courts.links && (
                <Pagination links={courts} meta={courts} className="p-6 my-2" />
            )}
        </div>
    );
}
