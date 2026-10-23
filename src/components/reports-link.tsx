import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parseReportView, type ReportView } from "@/lib/report-views";
import { canOpenPath } from "@/lib/roles";

export function ReportsLink({
  view,
  label = "Reports",
}: {
  view?: ReportView;
  label?: string;
}) {
  const role = "admin" as const;
  if (!canOpenPath(role, "/reports")) return null;
  return (
    <Button asChild variant="outline">
      <Link to="/reports" search={{ view: parseReportView(view) }}>
        {label}
        <ArrowUpRight className="size-4" />
      </Link>
    </Button>
  );
}
