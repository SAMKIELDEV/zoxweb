"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** The visitor's own clock, read after mount (the server's time would be wrong), then on each new minute. */
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    let timer = 0;
    const tick = () => {
      const date = new Date();
      setNow(date);
      timer = window.setTimeout(tick, 60_000 - (date.getSeconds() * 1000 + date.getMilliseconds()) + 50);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);
  return now;
}

/** "8:27 PM" or "20:27", as the visitor's locale writes it. */
export function chatTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

/** "8:27" or "20:27": the status bar drops the AM/PM, as phones do. */
function statusTime(date: Date): string {
  return chatTime(date).replace(/\s?[AP]\.?M\.?$/i, "");
}

const random = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

/** Wi-Fi: a dot and three arcs, `level` of them lit. */
function WifiIcon({ level }: { level: number }) {
  const arcs = ["M8.5 11.6a2.2 2.2 0 013 0", "M6.3 9.4a5.3 5.3 0 017.4 0", "M4.1 7.2a8.4 8.4 0 0111.8 0"];
  return (
    <svg aria-hidden="true" viewBox="0 0 20 16" className="h-3.5 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="10" cy="13.6" r="1.1" fill="currentColor" stroke="none" />
      {arcs.map((d, index) => (
        <path key={d} d={d} className="transition-opacity duration-(--dur-base)" style={{ opacity: index < level ? 1 : 0.28 }} />
      ))}
    </svg>
  );
}

/** Mobile signal: four rising bars, `level` of them lit. */
function SignalIcon({ level }: { level: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 14" className="h-3.5 w-4" fill="currentColor">
      {[0, 1, 2, 3].map((bar) => (
        <rect
          key={bar}
          x={bar * 4}
          y={11 - bar * 3}
          width="2.6"
          height={3 + bar * 3}
          rx="0.6"
          className="transition-opacity duration-(--dur-base)"
          style={{ opacity: bar < level ? 1 : 0.28 }}
        />
      ))}
    </svg>
  );
}

/** Battery: the outline, a fill for `level` percent, and the number beside it. */
function BatteryIcon({ level }: { level: number }) {
  return (
    <span className="flex items-center gap-0.5">
      <span className="tabular-nums">{level}%</span>
      <svg aria-hidden="true" viewBox="0 0 26 14" className="h-3.5 w-6.5">
        <rect x="0.75" y="0.75" width="21.5" height="12.5" rx="3.2" fill="none" stroke="currentColor" strokeWidth="1.3" opacity="0.5" />
        <rect x="23.4" y="4.6" width="1.9" height="4.8" rx="0.9" fill="currentColor" opacity="0.5" />
        {/* The fill shrinks from its left edge (a transform), so nothing is laid out again. */}
        <rect
          x="2.4"
          y="2.4"
          width="18.2"
          height="9.2"
          rx="1.8"
          fill="currentColor"
          className="origin-left transition-transform duration-(--dur-slow) [transform-box:fill-box]"
          style={{ transform: `scaleX(${level / 100})` }}
        />
      </svg>
    </span>
  );
}

/**
 * The phone's status bar: the visitor's real time, and Wi-Fi, signal and
 * battery that change the way a real phone's do. While `live`, the Wi-Fi
 * and signal strength drift every few seconds and the battery drains a
 * percent now and then; otherwise they hold still (off screen, hidden tab,
 * reduced motion). Decorative: hidden from assistive technology.
 */
export function PhoneStatusBar({ live, className }: { live: boolean; className?: string }) {
  const now = useNow();
  const [wifi, setWifi] = useState(3);
  const [signal, setSignal] = useState(4);
  const [battery, setBattery] = useState(82);

  // A believable starting charge, picked on this visit (after mount, so the server and browser agree).
  useEffect(() => setBattery(random(64, 93)), []);

  useEffect(() => {
    if (!live) return;
    let timer = 0;
    const drift = () => {
      setWifi((level) => Math.min(3, Math.max(1, level + random(-1, 1))));
      setSignal((level) => Math.min(4, Math.max(2, level + random(-1, 1))));
      timer = window.setTimeout(drift, random(2800, 5200));
    };
    timer = window.setTimeout(drift, random(2000, 3500));
    const drain = window.setInterval(() => setBattery((level) => Math.max(12, level - 1)), 25_000);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(drain);
    };
  }, [live]);

  return (
    <div
      aria-hidden="true"
      className={cn("relative flex h-8 items-center justify-between px-6 text-xs font-medium text-wa-ink", className)}
    >
      {/* Space is held before the time arrives, so nothing moves. */}
      <span className="min-w-9 tabular-nums">{now ? statusTime(now) : ""}</span>
      <span className="absolute top-2.5 left-1/2 size-3 -translate-x-1/2 rounded-full bg-device" />
      <span className="flex items-center gap-1.5">
        <WifiIcon level={wifi} />
        <SignalIcon level={signal} />
        <BatteryIcon level={battery} />
      </span>
    </div>
  );
}
