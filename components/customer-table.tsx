"use client";

import * as React from "react";
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors, } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDown, ArrowUp, ArrowUpDown, GripVertical, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, avatarColor, formatDate, initials } from "@/lib/utils";
import { Customer, SortField, SortState } from "@/lib/types";

const COLUMNS: { field: SortField; label: string }[] = [
    { field: "name", label: "Name" },
    { field: "email", label: "Email" },
    { field: "lastContactDate", label: "Last Contact" },
];

function SortIcon({ active, direction }: { active: boolean; direction: SortState["direction"] }) {
    if (!active) return <ArrowUpDown className="h-3 w-3 text-mist-500" />;
    return direction === "asc" ? (
        <ArrowUp className="h-3 w-3 text-signal" />
    ) : (
        <ArrowDown className="h-3 w-3 text-signal" />
    );
}

function SortableRow({
    customer,
    onSelect,
    onEdit,
    onDelete,
    dragEnabled,
}: {
    customer: Customer;
    onSelect: (c: Customer) => void;
    onEdit: (c: Customer) => void;
    onDelete: (c: Customer) => void;
    dragEnabled: boolean;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: customer.id,
        disabled: !dragEnabled,
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className="group border-b border-ink-700/70 text-sm last:border-b-0 hover:bg-ink-800/60"
        >
            <td className="w-8 px-2">
                {dragEnabled ? (
                    <button
                        type="button"
                        className="cursor-grab touch-none rounded-xs p-1 text-mist-500 opacity-0 hover:text-mist-100 group-hover:opacity-100 active:cursor-grabbing"
                        aria-label="Drag to reorder"
                        {...attributes}
                        {...listeners}
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>
                ) : null}
            </td>
            <td className="cursor-pointer py-3 pl-1 pr-4" onClick={() => onSelect(customer)}>
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-ink-950"
                        style={{ backgroundColor: avatarColor(customer.name) }}
                    >
                        {initials(customer.name)}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate font-medium text-mist-100">{customer.name}</p>
                        <p className="truncate text-xs text-mist-500">{customer.company}</p>
                    </div>
                </div>
            </td>
            <td className="cursor-pointer px-4 py-3 text-mist-300" onClick={() => onSelect(customer)}>
                {customer.email}
            </td>
            <td
                className="hidden cursor-pointer px-4 py-3 text-mist-300 md:table-cell"
                onClick={() => onSelect(customer)}
            >
                {customer.phone}
            </td>

            <td
                className="hidden cursor-pointer px-4 py-3 md:table-cell"
                onClick={() => onSelect(customer)}
            >
                <Badge variant={customer.status === "active" ? "active" : "inactive"}>
                    {customer.status === "active" ? "Active" : "Inactive"}
                </Badge>
            </td>

            <td
                className="cursor-pointer whitespace-nowrap px-4 py-3 text-mist-300"
                onClick={() => onSelect(customer)}
            >
                {formatDate(customer.lastContactDate)}
            </td>
            <td className="px-2 py-3">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100">
                    <button
                        type="button"
                        className="rounded-xs p-1.5 text-mist-500 hover:bg-ink-700 hover:text-signal"
                        aria-label={`Edit ${customer.name}`}
                        onClick={() => onEdit(customer)}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </button>

                    <button
                        type="button"
                        className="rounded-xs p-1.5 text-mist-500 hover:bg-ink-700 hover:text-coral"
                        aria-label={`Delete ${customer.name}`}
                        onClick={() => onDelete(customer)}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export function CustomerTable({
    customers,
    isLoading,
    isError,
    sort,
    onSortChange,
    onSelect,
    onEdit,
    onDelete,
}: {
    customers: Customer[];
    isLoading: boolean;
    isError: boolean;
    sort: SortState;
    onSortChange: (sort: SortState) => void;
    onSelect: (c: Customer) => void;
    onEdit: (c: Customer) => void;
    onDelete: (c: Customer) => void;
}) {
    // const [localOrder, setLocalOrder] = React.useState<Customer[]>(customers);
    // React.useEffect(() => setLocalOrder(customers), [customers]);
    const [orderedIds, setOrderedIds] = React.useState<string[]>([]);

    const displayedCustomers = React.useMemo(() => {
        if (orderedIds.length === 0) {
            return customers;
        }
        const customerMap = new Map(
            customers.map((customer) => [customer.id, customer])
        );
        const orderedIdSet = new Set(orderedIds);
        const orderedCustomers = orderedIds
            .map((id) => customerMap.get(id))
            .filter((customer): customer is Customer => Boolean(customer));
        const unorderedCustomers = customers.filter(
            (customer) => !orderedIdSet.has(customer.id)
        );
        return [...orderedCustomers, ...unorderedCustomers];
    }, [customers, orderedIds]);

    // Manual drag-reordering only makes sense on the current page's natural order.
    const dragEnabled = sort.field === "name" && sort.direction === "asc";

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 4,
            },
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) {
            return;
        }
        const currentIds = displayedCustomers.map(
            (customer) => customer.id
        );
        const oldIndex = currentIds.indexOf(String(active.id));
        const newIndex = currentIds.indexOf(String(over.id));
        if (oldIndex === -1 || newIndex === -1) {
            return;
        }
        setOrderedIds(arrayMove(currentIds, oldIndex, newIndex));
    }

    function toggleSort(field: SortField) {
        if (sort.field === field) {
            onSortChange({ field, direction: sort.direction === "asc" ? "desc" : "asc" });
        } else {
            onSortChange({ field, direction: "asc" });
        }
    }

    const table = (
        <div className="overflow-x-auto rounded-md border border-ink-600 bg-ink-800 shadow-panel">
            <table className="w-full min-w-180 border-collapse">
                <thead>
                    <tr className="border-b border-ink-600 text-left text-xs uppercase tracking-wide text-mist-500">
                        <th className="w-8 px-2 py-3" aria-label="Drag handle" />

                        {COLUMNS.slice(0, 1).map((col) => (
                            <th
                                key={col.field}
                                className="px-1 py-3 pr-4 font-medium"
                            >
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 hover:text-mist-100"
                                    onClick={() => toggleSort(col.field)}
                                >
                                    {col.label}

                                    <SortIcon
                                        active={sort.field === col.field}
                                        direction={sort.direction}
                                    />
                                </button>
                            </th>
                        ))}

                        {COLUMNS.slice(1, 2).map((col) => (
                            <th
                                key={col.field}
                                className="px-4 py-3 font-medium"
                            >
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 hover:text-mist-100"
                                    onClick={() => toggleSort(col.field)}
                                >
                                    {col.label}

                                    <SortIcon
                                        active={sort.field === col.field}
                                        direction={sort.direction}
                                    />
                                </button>
                            </th>
                        ))}

                        <th className="hidden px-4 py-3 font-medium md:table-cell">
                            Phone
                        </th>

                        <th className="hidden px-4 py-3 font-medium md:table-cell">
                            Status
                        </th>

                        {COLUMNS.slice(2, 3).map((col) => (
                            <th
                                key={col.field}
                                className="px-4 py-3 font-medium"
                            >
                                <button
                                    type="button"
                                    className="flex items-center gap-1.5 hover:text-mist-100"
                                    onClick={() => toggleSort(col.field)}
                                >
                                    {col.label}

                                    <SortIcon
                                        active={sort.field === col.field}
                                        direction={sort.direction}
                                    />
                                </button>
                            </th>
                        ))}

                        <th className="px-2 py-3" aria-label="Actions" />
                    </tr>
                </thead>

                <tbody>
                    {isLoading &&
                        Array.from({ length: 8 }).map((_, i) => (
                            <tr key={i} className="border-b border-ink-700/70 last:border-b-0">
                                <td colSpan={7} className="px-4 py-3">
                                    <Skeleton className="h-8 w-full" />
                                </td>
                            </tr>
                        ))}

                    {!isLoading && isError && (
                        <tr>
                            <td colSpan={7} className="px-4 py-12 text-center text-sm text-coral">
                                Couldn&apos;t load customers. Try refreshing.
                            </td>
                        </tr>
                    )}

                    {!isLoading && !isError && displayedCustomers.length === 0 && (
                        <tr>
                            <td
                                colSpan={7}
                                className="px-4 py-12 text-center text-sm text-mist-500"
                            >
                                No customers match your search and filters.
                            </td>
                        </tr>
                    )}

                    {!isLoading && !isError && displayedCustomers.length > 0 &&
                        displayedCustomers.map((customer) => (
                            <SortableRow
                                key={customer.id}
                                customer={customer}
                                onSelect={onSelect}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                dragEnabled={dragEnabled}
                            />
                        ))}
                </tbody>
            </table>
            {!dragEnabled && !isLoading && displayedCustomers.length > 0 && (
                <p className={cn("border-t border-ink-700/70 px-4 py-2 text-xs text-mist-500")}>
                    Sort by Name (ascending) to drag and manually reorder rows.
                </p>
            )}
        </div>
    );

    if (!dragEnabled) {
        return table;
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={displayedCustomers.map((customer) => customer.id)}
                strategy={verticalListSortingStrategy}
            >
                {table}
            </SortableContext>
        </DndContext>
    );
}

