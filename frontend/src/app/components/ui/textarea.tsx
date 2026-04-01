import * as React from "react";
import { cn } from "./utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-[120px] w-full rounded-md border border-[#8b9a8e] bg-white px-3 py-2 text-sm outline-none",
          "placeholder:text-[#999] focus-visible:ring-2 focus-visible:ring-[#8b9a8e]",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";