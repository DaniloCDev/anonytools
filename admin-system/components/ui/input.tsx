import React from "react"
import { cn } from "@/lib/utils" // se usa alguma função de classnames

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ...",
        className
      )}
      ref={ref} // <- importante
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }
