import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border-2 border-transparent",
          "bg-white/60 backdrop-blur-md",
          "px-4 py-3 text-base font-medium",
          "text-[var(--text-primary)]",
          "placeholder:text-[var(--text-muted)] placeholder:font-normal",
          "shadow-sm hover:shadow-md",
          "transition-all duration-300 ease-out",
          "focus-visible:outline-none focus-visible:border-[var(--primary-magenta)]",
          "focus-visible:shadow-[0_0_0_4px_hsla(320,70%,60%,0.15)]",
          "focus-visible:bg-white/80",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-white/30",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }


