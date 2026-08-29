import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 border border-gray-300 hover:border-gray-400 focus:border-amber-300   rounded-sm p-3  outline-hidden",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
