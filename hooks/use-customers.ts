"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    createCustomer,
    deleteCustomer,
    fetchCustomerCompanies,
    fetchCustomerStats,
    fetchCustomers,
    updateCustomer,
} from "@/api/customers";
import { Customer, CustomerInput, CustomerQueryParams } from "@/lib/types";

const CUSTOMERS_KEY = "customers";
const COMPANIES_KEY = "companies";

export function useCustomers(params: CustomerQueryParams) {
    return useQuery({
        queryKey: [CUSTOMERS_KEY, params],
        queryFn: () => fetchCustomers(params),
        placeholderData: (prev) => prev, // keep old page visible while refetching
    });
}

export function useCustomerCompanies() {
    return useQuery({
        queryKey: [COMPANIES_KEY],
        queryFn: fetchCustomerCompanies,
        staleTime: 60_000,
    });
}

export function useCustomerStats() {
    return useQuery({
        queryKey: ["customer-stats"],
        queryFn: fetchCustomerStats,
        staleTime: 30_000,
    });
}

export function useCreateCustomer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CustomerInput) => createCustomer(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
            queryClient.invalidateQueries({ queryKey: [COMPANIES_KEY] });
            queryClient.invalidateQueries({ queryKey: ["customer-stats"] });
            toast.success("Customer added");
        },
        onError: (err: Error) => toast.error(err.message || "Failed to add customer"),
    });
}

export function useUpdateCustomer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }: { id: string; input: CustomerInput }) => updateCustomer(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
            queryClient.invalidateQueries({ queryKey: [COMPANIES_KEY] });
            queryClient.invalidateQueries({ queryKey: ["customer-stats"] });
            toast.success("Customer updated");
        },
        onError: (err: Error) => toast.error(err.message || "Failed to update customer"),
    });
}

export function useDeleteCustomer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteCustomer(id),
        onMutate: async (id: string) => {
            // Optimistic update: remove the row immediately from every cached customers query
            await queryClient.cancelQueries({ queryKey: [CUSTOMERS_KEY] });
            const previous = queryClient.getQueriesData<{ data: Customer[] }>({ queryKey: [CUSTOMERS_KEY] });
            previous.forEach(([key, value]) => {
                if (!value) return;
                queryClient.setQueryData(key, {
                    ...value,
                    data: value.data.filter((c) => c.id !== id),
                });
            });
            return { previous };
        },
        onError: (err: Error, _id, context) => {
            context?.previous.forEach(([key, value]) => queryClient.setQueryData(key, value));
            toast.error(err.message || "Failed to delete customer");
        },
        onSuccess: () => toast.success("Customer deleted"),
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: [CUSTOMERS_KEY] });
            queryClient.invalidateQueries({ queryKey: [COMPANIES_KEY] });
            queryClient.invalidateQueries({ queryKey: ["customer-stats"] });
        },
    });
}
