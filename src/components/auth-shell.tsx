import type { ReactNode } from "react";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";

export function AuthShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/login") return <Navigate to="/" />;
  return <AppShell>{children}</AppShell>;
}
