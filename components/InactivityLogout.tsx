"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

// Signs the user out after 60 minutes of inactivity.
//
// - Activity = pointer, keyboard, touch, scroll/wheel (throttled to one
//   localStorage write per 30s), tab becoming visible again, or an actively
//   playing <video> (so a learner watching a long lesson is never logged out).
// - Last-activity timestamp lives in localStorage so it is shared across tabs
//   and survives reloads: a user who closes the laptop and comes back after
//   an hour is signed out by the mount/interval check.
// - Checks run once per minute; on expiry we sign out and redirect to login.

const TIMEOUT_MS = 60 * 60 * 1000; // 60 minutes of inactivity
const CHECK_INTERVAL_MS = 60 * 1000; // evaluate once per minute
const ACTIVITY_THROTTLE_MS = 30 * 1000; // record activity at most every 30s
const STORAGE_KEY = "tundemy_last_activity";

export default function InactivityLogout() {
    const router = useRouter();

  useEffect(() => {
        const supabase = createClient();
        let signedIn = false;
        let signingOut = false;
        let lastWrite = 0;

                const readLast = (): number => {
                        try {
                                  return parseInt(localStorage.getItem(STORAGE_KEY) ?? "0", 10) || 0;
                        } catch {
                                  return 0;
                        }
                };

                const writeNow = () => {
                        lastWrite = Date.now();
                        try {
                                  localStorage.setItem(STORAGE_KEY, String(lastWrite));
                        } catch {
                                  // localStorage unavailable — interval check falls back to writeNow-less flow
                        }
                };

                const expired = () => {
                        const last = readLast();
                        return last > 0 && Date.now() - last >= TIMEOUT_MS;
                };

                const signOutNow = async () => {
                        if (signingOut) return;
                        signingOut = true;
                        signedIn = false;
                        try {
                                  localStorage.removeItem(STORAGE_KEY);
                        } catch {
                                  // ignore
                        }
                        await supabase.auth.signOut();
                        router.replace("/auth/login?reason=inactivity");
                };

                const record = () => {
                        const now = Date.now();
                        if (now - lastWrite < ACTIVITY_THROTTLE_MS) return;
                        if (signedIn && !signingOut && expired()) {
                                  // Session already timed out — the next interaction logs the user out
                          // instead of silently reviving the session.
                          void signOutNow();
                                  return;
                        }
                        writeNow();
                };

                const onVisible = () => {
                        if (!document.hidden) record();
                };

                const isVideoPlaying = () => {
                        const vids = Array.from(document.querySelectorAll("video"));
                        return vids.some((v) => !v.paused && !v.ended && v.currentTime > 0);
                };

                const check = () => {
                        if (!signedIn || signingOut) return;
                        if (isVideoPlaying()) {
                                  // Watching a lesson counts as activity.
                          lastWrite = 0;
                                  writeNow();
                                  return;
                        }
                        if (readLast() === 0) {
                                  writeNow();
                                  return;
                        }
                        if (expired()) void signOutNow();
                };

                const events: (keyof DocumentEventMap)[] = ["pointerdown", "keydown", "touchstart", "scroll", "wheel"];
        for (const e of events) document.addEventListener(e, record, { passive: true, capture: true });
        document.addEventListener("visibilitychange", onVisible);

                supabase.auth.getSession().then(({ data }) => {
                        signedIn = !!data.session;
                        if (!signedIn) return;
                        if (expired()) {
                                  void signOutNow();
                        } else {
                                  lastWrite = 0;
                                  record();
                        }
                });

                const {
                        data: { subscription },
                } = supabase.auth.onAuthStateChange((_event, session) => {
                        const wasSignedIn = signedIn;
                        signedIn = !!session;
                        if (signedIn && !wasSignedIn) {
                                  signingOut = false;
                                  lastWrite = 0;
                                  writeNow();
                        }
                });

                const interval = setInterval(check, CHECK_INTERVAL_MS);

                return () => {
                        for (const e of events) document.removeEventListener(e, record, { capture: true });
                        document.removeEventListener("visibilitychange", onVisible);
                        clearInterval(interval);
                        subscription.unsubscribe();
                };
  }, [router]);

  return null;
}
