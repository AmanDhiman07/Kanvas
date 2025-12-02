import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-4 focus-visible:ring-[var(--primary-magenta)]/20 shadow-md hover:shadow-lg active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[var(--primary-purple)] via-[var(--primary-magenta)] to-[var(--primary-rose)] text-white hover:shadow-[0_8px_24px_hsla(320,70%,60%,0.4)] hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-[0_8px_24px_hsla(0,70%,60%,0.4)] hover:scale-[1.02]",
        outline:
          "border-2 border-[var(--primary-purple)]/40 bg-white/60 backdrop-blur-md text-[var(--primary-purple)] hover:bg-[var(--primary-purple)]/10 hover:border-[var(--primary-purple)]",
        secondary:
          "bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-cyan)] text-white hover:shadow-[0_8px_24px_hsla(200,70%,60%,0.4)] hover:scale-[1.02]",
        ghost:
          "text-[var(--primary-purple)] hover:bg-[var(--primary-purple)]/10 hover:text-[var(--primary-magenta)] shadow-none",
        link:
          "text-[var(--primary-purple)] underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "h-11 px-6 py-3 has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-4 text-xs has-[>svg]:px-3",
        lg: "h-13 rounded-xl px-8 text-base has-[>svg]:px-6",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-13",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
