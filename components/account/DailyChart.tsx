"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useId, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/Skeleton";
import type { UsageDay } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { creditCount, formatCount, requestCount } from "@/lib/format";
import { axisDays, busiestDay, formatDay, formatDayLong, sumDays } from "@/lib/usage";

/** How many dates the axis shows at most. */
const AXIS_LABELS = 5;
/** The draw-in on first load. Polling and a change of period redraw without it. */
const DRAW_MS = 900;

/**
 * "large": Usage, the page's one chart. "compact": Home's top band,
 * beside the balance.
 */
export type ChartSize = "large" | "compact";

/** The chart's whole height, axes included, so the skeleton matches it. */
const chartHeight: Record<ChartSize, string> = {
  large: "h-60 md:h-72",
  compact: "h-44 md:h-48",
};

// Theme tokens as CSS variables, so the chart follows light and dark
// without branching (DESIGN.md section 2).
const color = {
  accent: "var(--color-accent)",
  grid: "var(--color-line)",
  cursor: "var(--color-track)",
  axis: "var(--color-ink-2)",
  ink: "var(--color-ink)",
  ring: "var(--color-surface)",
};

const tick = { fill: color.axis, fontSize: 12 };

/** A round top for the scale (1, 2, 2.5 or 5 times a power of ten), so the axis reads 0, 50, 100. */
function niceTop(max: number): number {
  if (max <= 4) return 4;
  const power = 10 ** Math.floor(Math.log10(max));
  const step = [1, 2, 2.5, 5, 10].find((factor) => factor * power >= max) ?? 10;
  return step * power;
}

/** A date under the axis, held inside the plot at its two ends. */
function DateTick({ x, y, payload, first, last }: { x?: number; y?: number; payload?: { value: string }; first: string; last: string }) {
  const value = payload?.value ?? "";
  const anchor = value === first ? "start" : value === last ? "end" : "middle";
  return (
    <text x={x} y={y} dy={12} textAnchor={anchor} fill={color.axis} fontSize={12}>
      {value === last ? "Today" : formatDay(value)}
    </text>
  );
}

interface Point {
  date: string;
  credits: number;
  requests: number;
}

/** The hover readout: the day, its credits and its requests. */
function Readout({ active, payload }: { active?: boolean; payload?: ReadonlyArray<{ payload?: Point }> }) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return (
    <div className="rounded-sm border border-line bg-surface px-3 py-2 text-xs text-ink shadow-soft">
      <p className="text-ink-2">{formatDayLong(point.date)}</p>
      <p className="mt-1 flex items-center gap-2 tabular-nums">
        <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
        <span className="font-medium">{creditCount(point.credits)}</span>
        <span className="text-ink-2">· {requestCount(point.requests)}</span>
      </p>
    </div>
  );
}

/**
 * Credits used per day, oldest on the left, as a smooth terracotta area
 * over faint gridlines (owner's choice, November 18, 2026: Recharts, an
 * area with a soft fill). The busiest day carries its number; hovering
 * any day shows its own. The drawing is for sighted readers: assistive
 * tech gets a summary and a table of the same numbers instead.
 */
export function DailyChart({ days, label, size = "large" }: { days: UsageDay[]; label: string; size?: ChartSize }) {
  const reduced = useReducedMotion();
  // Draw in once, on first load. After that, new data replaces the old
  // without motion, so polling does not replay it every few seconds.
  const [animate, setAnimate] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setAnimate(false), DRAW_MS + 100);
    return () => window.clearTimeout(timer);
  }, []);

  const fillId = `daily-fill-${useId().replace(/[^\w-]/g, "")}`;
  const points: Point[] = days.map((day) => ({ date: day.date, credits: day.credits, requests: day.requests }));
  const peak = busiestDay(days);
  const lastIndex = days.length - 1;
  const ticks = [...axisDays(days.length, AXIS_LABELS)].sort((a, b) => a - b).map((index) => days[index].date);
  const totals = sumDays(days);
  const top = niceTop(Math.max(0, ...days.map((day) => day.credits)));

  return (
    <figure>
      <figcaption className="sr-only">
        {label}: {creditCount(totals.credits)} over {requestCount(totals.requests)}.
        {peak ? ` Busiest day ${formatDayLong(peak.date)}, ${creditCount(peak.credits)}.` : ""}
      </figcaption>

      <div aria-hidden="true" className={cn("w-full", chartHeight[size])}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 22, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color.accent} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={color.grid} strokeDasharray="3 4" />
            <XAxis
              dataKey="date"
              ticks={ticks}
              // Recharts drops dates that would collide (a phone's narrow
              // band), always keeping the first and today.
              interval="preserveStartEnd"
              minTickGap={20}
              tickFormatter={(date: string) => (date === days[lastIndex]?.date ? "Today" : formatDay(date))}
              tick={<DateTick first={days[0]?.date ?? ""} last={days[lastIndex]?.date ?? ""} />}
              tickLine={false}
              axisLine={false}
              tickMargin={6}
            />
            <YAxis
              domain={[0, top]}
              ticks={[0, top / 2, top]}
              width={36}
              tick={tick}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => formatCount(value)}
            />
            <Tooltip
              content={<Readout />}
              cursor={{ stroke: color.cursor, strokeWidth: 1 }}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="credits"
              stroke={color.accent}
              strokeWidth={2}
              fill={`url(#${fillId})`}
              dot={false}
              activeDot={{ r: 4, fill: color.accent, stroke: color.ring, strokeWidth: 2 }}
              isAnimationActive={animate && !reduced}
              animationDuration={DRAW_MS}
              animationEasing="ease-out"
            />
            {peak ? (
              <ReferenceDot
                x={peak.date}
                y={peak.credits}
                r={4}
                fill={color.accent}
                stroke={color.ring}
                strokeWidth={2}
                label={{ value: formatCount(peak.credits), position: "top", offset: 8, fill: color.ink, fontSize: 12 }}
              />
            ) : null}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Credits</th>
            <th scope="col">Requests</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day.date}>
              <th scope="row">{formatDayLong(day.date)}</th>
              <td>{formatCount(day.credits)}</td>
              <td>{formatCount(day.requests)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** Loading placeholder, the same height as the real chart. */
export function DailyChartSkeleton({ size = "large" }: { size?: ChartSize }) {
  return <Skeleton className={cn("w-full rounded-md", chartHeight[size])} />;
}
