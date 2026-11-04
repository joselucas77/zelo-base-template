"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { UserContextData } from "@/lib/validations/auth";

interface PermissionsContextValue {
  user: UserContextData | null;
  can: (module: string, action: string) => boolean;
}

const PermissionsContext = createContext<PermissionsContextValue>({
  user: null,
  can: () => false,
});

export interface PermissionsProviderProps {
  initialContext: UserContextData | null;
  children: React.ReactNode;
}

export function PermissionsProvider({
  initialContext,
  children,
}: PermissionsProviderProps) {
  const value = useMemo<PermissionsContextValue>(() => {
    return {
      user: initialContext,
      can: (module: string, action: string) => {
        if (!initialContext) return false;
        const perms = initialContext.permissions || {};
        const moduleActions = perms[module] || [];
        return moduleActions.includes(action) || moduleActions.includes("*");
      },
    };
  }, [initialContext]);

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  return useContext(PermissionsContext);
}
