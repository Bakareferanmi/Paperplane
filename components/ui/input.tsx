import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-md bg-card px-3 text-base text-foreground shadow-(--shadow-border) outline-none transition-[box-shadow] duration-150 ease-out placeholder:text-muted-foreground md:text-sm",
        "focus-visible:ring-ring/40 focus-visible:ring-[3px]",
        "disabled:pointer-events-none disabled:opacity-50",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
