"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const redirectUrl = process.env.NEXT_PUBLIC_APP_REDIRECT_URL;

// List of allowed base URLs for mobile app redirection (protocol + host, optionally port)
const ALLOWED_REDIRECT_ORIGINS = [
  "https://example.com", // REPLACE with real mobile app URL
  "myapp://redirect",    // If your app uses custom scheme
];

function isAllowedRedirectUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ALLOWED_REDIRECT_ORIGINS.some(origin => {
      // Compare protocol+host (and port, if needed)
      // For standard http(s), compare origin
      if (origin.startsWith("http")) {
        return urlObj.origin === origin;
      }
      // For custom scheme, compare protocol+pathname
      if (origin.includes("://")) {
        return `${urlObj.protocol}//${urlObj.hostname}` === origin;
      }
      return false;
    });
  } catch (e) {
    return false;
  }
}

export function getMobileRedirectUrl(transactionId: string): string | null {
  if (!redirectUrl) {
    throw new Error("Missing redirect URL");
  }
  if (!isAllowedRedirectUrl(redirectUrl)) {
    // Optionally report/log here if desired
    return null;
  }
  return `${redirectUrl}?transactionId=${encodeURIComponent(transactionId)}`;
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
