import React from "react";
import Button from "@/components/common/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function SimplePagination({ links, meta, className = "" }) {
    const prevUrl = links?.prev;
    const nextUrl = links?.next;

    return (
        <div
            className={twMerge(
                "flex items-center justify-center gap-4",
                className
            )}
        >
            <Button
                variant="primary"
                href={prevUrl}
                disabled={!prevUrl}
                preserveScroll
                className="px-2"
            >
                <ChevronLeft className="w-5 h-5" />
            </Button>

            <Button
                variant="primary"
                href={nextUrl}
                disabled={!nextUrl}
                preserveScroll
                className="px-2"
            >
                <ChevronRight className="w-5 h-5" />
            </Button>
        </div>
    );
}
