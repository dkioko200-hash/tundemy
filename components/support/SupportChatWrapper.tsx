"use client";

import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

// Lazy-load the full chat widget so it doesn't add to initial page bundle
const SupportChat = dynamic(() => import("./SupportChat"), { ssr: false });

const AUTH_PATHS = ["/auth/login", "/auth/signup", "/auth/forgot-password", "/auth/reset-password"];

export default function SupportChatWrapper() {
  const pathname = usePathname();

  // Don't show on auth pages
  if (AUTH_PATHS.some((p) => pathname?.startsWith(p))) {
    return null;
  }

  return <SupportChat />;
}
