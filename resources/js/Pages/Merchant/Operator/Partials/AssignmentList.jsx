import React from "react";
import Button from "@/components/Common/Button";
import { formatCustom } from "@/utils/date";

export default function AssignmentList({ events, onEditEvent, onDeleteEvent }) {
    return (
        <aside className="w-72 bg-gray-50 p-4 rounded-md shadow-inner flex-shrink-0 overflow-auto">
            <h2 className="font-semibold mb-4">Daftar Penugasan</h2>
            {events.length === 0 ? (
                <p className="text-gray-500">Belum ada penugasan.</p>
            ) : (
                <ul className="space-y-2">
                    {events.map((ev) => (
                        <li
                            key={ev.id}
                            className="p-2 bg-white rounded shadow flex flex-col"
                        >
                            <div className="flex justify-between items-center">
                                <span>{ev.title}</span>
                                <div className="flex gap-1">
                                    <Button
                                        size="xs"
                                        variant="light"
                                        onClick={() => onEditEvent(ev)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="xs"
                                        variant="light"
                                        onClick={() => onDeleteEvent(ev.id)}
                                    >
                                        Hapus
                                    </Button>
                                </div>
                            </div>
                            <span className="text-sm text-gray-400">
                                {formatCustom(ev.start, "dd MMM yyyy HH:mm")} -{" "}
                                {formatCustom(ev.end, "dd MMM yyyy HH:mm")}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
}
