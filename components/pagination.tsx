"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Pagination({
    page,
    totalPages,
    pageSize,
    total,
    onPageChange,
    onPageSizeChange,
}: {
    page: number;
    totalPages: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}) {
    const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);

    function pageWindow(): (number | "ellipsis")[] {
        const pages: (number | "ellipsis")[] = [];
        const add = (p: number) => pages.push(p);
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) add(i);
            return pages;
        }
        add(1);
        if (page > 3) pages.push("ellipsis");
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) add(i);
        if (page < totalPages - 2) pages.push("ellipsis");
        add(totalPages);
        return pages;
    }

    return (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-ink-600 px-4 py-3 sm:flex-row">
            <div className="flex items-center gap-3 text-xs text-mist-500">
                <span>
                    Showing <span className="text-mist-300">{from}</span>–<span className="text-mist-300">{to}</span> of{" "}
                    <span className="text-mist-300">{total}</span> entries
                </span>
                <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
                    <SelectTrigger className="h-7 w-23 text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {[10, 25, 50].map((size) => (
                            <SelectItem key={size} value={String(size)}>
                                {size} / page
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                {pageWindow().map((p, idx) =>
                    p === "ellipsis" ? (
                        <span key={`e-${idx}`} className="px-1.5 text-xs text-mist-500">
                            …
                        </span>
                    ) : (
                        <Button
                            key={p}
                            variant={p === page ? "default" : "ghost"}
                            size="icon"
                            className="h-7 w-7 text-xs"
                            onClick={() => onPageChange(p)}
                        >
                            {p}
                        </Button>
                    )
                )}
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    aria-label="Next page"
                >
                    <ChevronRight className="h-3.5 w-3.5" />
                </Button>
            </div>
        </div>
    );
}
