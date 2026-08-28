"use client";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from "@/components/ui/alert-dialog";
import { useDeleteCustomer } from "@/hooks/use-customers";
import { Customer } from "@/lib/types";

export function DeleteCustomerDialog({ customer, onOpenChange, }: { customer: Customer | null; onOpenChange: (open: boolean) => void; }) {
    const deleteMutation = useDeleteCustomer();

    return (
        <AlertDialog open={!!customer} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete customer</AlertDialogTitle>
                    <AlertDialogDescription>
                        {customer ? `This will permanently remove ${customer.name} and all associated notes. This action can't be undone.` : ""}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={deleteMutation.isPending}
                        onClick={() => {
                            if (!customer) return;
                            deleteMutation.mutate(customer.id, {
                                onSuccess: () => onOpenChange(false),
                            });
                        }}
                    >
                        {deleteMutation.isPending ? "Deleting…" : "Delete customer"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
