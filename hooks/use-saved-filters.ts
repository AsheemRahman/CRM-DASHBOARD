"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteSavedFilter, fetchSavedFilters, reorderSavedFilters, saveFilter } from "@/api/filters";
import { FilterState, SavedFilter } from "@/lib/types";

const KEY = "saved-filters";

export function useSavedFilters() {
    return useQuery({
        queryKey: [KEY],
        queryFn: fetchSavedFilters,
    });
}

export function useSaveFilter() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ name, filters }: { name: string; filters: FilterState }) => saveFilter(name, filters),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [KEY] });
            toast.success("Filter saved");
        },
        onError: () => toast.error("Failed to save filter"),
    });
}

export function useDeleteSavedFilter() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteSavedFilter(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [KEY] });
            toast.success("Filter removed");
        },
        onError: () => toast.error("Failed to remove filter"),
    });
}

export function useReorderSavedFilters() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderedIds: string[]) => reorderSavedFilters(orderedIds),
        onMutate: async (orderedIds: string[]) => {
            await queryClient.cancelQueries({ queryKey: [KEY] });
            const previous = queryClient.getQueryData<SavedFilter[]>([KEY]);
            if (previous) {
                const byId = new Map(previous.map((f) => [f.id, f]));
                const reordered = orderedIds
                    .map((id, idx) => {
                        const f = byId.get(id);
                        return f ? { ...f, order: idx } : null;
                    })
                    .filter((f): f is SavedFilter => f !== null);
                queryClient.setQueryData([KEY], reordered);
            }
            return { previous };
        },
        onError: (_err, _orderedIds, context) => {
            if (context?.previous) queryClient.setQueryData([KEY], context.previous);
            toast.error("Failed to reorder filters");
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: [KEY] }),
    });
}
