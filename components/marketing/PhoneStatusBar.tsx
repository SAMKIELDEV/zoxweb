"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { BinanceIcon, TelegramIcon, WhatsAppIcon } from "./BrandIcons";

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

/**
 * Battery, as Samsung's One UI draws it: a rounded bar with the charge as
 * its fill and the percentage written inside. The number is drawn twice,
 * dark over the empty part and light over the fill (clipped to it), so it
 * reads over both. The fill moves by transform and clip-path only.
 */
function BatteryIcon({ level }: { level: number }) {
  const empty = `${100 - level}%`;
  const move = "transition-[transform,clip-path] duration-(--dur-slow) ease-zox";
  return (
    <span className="flex items-center">
      <span className="relative h-3 w-6 overflow-hidden rounded-[0.25rem] bg-wa-ink/25">
        <span
          className={cn("absolute inset-0 origin-left bg-wa-ink", move)}
          style={{ transform: `scaleX(${level / 100})` }}
        />
        <span className="absolute inset-0 flex items-center justify-center text-[0.5rem] leading-none font-bold tabular-nums text-wa-ink">
          {level}
        </span>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center text-[0.5rem] leading-none font-bold tabular-nums text-wa-bar",
            move,
          )}
          style={{ clipPath: `inset(0 ${empty} 0 0)` }}
        >
          {level}
        </span>
      </span>
      <span className="ml-px h-1 w-0.5 rounded-r-full bg-wa-ink/25" />
    </span>
  );
}

/**
 * The phone's status bar: the visitor's real time, a few notification
 * icons (WhatsApp, Binance, Telegram), and Wi-Fi, signal and
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
      <span className="flex items-center gap-1.5">
        <span className="min-w-8 tabular-nums">{now ? statusTime(now) : ""}</span>
        {/* Notification icons, as Android shows them beside the clock. */}
        <WhatsAppIcon size={11} />
        <BinanceIcon size={11} />
        <TelegramIcon size={11} />
      </span>
      <span className="absolute top-2.5 left-1/2 size-3 -translate-x-1/2 rounded-full bg-device" />
      <span className="flex items-center gap-1.5">
        <WifiIcon level={wifi} />
        <SignalIcon level={signal} />
        <BatteryIcon level={battery} />
      </span>
    </div>
  );
}
