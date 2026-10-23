import { cn } from "@/lib/utils";
import { publicUrl } from "@/lib/public-url";

export function HotelLogo({
  className,
  mark,
  alt = "Hotel Status Residency",
}: {
  className?: string;
  mark?: boolean;
  alt?: string;
}) {
  return (
    <img
      src={publicUrl(mark ? "logo-mark.png?v=4" : "logo.png?v=4")}
      alt={alt}
      className={cn("h-11 w-auto max-w-none object-contain object-center", className)}
    />
  );
}
