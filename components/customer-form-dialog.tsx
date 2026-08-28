"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCustomer, useUpdateCustomer } from "@/hooks/use-customers";
import { isValidEmail, isValidPhone } from "@/lib/utils";
import { Customer } from "@/lib/types";

const schema = z.object({
    name: z.string().trim().min(1, "Name is required").min(4, "Name should be at least 4 characters").max(25, "Name must be at most 25 characters"),
    email: z.string().trim().min(1, "Email is required").refine(isValidEmail,"Enter a valid email address"),
    phone: z.string().trim().min(1, "Phone number is required").regex(/^\d{10}$/, "Phone number must be exactly 10 digits").refine(isValidPhone, "Enter a valid 10-digit phone number"),
    company: z.string().trim(),
    status: z.enum(["active", "inactive"]),
    lastContactDate: z.string().trim().min(1, "Last contact date is required"),
    notes: z.string().trim().max(200, "Notes must be at most 200 characters"),
});

type FormValues = z.infer<typeof schema>;

function toDateInputValue(iso: string): string {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
}

export function CustomerFormDialog({
    open,
    mode,
    customer,
    onOpenChange,
}: {
    open: boolean;
    mode: "add" | "edit";
    customer: Customer | null;
    onOpenChange: (open: boolean) => void;
}) {
    const createMutation = useCreateCustomer();
    const updateMutation = useUpdateCustomer();
    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            company: "",
            status: "active",
            lastContactDate: toDateInputValue(new Date().toISOString()),
            notes: "",
        },
    });

    React.useEffect(() => {
        if (!open) return;
        if (mode === "edit" && customer) {
            reset({
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                company: customer.company,
                status: customer.status,
                lastContactDate: toDateInputValue(customer.lastContactDate),
                notes: customer.notes,
            });
        } else {
            reset({
                name: "",
                email: "",
                phone: "",
                company: "",
                status: "active",
                lastContactDate: toDateInputValue(new Date().toISOString()),
                notes: "",
            });
        }
    }, [open, mode, customer, reset]);

    function onSubmit(values: FormValues) {
        const input = {
            name: values.name,
            email: values.email,
            phone: values.phone,
            company: values.company ?? "",
            status: values.status,
            lastContactDate: new Date(values.lastContactDate).toISOString(),
            notes: values.notes ?? "",
        };

        if (mode === "edit" && customer) {
            updateMutation.mutate(
                { id: customer.id, input },
                { onSuccess: () => onOpenChange(false) }
            );
        } else {
            createMutation.mutate(input, { onSuccess: () => onOpenChange(false) });
        }
    }

    const status = useWatch({control,name: "status",});

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add Customer" : "Edit Customer"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="name">
                            Name <span className="text-coral">*</span>
                        </Label>
                        <Input id="name" placeholder="Jane Cooper" {...register("name")} />
                        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email">
                            Email <span className="text-coral">*</span>
                        </Label>
                        <Input id="email" type="email" placeholder="jane@example.com" {...register("email")} />
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="phone">
                            Phone <span className="text-coral">*</span>
                        </Label>
                        <Input id="phone" placeholder="9876543210" {...register("phone")} />
                        {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="company">Company</Label>
                        <Input id="company" placeholder="Corpration" {...register("company")} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label>Status</Label>
                            <Select value={status} onValueChange={(value) => setValue("status", value as "active" | "inactive")}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active Customer</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="lastContactDate">Last Contact Date</Label>
                            <Input id="lastContactDate" type="date" {...register("lastContactDate")} />
                            {errors.lastContactDate && <p className="text-xs text-red-500">{errors.lastContactDate.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea id="notes" rows={3} placeholder="Meeting notes and follow-up items…" {...register("notes")} />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={isSubmitting}>
                            {mode === "add" ? "Add Customer" : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
