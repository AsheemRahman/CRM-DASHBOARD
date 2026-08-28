"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "@base-ui/react/select";
import {
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { cn } from "@/lib/utils";

const Select = SelectPrimitive.Root;

const SelectValue = SelectPrimitive.Value;

function SelectGroup({
  className,
  ...props
}: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("p-1", className)}
      {...props}
    />
  );
}

function SelectLabel({
  className,
  ...props
}: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn(
        "px-1.5 py-1 text-xs text-mist-500",
        className
      )}
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex w-full items-center justify-between gap-1.5",
        "rounded-sm border border-ink-600 bg-ink-800",
        "px-3 py-1 text-sm text-mist-100",
        "whitespace-nowrap select-none outline-none",
        "transition-colors",
        "focus:outline-none focus:ring-1 focus:ring-signal",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-placeholder:text-mist-500",
        "data-[size=default]:h-9",
        "data-[size=sm]:h-8",
        "data-[slot=select-value]:line-clamp-1",
        "data-[slot=select-value]:flex",
        "data-[slot=select-value]:items-center",
        "data-[slot=select-value]:gap-1.5",
        "[&_svg]:pointer-events-none",
        "[&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}

      <SelectPrimitive.Icon
        render={
          <ChevronDown className="size-4 text-mist-500" />
        }
      />
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<
    SelectPrimitive.Positioner.Props,
    | "align"
    | "alignOffset"
    | "side"
    | "sideOffset"
    | "alignItemWithTrigger"
  >) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="z-50 isolate"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={cn(
            "relative z-50 isolate",
            "max-h-(--available-height)",
            "min-w-32",
            "overflow-x-hidden overflow-y-auto",
            "rounded-sm",
            "border border-ink-600",
            "bg-ink-800 text-mist-100",
            "shadow-panel",
            "outline-none",
            "duration-100",

            // Animation
            "data-open:animate-in",
            "data-closed:animate-out",
            "data-open:fade-in-0",
            "data-closed:fade-out-0",
            "data-open:zoom-in-95",
            "data-closed:zoom-out-95",

            // Position animation
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2",

            className
          )}
          {...props}
        >
          <SelectScrollUpButton />

          <SelectPrimitive.List className="p-1">
            {children}
          </SelectPrimitive.List>

          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center",
        "rounded-xs py-1.5 pl-7 pr-2",
        "text-sm text-mist-100",
        "outline-none",

        // Hover / keyboard focus
        "focus:bg-ink-700",

        // Selected item
        "data-selected:text-signal",

        // Disabled
        "data-disabled:pointer-events-none",
        "data-disabled:opacity-50",

        // Icons
        "[&_svg]:pointer-events-none",
        "[&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",

        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-3.5" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        "pointer-events-none -mx-1 my-1 h-px bg-ink-600",
        className
      )}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: SelectPrimitive.ScrollUpArrow.Props) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn(
        "top-0 z-10 flex w-full cursor-default",
        "items-center justify-center",
        "bg-ink-800 py-1",
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronUp className="size-4 text-mist-500" />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: SelectPrimitive.ScrollDownArrow.Props) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn(
        "bottom-0 z-10 flex w-full cursor-default",
        "items-center justify-center",
        "bg-ink-800 py-1",
        "[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <ChevronDown className="size-4 text-mist-500" />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};