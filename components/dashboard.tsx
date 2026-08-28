"use client";

import * as React from "react";
import { Plus, Search, SlidersHorizontal, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomerTable } from "@/components/customer-table";
import { CustomerDetailsDialog } from "@/components/customer-details-dialog";
import { CustomerFormDialog } from "@/components/customer-form-dialog";
import { DeleteCustomerDialog } from "@/components/delete-customer-dialog";
import { FiltersPanel } from "@/components/filters-panel";
import { Pagination } from "@/components/pagination";
import { StatsCards } from "@/components/stats-cards";
import { useDebounce } from "@/hooks/use-debounce";
import { useCustomerCompanies, useCustomerStats, useCustomers } from "@/hooks/use-customers";
import { countActiveFilters, Customer, emptyFilters, FilterState, hasActiveFilters, SortState } from "@/lib/types";

export function Dashboard() {
    const [search, setSearch] = React.useState("");
    const debouncedSearch = useDebounce(search, 300);

    const [appliedFilters, setAppliedFilters] = React.useState<FilterState>(emptyFilters);
    const [draftFilters, setDraftFilters] = React.useState<FilterState>(emptyFilters);
    const [filtersOpen, setFiltersOpen] = React.useState(false);

    const [sort, setSort] = React.useState<SortState>({ field: "name", direction: "asc" });
    const [page, setPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);

    const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
    const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null);
    const [deletingCustomer, setDeletingCustomer] = React.useState<Customer | null>(null);
    const [addOpen, setAddOpen] = React.useState(false);

    const resetPage = () => setPage(1);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        resetPage();
    };

    const handleFiltersApply = (filters: FilterState) => {
        setAppliedFilters(filters);
        resetPage();
    };

    const handleSortChange = (sort: SortState) => {
        setSort(sort);
        resetPage();
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        resetPage();
    };

    const queryParams = React.useMemo(
        () => ({ search: debouncedSearch, filters: appliedFilters, sort, page, pageSize }),
        [debouncedSearch, appliedFilters, sort, page, pageSize]
    );

    const { data, isLoading, isFetching, isError } = useCustomers(queryParams);
    const { data: companies = [] } = useCustomerCompanies();
    const { data: stats } = useCustomerStats();

    const activeCount = countActiveFilters(appliedFilters);

    function openFiltersPanel() {
        setDraftFilters(appliedFilters);
        setFiltersOpen(true);
    }

    return (
        <div className="min-h-screen bg-ink-950">
            <header className="border-b border-ink-600 bg-ink-900/60 px-4 py-4 sm:px-8">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-signal/15 text-signal">
                            <Zap className="h-4 w-4" />
                        </div>
                        <span className="font-display text-lg font-semibold text-mist-100">Relay CRM</span>
                    </div>
                    <div className="hidden text-xs text-mist-500 sm:block">Customer Dashboard</div>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-8">
                {stats && <StatsCards total={stats.total} active={stats.active} contactedThisWeek={stats.contactedThisWeek} />}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="font-display text-xl font-semibold text-mist-100">Customers</h1>
                    <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                        <div className="relative flex-1 sm:max-w-xs">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-500" />
                            <Input
                                value={search}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                placeholder="Search customers…"
                                className="pl-9"
                            />
                        </div>
                        <Button variant="outline" onClick={openFiltersPanel} className="relative">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                            {activeCount > 0 && (
                                <span className="ml-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-signal px-1 text-[10px] font-semibold text-ink-950">
                                    {activeCount}
                                </span>
                            )}
                        </Button>
                        <Button onClick={() => setAddOpen(true)}>
                            <Plus className="h-4 w-4" />
                            Add Customer
                        </Button>
                    </div>
                </div>

                {hasActiveFilters(appliedFilters) && (
                    <div className="flex items-center gap-2 text-xs text-mist-500">
                        <span>{activeCount} active filter{activeCount === 1 ? "" : "s"}</span>
                        <button className="text-signal hover:text-signal-bright" onClick={() => setAppliedFilters(emptyFilters)}>
                            Clear all
                        </button>
                    </div>
                )}

                <div>
                    <CustomerTable
                        customers={data?.data ?? []}
                        isLoading={isLoading}
                        isError={isError}
                        sort={sort}
                        onSortChange={handleSortChange}
                        onSelect={setSelectedCustomer}
                        onEdit={setEditingCustomer}
                        onDelete={setDeletingCustomer}
                    />
                    {data && data.total > 0 && (
                        <Pagination
                            page={data.page}
                            totalPages={data.totalPages}
                            pageSize={data.pageSize}
                            total={data.total}
                            onPageChange={setPage}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    )}
                    {isFetching && !isLoading && <p className="mt-2 text-xs text-mist-500">Refreshing…</p>}
                </div>
            </main>

            <FiltersPanel
                open={filtersOpen}
                onOpenChange={setFiltersOpen}
                draft={draftFilters}
                onDraftChange={setDraftFilters}
                onApply={handleFiltersApply}
                onClearAll={() => { setAppliedFilters(emptyFilters); setPage(1); }}
                companies={companies}
                activeCount={countActiveFilters(draftFilters)}
            />

            <CustomerDetailsDialog
                customer={selectedCustomer}
                onOpenChange={(open) => !open && setSelectedCustomer(null)}
                onEdit={(c) => {
                    setSelectedCustomer(null);
                    setEditingCustomer(c);
                }}
                onDelete={(c) => {
                    setSelectedCustomer(null);
                    setDeletingCustomer(c);
                }}
            />

            <CustomerFormDialog open={addOpen} mode="add" customer={null} onOpenChange={setAddOpen} />
            <CustomerFormDialog
                open={!!editingCustomer}
                mode="edit"
                customer={editingCustomer}
                onOpenChange={(open) => !open && setEditingCustomer(null)}
            />

            <DeleteCustomerDialog customer={deletingCustomer} onOpenChange={(open) => !open && setDeletingCustomer(null)} />
        </div>
    );
}
