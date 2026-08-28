import { generateCustomers } from "@/lib/mock-data";
import { Customer, CustomerInput, CustomerQueryParams, CustomerQueryResult, FilterState } from "@/lib/types";
import { uid } from "@/lib/utils";

const STORAGE_KEY = "crm_customers_v1";
const LATENCY = { min: 250, max: 650 };

function delay<T>(value: T): Promise<T> {
    const ms = LATENCY.min + Math.random() * (LATENCY.max - LATENCY.min);

    return new Promise((resolve) => {
        setTimeout(() => resolve(value), ms);
    });
}

function loadCustomers(): Customer[] {
    if (typeof window === "undefined") {
        return generateCustomers();
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (raw) {
        try {
            return JSON.parse(raw) as Customer[];
        } catch {
            // Regenerate below
        }
    }

    const seeded = generateCustomers(150);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));

    return seeded;
}

function persist(customers: Customer[]) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

function matchesFilters(c: Customer, search: string, f: FilterState): boolean {
    if (search.trim()) {
        const q = search.trim().toLowerCase();
        const inName = c.name.toLowerCase().includes(q);
        const inEmail = c.email.toLowerCase().includes(q);
        const inCompany = c.company.toLowerCase().includes(q);
        if (!inName && !inEmail && !inCompany) return false;
    }
    if (f.status.length > 0 && !f.status.includes(c.status)) return false;
    if (f.companies.length > 0 && !f.companies.includes(c.company)) return false;
    if (f.dateFrom && new Date(c.lastContactDate) < new Date(f.dateFrom)) return false;
    if (f.dateTo && new Date(c.lastContactDate) > new Date(f.dateTo + "T23:59:59")) return false;
    if (f.phone.trim() && !c.phone.replace(/\D/g, "").includes(f.phone.replace(/\D/g, ""))) return false;
    if (f.email.trim() && !c.email.toLowerCase().includes(f.email.trim().toLowerCase())) return false;
    return true;
}

export async function fetchCustomers(params: CustomerQueryParams): Promise<CustomerQueryResult> {
    const all = loadCustomers();
    let filtered = all.filter((c) => matchesFilters(c, params.search, params.filters));

    filtered = filtered.sort((a, b) => {
        const dir = params.sort.direction === "asc" ? 1 : -1;
        if (params.sort.field === "lastContactDate") {
            return (new Date(a.lastContactDate).getTime() - new Date(b.lastContactDate).getTime()) * dir;
        }
        return a[params.sort.field].localeCompare(b[params.sort.field]) * dir;
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / params.pageSize));
    const page = Math.min(params.page, totalPages);
    const startIdx = (page - 1) * params.pageSize;
    const data = filtered.slice(startIdx, startIdx + params.pageSize);

    return delay({ data, total, page, pageSize: params.pageSize, totalPages });
}

export async function fetchCustomerCompanies(): Promise<string[]> {
    const all = loadCustomers();
    const set = new Set(all.map((c) => c.company));

    return delay(Array.from(set).sort());
}

export async function fetchCustomerStats(): Promise<{ total: number; active: number; contactedThisWeek: number; }> {
    const all = loadCustomers();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return delay({
        total: all.length,
        active: all.filter((c) => c.status === "active").length,
        contactedThisWeek: all.filter((c) => new Date(c.lastContactDate) >= weekAgo).length,
    });
}

export async function createCustomer(input: CustomerInput): Promise<Customer> {
    const all = loadCustomers();
    await delay(null);
    if (all.some((c) => c.email.toLowerCase() === input.email.toLowerCase())) {
        throw new Error("A customer with this email already exists.");
    }
    const newCustomer: Customer = { ...input, id: uid("cust"), createdAt: new Date().toISOString() };
    const updated = [newCustomer, ...all];
    persist(updated);
    return newCustomer;
}

export async function updateCustomer(id: string, input: CustomerInput): Promise<Customer> {
    const all = loadCustomers();
    const idx = all.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Customer not found.");
    const updatedCustomer: Customer = { ...all[idx], ...input };
    const updated = [...all];
    updated[idx] = updatedCustomer;
    persist(updated);
    return delay(updatedCustomer);
}

export async function deleteCustomer(id: string): Promise<{ id: string }> {
    const all = loadCustomers();
    const updated = all.filter((c) => c.id !== id);
    persist(updated);
    return delay({ id });
}