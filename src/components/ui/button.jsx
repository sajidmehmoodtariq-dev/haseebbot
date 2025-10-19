import { cn } from "@/lib/utils";

export function Button({ className, variant = "default", size = "default", children, ...props }) {
  const variants = {
    default: "neural-btn",
    ghost: "hover:bg-white/10 text-white/80 hover:text-white transition-colors",
    outline: "border border-white/20 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
  };

  const sizes = {
    default: "px-4 py-2",
    sm: "px-3 py-1.5 text-sm",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}