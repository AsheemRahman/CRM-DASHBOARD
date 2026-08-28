"use client";

import { Mail, Phone, Building2, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { avatarColor, formatDate, initials } from "@/lib/utils";
import { Customer } from "@/lib/types";

export function CustomerDetailsDialog({
    customer,
    onOpenChange,
    onEdit,
    onDelete,
}: {
    customer: Customer | null;
    onOpenChange: (open: boolean) => void;
    onEdit: (c: Customer) => void;
    onDelete: (c: Customer) => void;
}) {
    return (
        <Dialog open={!!customer} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                {customer && (
                    <>
                        <DialogHeader className="flex-row items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-ink-950"
                                    style={{ backgroundColor: avatarColor(customer.name) }}
                                >
                                    {initials(customer.name)}
                                </div>
                                <div>
                                    <p className="font-display text-base font-semibold text-mist-100">{customer.name}</p>
                                    <p className="text-xs text-mist-500">{customer.company || "No company"}</p>
                                </div>
                            </div>
                            <div className="flex gap-1.5 pt-1">
                                <Button variant="secondary" size="sm" onClick={() => onEdit(customer)}>
                                    <Pencil className="h-3.5 w-3.5" /> Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => onDelete(customer)}>
                                    <Trash2 className="h-3.5 w-3.5" /> Delete
                                </Button>
                            </div>
                        </DialogHeader>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="col-span-2 space-y-2">
                                <p className="text-xs uppercase tracking-wide text-mist-500">Contact Information</p>
                                <div className="flex items-center gap-2 text-mist-300">
                                    <Mail className="h-3.5 w-3.5 text-mist-500" /> {customer.email}
                                </div>
                                <div className="flex items-center gap-2 text-mist-300">
                                    <Phone className="h-3.5 w-3.5 text-mist-500" /> {customer.phone}
                                </div>
                                {customer.company && (
                                    <div className="flex items-center gap-2 text-mist-300">
                                        <Building2 className="h-3.5 w-3.5 text-mist-500" /> {customer.company}
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-wide text-mist-500">Status</p>
                                <Badge variant={customer.status === "active" ? "active" : "inactive"} className="mt-1.5">
                                    {customer.status === "active" ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-mist-500">Last Contact</p>
                                <p className="mt-1.5 text-mist-100">{formatDate(customer.lastContactDate)}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs uppercase tracking-wide text-mist-500">Customer Since</p>
                                <p className="mt-1.5 text-mist-100">{formatDate(customer.createdAt)}</p>
                            </div>

                            <div className="col-span-2">
                                <p className="text-xs uppercase tracking-wide text-mist-500">Notes</p>
                                <p className="mt-1.5 whitespace-pre-wrap rounded-sm border border-ink-600 bg-ink-900 p-3 text-mist-300">
                                    {customer.notes || "No notes yet."}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
