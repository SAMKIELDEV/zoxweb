import { cn } from "@/lib/cn";
import type { JobArt as JobArtKind } from "./content";

/**
 * The five jobs' illustrations (landing section 05). Each previews what the
 * tool does, drawn in SVG from the tokens. Each plays once through the
 * `reveal` group (components/marketing/Reveal.tsx): the final look is the
 * default, "ready" is the starting pose. Each also reacts slightly when its
 * card (`group/card`) is hovered. Decorative: the card's text says the same.
 */

// Shared motion classes. Start pose under "ready"; transitions carry it to the final look.
const appear =
  "transition-[opacity,transform] duration-(--dur-slow) ease-zox group-data-[reveal=ready]/reveal:opacity-0 group-data-[reveal=ready]/reveal:translate-y-2";
const sweep =
  "origin-left [transform-box:fill-box] transition-transform duration-700 ease-zox group-data-[reveal=ready]/reveal:scale-x-0";
const draw = "transition-[stroke-dashoffset] duration-700 ease-zox group-data-[reveal=ready]/reveal:[stroke-dashoffset:1]";
const hover = "transition-transform duration-(--dur-base) ease-zox";
const delay = (ms: number) => ({ transitionDelay: `${ms}ms` });

function Ask() {
  return (
    <>
      {/* The person's question */}
      <g className={appear}>
        <g className={cn(hover, "group-hover/card:-translate-x-1")}>
          <rect x="96" y="12" width="128" height="40" rx="12" className="fill-card stroke-line" strokeWidth="1.5" />
          <path d="M110 28h92M110 38h58" className="stroke-track" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
      {/* Zox's short answer */}
      <g className={appear} style={delay(380)}>
        <g className={cn(hover, "group-hover/card:-translate-y-1")}>
          <rect x="16" y="66" width="164" height="62" rx="12" className="fill-accent-strong" />
          <path d="M32 84h124M32 96h132M32 108h76" className="stroke-on-accent" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
        </g>
      </g>
    </>
  );
}

function Pdf() {
  return (
    <>
      <path d="M24 10h86l22 22v108H24z" className="fill-card stroke-line" strokeWidth="1.5" />
      <path d="M110 10v22h22" className="stroke-line" strokeWidth="1.5" fill="none" />
      {/* The lines the summary comes from get highlighted */}
      <rect x="36" y="58" width="84" height="22" rx="3" className={cn("fill-accent-tint", sweep)} style={delay(150)} />
      <path d="M40 40h68M40 52h80M40 64h74M40 76h66M40 88h80M40 100h58M40 112h72" className="stroke-track" strokeWidth="3" strokeLinecap="round" />
      {/* The summary chip */}
      <g className={appear} style={delay(750)}>
        <g className={cn(hover, "group-hover/card:-translate-x-1")}>
          <rect x="118" y="94" width="106" height="36" rx="18" className="fill-forest" />
          <path d="M136 108h70M136 118h44" className="stroke-on-accent" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>
    </>
  );
}

function Search() {
  const pills = [
    { x: 16, y: 62, w: 118, tint: "fill-accent-tint", dot: "fill-accent" },
    { x: 46, y: 92, w: 132, tint: "fill-forest-tint", dot: "fill-forest" },
    { x: 26, y: 122, w: 104, tint: "fill-wash", dot: "fill-ink-3" },
  ];
  return (
    <>
      {/* The query */}
      <rect x="16" y="14" width="208" height="32" rx="16" className="fill-card stroke-line" strokeWidth="1.5" />
      <circle cx="36" cy="30" r="6" className="stroke-ink-2" strokeWidth="2" fill="none" />
      <path d="M41 35l5 5" className="stroke-ink-2" strokeWidth="2" strokeLinecap="round" />
      <path d="M56 30h96" className="stroke-track" strokeWidth="3" strokeLinecap="round" />
      {/* Three sources arrive in order */}
      {pills.map((pill, index) => (
        <g key={pill.y} className={appear} style={delay(250 + index * 170)}>
          <g className={cn(hover, "group-hover/card:translate-x-1")} style={{ transitionDelay: `${index * 40}ms` }}>
            <rect x={pill.x} y={pill.y} width={pill.w} height="22" rx="11" className={pill.tint} />
            <circle cx={pill.x + 13} cy={pill.y + 11} r="4" className={pill.dot} />
            <path d={`M${pill.x + 24} ${pill.y + 11}h${pill.w - 38}`} className="stroke-ink-3" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </g>
      ))}
    </>
  );
}

function Video() {
  const notes = ["0:42", "3:10", "7:55"];
  return (
    <>
      <rect x="14" y="12" width="124" height="76" rx="8" className="fill-forest-tint" />
      <path d="M68 36v28l24-14z" className="fill-forest" />
      {/* The timeline fills */}
      <rect x="14" y="100" width="124" height="5" rx="2.5" className="fill-line" />
      <rect x="14" y="100" width="124" height="5" rx="2.5" className={cn("fill-accent", sweep)} style={{ transitionDuration: "900ms" }} />
      {[40, 74, 112].map((x) => (
        <circle key={x} cx={x} cy="102.5" r="3.5" className="fill-card stroke-accent" strokeWidth="1.5" />
      ))}
      {/* Three timestamped points */}
      {notes.map((time, index) => (
        <g key={time} className={appear} style={delay(350 + index * 160)}>
          <g className={cn(hover, "group-hover/card:translate-x-1")}>
            <text x="152" y={30 + index * 34} className="fill-accent-ink font-sans" fontSize="11" fontWeight="600">
              {time}
            </text>
            <path d={`M152 ${38 + index * 34}h${index === 1 ? 62 : 74}`} className="stroke-track" strokeWidth="3" strokeLinecap="round" />
          </g>
        </g>
      ))}
    </>
  );
}

function Photo() {
  return (
    <>
      <g transform="rotate(-3 120 75)">
        <rect x="20" y="14" width="200" height="118" rx="4" className="fill-card stroke-line" strokeWidth="1.5" />
        {[44, 70, 96, 122].map((y) => (
          <path key={y} d={`M28 ${y}h184`} className="stroke-line" strokeWidth="1" />
        ))}
        {/* The handwritten line */}
        <path
          d="M40 62c4-9 9 4 13-1M60 58h9M64 54v8M78 62c4-11 10 9 14-3M104 58h10M104 62h10M124 63c3-8 6-8 9 0 3-8 6-8 9 0"
          className="stroke-ink"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </g>
      {/* The bracket and its note draw in */}
      <g className={cn(hover, "group-hover/card:translate-y-0.5")}>
        <path
          d="M40 80c0 6 0 8 5 8h40l6 7 6-7h42c5 0 5-2 5-8"
          pathLength={1}
          strokeDasharray="1"
          className={cn("stroke-accent", draw)}
          style={delay(200)}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <g className={appear} style={delay(850)}>
          <rect x="66" y="102" width="62" height="22" rx="4" className="fill-accent-tint" />
          <text x="78" y="117" className="fill-accent-ink font-sans" fontSize="11" fontWeight="600">
            x = 4
          </text>
        </g>
      </g>
    </>
  );
}

const ART: Record<JobArtKind, () => React.ReactElement> = { ask: Ask, pdf: Pdf, search: Search, video: Video, photo: Photo };

export function JobArt({ art, className }: { art: JobArtKind; className?: string }) {
  const Drawing = ART[art];
  return (
    <svg aria-hidden="true" viewBox="0 0 240 150" fill="none" className={cn("h-auto w-full overflow-visible", className)}>
      <Drawing />
    </svg>
  );
}
