import { FilterState, SavedFilter } from "@/lib/types";
import { uid } from "@/lib/utils";

const FILTERS_KEY = "crm_saved_filters_v1";
const LATENCY = { min: 250, max: 650 };

function delay<T>(value: T): Promise<T> {
    const ms = LATENCY.min + Math.random() * (LATENCY.max - LATENCY.min);

    return new Promise((resolve) => {
        setTimeout(() => resolve(value), ms);
    });
}

const BUILT_IN_FILTERS: SavedFilter[] = [
    {
        id: "builtin_active",
        name: "Active Customers",
        filters: {
            status: ["active"],
            companies: [],
            dateFrom: null,
            dateTo: null,
            phone: "",
            email: "",
        },
        order: 0,
        isBuiltIn: true,
    },
    {
        id: "builtin_recent",
        name: "Recent Contacts",
        filters: {
            status: [],
            companies: [],
            dateFrom: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().slice(0, 10),
            dateTo: null,
            phone: "",
            email: "",
        },
        order: 1,
        isBuiltIn: true,
    },
    {
        id: "builtin_inactive",
        name: "Inactive Leads",
        filters: { status: ["inactive"], companies: [], dateFrom: null, dateTo: null, phone: "", email: "" },
        order: 2,
        isBuiltIn: true,
    },
];

function loadSavedFilters(): SavedFilter[] {
    if (typeof window === "undefined") {
        return BUILT_IN_FILTERS;
    }
    const raw = window.localStorage.getItem(FILTERS_KEY);
    if (raw) {
        try {
            return JSON.parse(raw) as SavedFilter[];
        } catch {
            // Ignore
        }
    }
    window.localStorage.setItem(
        FILTERS_KEY,
        JSON.stringify(BUILT_IN_FILTERS)
    );
    return BUILT_IN_FILTERS;
}

function persistFilters(filters: SavedFilter[]) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
        FILTERS_KEY,
        JSON.stringify(filters)
    );
}

export async function fetchSavedFilters(): Promise<SavedFilter[]> {
    return delay(
        loadSavedFilters().sort((a, b) => a.order - b.order)
    );
}

export async function saveFilter(name: string, filters: FilterState): Promise<SavedFilter> {
    const all = loadSavedFilters();
    const newFilter: SavedFilter = {
        id: uid("filter"),
        name,
        filters,
        order: all.length,
    };
    const updated = [...all, newFilter];
    persistFilters(updated);
    return delay(newFilter);
}

export async function deleteSavedFilter(id: string): Promise<{ id: string }> {
    const all = loadSavedFilters().filter((f) => f.id !== id);
    persistFilters(all);
    return delay({ id });
}

export async function reorderSavedFilters(orderedIds: string[]): Promise<SavedFilter[]> {
    const all = loadSavedFilters();
    const byId = new Map(all.map((f) => [f.id, f]));
    const reordered = orderedIds
        .map((id, idx) => {
            const f = byId.get(id);
            return f ? { ...f, order: idx } : null;
        })
        .filter((f): f is SavedFilter => f !== null);
    persistFilters(reordered);
    return delay(reordered);
}