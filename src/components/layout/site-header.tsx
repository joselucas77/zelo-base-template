"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/components/auth/permissions-provider";

export function SiteHeader({ className, ...props }: React.ComponentProps<"header">) {
  const { user } = usePermissions();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span className="font-semibold text-base md:text-lg">
          {user?.tenantName || "Workspace"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium leading-none">{user.name}</span>
            <span className="text-xs text-muted-foreground mt-0.5">{user.email}</span>
          </div>
        )}
      </div>
    </header>
  );
}
