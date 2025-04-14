"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "../Hooks/authProvider";

/**
 * This component syncs the authentication state after navigation.
 * It should be placed high in the component tree to ensure auth state
 * is refreshed on each navigation.
 */
export default function AuthSync() {
  const { refreshSession } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Refresh session after navigation or when query params change
  useEffect(() => {
    refreshSession();
  }, [pathname, searchParams, refreshSession]);

  // Empty component, only used for the side effect
  return null;
} 