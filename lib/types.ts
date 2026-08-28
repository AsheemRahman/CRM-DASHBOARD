export type CustomerStatus = "active" | "inactive";

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: CustomerStatus;
    lastContactDate: string; // ISO date
    notes: string;
    createdAt: string; // ISO date
}

export type CustomerInput = Omit<Customer, "id" | "createdAt">;

export type SortField = "name" | "email" | "lastContactDate";
export type SortDirection = "asc" | "desc";

export interface SortState {
    field: SortField;
    direction: SortDirection;
}

export interface FilterState {
    status: CustomerStatus[];
    companies: string[];
    dateFrom: string | null;
    dateTo: string | null;
    phone: string;
    email: string;
}

export const emptyFilters: FilterState = {
    status: [],
    companies: [],
    dateFrom: null,
    dateTo: null,
    phone: "",
    email: "",
};

export function hasActiveFilters(f: FilterState): boolean {
    return (
        f.status.length > 0 ||
        f.companies.length > 0 ||
        !!f.dateFrom ||
        !!f.dateTo ||
        f.phone.trim() !== "" ||
        f.email.trim() !== ""
    );
}

export function countActiveFilters(f: FilterState): number {
    let n = 0;
    if (f.status.length > 0) n += 1;
    if (f.companies.length > 0) n += 1;
    if (f.dateFrom || f.dateTo) n += 1;
    if (f.phone.trim() !== "") n += 1;
    if (f.email.trim() !== "") n += 1;
    return n;
}

export interface SavedFilter {
    id: string;
    name: string;
    filters: FilterState;
    order: number;
    isBuiltIn?: boolean;
}

export interface CustomerQueryParams {
    search: string;
    filters: FilterState;
    sort: SortState;
    page: number;
    pageSize: number;
}

export interface CustomerQueryResult {
    data: Customer[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
