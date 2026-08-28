import * as React from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "group/button",
    "inline-flex shrink-0 items-center justify-center gap-2",
    "whitespace-nowrap",
    "rounded-sm",
    "text-sm font-medium",
    "transition-colors",
    "outline-none",
    "select-none",

    // Focus
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-signal",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-ink-900",

    // Disabled
    "disabled:pointer-events-none",
    "disabled:opacity-50",

    // SVG
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-signal text-ink-950 hover:bg-signal-bright",

        secondary:
          "border border-ink-600 bg-ink-700 text-mist-100 hover:bg-ink-600",

        outline:
          "border border-ink-600 bg-transparent text-mist-100 hover:bg-ink-800",

        ghost:
          "text-mist-300 hover:bg-ink-800 hover:text-mist-100",

        destructive:
          "bg-coral text-ink-950 hover:bg-coral/90",

        link:
          "text-signal underline-offset-4 hover:underline",
      },

      size: {
        default:
          "h-9 px-4 py-2",

        sm:
          "h-8 px-3 text-xs",

        lg:
          "h-10 px-6",

        icon:
          "h-9 w-9 shrink-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(
        buttonVariants({
          variant,
          size,
          className,
        })
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2
          className="size-4 animate-spin"
          aria-hidden="true"
        />
      )}

      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };