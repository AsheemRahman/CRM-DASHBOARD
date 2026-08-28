"use client";

import { Users, Rocket, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
    label: string;
    value: string;
    trend?: string;
    trendUp?: boolean;
    icon: React.ElementType;
}

export function StatsCards({ total, active, contactedThisWeek }: { total: number; active: number; contactedThisWeek: number }) {
    const stats: Stat[] = [
        { label: "Total Customers", value: total.toLocaleString(), icon: Users },
        { label: "Active Customers", value: active.toLocaleString(), icon: Rocket },
        { label: "Contacted This Week", value: contactedThisWeek.toLocaleString(), icon: PhoneCall },
    ];

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((s) => (
                <div
                    key={s.label}
                    className="flex items-center gap-3 rounded-md border border-ink-600 bg-ink-800 p-4 shadow-panel"
                >
                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-ink-700 text-signal")}>
                        <s.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-display text-xl font-semibold tabular-nums text-mist-100">{s.value}</p>
                        <p className="truncate text-xs text-mist-500">{s.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
