"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const redirectUrl = process.env.NEXT_PUBLIC_APP_REDIRECT_URL;

export function getMobileRedirectUrl(transactionId: string): string {
  if (!redirectUrl) {
    throw new Error("Missing redirect URL");
  }
  // Only allow http and https protocols, and prevent javascript/data schemes
  let url: URL;
  try {
    url = new URL(redirectUrl);
  } catch {
    throw new Error("Invalid redirect URL");
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Unsafe redirect URL protocol");
  }
  url.searchParams.set("transactionId", transactionId);
  return url.toString();
}

export function useRedirectWarning() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
    const redirectUrl = process.env.NEXT_PUBLIC_APP_REDIRECT_URL;

    if (!isLocalhost && !redirectUrl) {
      setTimeout(() => {
        toast.warning(
          "NEXT_PUBLIC_APP_REDIRECT_URL is not set. Please set it in your environment variables for proper app redirects.",
          { duration: 10000 },
        );
      }, 1000);
    }
  }, []);
}
