"use client";

import * as React from "react";
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors, } from "@dnd-kit/core";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Star, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { emptyFilters, FilterState, SavedFilter } from "@/lib/types";
import { useDeleteSavedFilter, useReorderSavedFilters, useSaveFilter, useSavedFilters, } from "@/hooks/use-saved-filters";

function CompanyMultiSelect({ companies, selected, onChange, }: { companies: string[]; selected: string[]; onChange: (v: string[]) => void; }) {
    const [open, setOpen] = React.useState(false);

    function toggle(company: string) {
        onChange(selected.includes(company) ? selected.filter((c) => c !== company) : [...selected, company]);
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <button className="flex min-h-9 w-full flex-wrap items-center gap-1 rounded-sm border border-ink-600 bg-ink-800 px-2 py-1.5 text-left text-sm text-mist-100 focus:outline-none focus:ring-1 focus:ring-signal">
                    {selected.length === 0 && <span className="px-1 text-mist-500">Select companies…</span>}
                    {selected.map((c) => (
                        <span
                            key={c}
                            className="flex items-center gap-1 rounded-full border border-signal/30 bg-signal/10 px-2 py-0.5 text-xs text-signal"
                        >
                            {c}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggle(c);
                                }}
                            />
                        </span>
                    ))}
                </button>
            </PopoverTrigger>
            <PopoverContent className="max-h-64 w-[--radix-popover-trigger-width] overflow-y-auto scrollbar-thin p-1">
                {companies.map((c) => (
                    <label
                        key={c}
                        className="flex cursor-pointer items-center gap-2 rounded-xs px-2 py-1.5 text-sm text-mist-300 hover:bg-ink-700"
                    >
                        <Checkbox checked={selected.includes(c)} onCheckedChange={() => toggle(c)} />
                        {c}
                    </label>
                ))}
                {companies.length === 0 && <p className="px-2 py-1.5 text-xs text-mist-500">No companies yet.</p>}
            </PopoverContent>
        </Popover>
    );
}

function SortableSavedFilter({ filter, onApply, onDelete, }: {
    filter: SavedFilter;
    onApply: (f: SavedFilter) => void;
    onDelete: (f: SavedFilter) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: filter.id });
    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group flex items-center gap-1 rounded-sm border border-ink-600 bg-ink-900 px-1.5 py-1.5 text-sm"
        >
            <button
                className="cursor-grab touch-none rounded-xs p-1 text-mist-500 hover:text-mist-100 active:cursor-grabbing"
                aria-label="Drag to reorder"
                {...attributes}
                {...listeners}
            >
                <GripVertical className="h-3.5 w-3.5" />
            </button>
            <button className="flex flex-1 items-center gap-1.5 truncate text-left text-mist-300 hover:text-mist-100" onClick={() => onApply(filter)}>
                {filter.isBuiltIn && <Star className="h-3 w-3 shrink-0 text-amber" />}
                <span className="truncate">{filter.name}</span>
            </button>
            {!filter.isBuiltIn && (
                <button
                    className="rounded-xs p-1 text-mist-500 opacity-0 hover:text-coral group-hover:opacity-100"
                    aria-label={`Delete ${filter.name}`}
                    onClick={() => onDelete(filter)}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            )}
        </div>
    );
}

export function FiltersPanel({
    open,
    onOpenChange,
    draft,
    onDraftChange,
    onApply,
    onClearAll,
    companies,
    activeCount,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    draft: FilterState;
    onDraftChange: (f: FilterState) => void;
    onApply: (f: FilterState) => void;
    onClearAll: () => void;
    companies: string[];
    activeCount: number;
}) {
    const { data: savedFilters = [] } = useSavedFilters();
    const saveMutation = useSaveFilter();
    const deleteMutation = useDeleteSavedFilter();
    const reorderMutation = useReorderSavedFilters();
    const [saveName, setSaveName] = React.useState("");
    const [showSaveInput, setShowSaveInput] = React.useState(false);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
    const [localFilters, setLocalFilters] = React.useState(savedFilters);
    React.useEffect(() => setLocalFilters(savedFilters), [savedFilters]);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = localFilters.findIndex((f) => f.id === active.id);
        const newIndex = localFilters.findIndex((f) => f.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return;
        const reordered = arrayMove(localFilters, oldIndex, newIndex);
        setLocalFilters(reordered);
        reorderMutation.mutate(reordered.map((f) => f.id));
    }

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-sm" onClick={() => onOpenChange(false)} />
            <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-ink-600 bg-ink-800 shadow-panel animate-fade-in">
                <div className="flex items-center justify-between border-b border-ink-600 px-5 py-4">
                    <div className="flex items-center gap-2">
                        <h2 className="font-display text-base font-semibold text-mist-100">Filters</h2>
                        {activeCount > 0 && <Badge variant="signal">{activeCount} active</Badge>}
                    </div>
                    <button
                        className="rounded-xs p-1 text-mist-500 hover:text-mist-100"
                        onClick={() => onOpenChange(false)}
                        aria-label="Close filters"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
                    <div className="space-y-6">
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <Label>Status</Label>
                                <button className="text-xs text-mist-500 hover:text-signal" onClick={onClearAll}>
                                    Clear All
                                </button>
                            </div>
                            <div className="space-y-2">
                                {(["active", "inactive"] as const).map((s) => (
                                    <label key={s} className="flex cursor-pointer items-center gap-2 text-sm text-mist-300">
                                        <Checkbox
                                            checked={draft.status.includes(s)}
                                            onCheckedChange={(checked) =>
                                                onDraftChange({
                                                    ...draft,
                                                    status: checked ? [...draft.status, s] : draft.status.filter((x) => x !== s),
                                                })
                                            }
                                        />
                                        {s === "active" ? "Active Customer" : "Inactive Customer"}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label className="mb-2 block">Company</Label>
                            <CompanyMultiSelect
                                companies={companies}
                                selected={draft.companies}
                                onChange={(v) => onDraftChange({ ...draft, companies: v })}
                            />
                        </div>

                        <div>
                            <Label className="mb-2 block">Date Range (Last Contact)</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <p className="mb-1 text-xs text-mist-500">From</p>
                                    <Input type="date" value={draft.dateFrom ?? ""}
                                        onChange={(e) => onDraftChange({ ...draft, dateFrom: e.target.value || null })}
                                    />
                                </div>
                                <div>
                                    <p className="mb-1 text-xs text-mist-500">To</p>
                                    <Input type="date" value={draft.dateTo ?? ""}
                                        onChange={(e) => onDraftChange({ ...draft, dateTo: e.target.value || null })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="phone-filter" className="mb-2 block">
                                Phone Number
                            </Label>
                            <Input id="phone-filter" placeholder="e.g., (555) 123-4567" value={draft.phone}
                                onChange={(e) => onDraftChange({ ...draft, phone: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label htmlFor="email-filter" className="mb-2 block">
                                Email Contains
                            </Label>
                            <Input id="email-filter" placeholder="e.g., @gmail.com" value={draft.email}
                                onChange={(e) => onDraftChange({ ...draft, email: e.target.value })}
                            />
                        </div>

                        <div className="border-t border-ink-600 pt-4">
                            <div className="mb-2 flex items-center justify-between">
                                <Label>Saved Filters</Label>
                                <button className="text-xs text-signal hover:text-signal-bright" onClick={() => setShowSaveInput((v) => !v)}>
                                    Save Filter
                                </button>
                            </div>

                            {showSaveInput && (
                                <div className="mb-3 flex gap-2">
                                    <Input placeholder="Filter name…" value={saveName} onChange={(e) => setSaveName(e.target.value)} autoFocus />
                                    <Button
                                        size="sm"
                                        disabled={!saveName.trim() || saveMutation.isPending}
                                        onClick={() => {
                                            saveMutation.mutate(
                                                { name: saveName.trim(), filters: draft },
                                                {
                                                    onSuccess: () => {
                                                        setSaveName("");
                                                        setShowSaveInput(false);
                                                    },
                                                }
                                            );
                                        }}
                                    >
                                        Save
                                    </Button>
                                </div>
                            )}

                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={localFilters.map((f) => f.id)} strategy={verticalListSortingStrategy}>
                                    <div className="space-y-1.5">
                                        {localFilters.map((f) => (
                                            <SortableSavedFilter
                                                key={f.id}
                                                filter={f}
                                                onApply={(sf) => onDraftChange(sf.filters)}
                                                onDelete={(sf) => deleteMutation.mutate(sf.id)}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                            <p className="mt-2 text-xs text-mist-500">Drag the handle to reorder your saved filters.</p>
                        </div>
                    </div>
                </div>

                <div className={cn("flex gap-2 border-t border-ink-600 px-5 py-4")}>
                    <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() => {
                            onDraftChange(emptyFilters);
                            onClearAll();
                        }}
                    >
                        Clear All
                    </Button>
                    <Button className="flex-1" onClick={() => { onApply(draft); onOpenChange(false); }}>
                        Apply Filters
                    </Button>
                </div>
            </div>
        </>
    );
}
