import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Loader({ className }: { className?: string }) {
  return (
    <Loader2 className={cn("text-white h-5 w-5 animate-spin", className)} />
  );
}

export function LoaderBig({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn("text-muted-foreground h-10 w-10 animate-spin", className)}
    />
  );
}
