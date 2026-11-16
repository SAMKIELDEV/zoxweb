import { CheckCheck, Clock3, Mic, Play, User, Video } from "lucide-react";
import Image from "next/image";
import { LogoMark } from "@/components/ui/Logo";
import type { ChatActor, ChatContent } from "@/content/chat-script";
import { cn } from "@/lib/cn";
import { InstagramIcon } from "./BrandIcons";

/**
 * The bubbles inside the hero phone, drawn the way WhatsApp draws them:
 * a tail on the first corner, the time (and ticks) tucked bottom-right,
 * file cards, link previews, voice notes and pictures. Everything is
 * tokens; the pictures are small drawings, except a link preview's image,
 * which is a file in /public.
 */

export type Receipt = "read" | "pending";

/** What a screen reader hears for a bubble. */
export function spokenContent(content: ChatContent): string {
  switch (content.kind) {
    case "text":
      return content.text;
    case "pdf":
      return `A file, ${content.name}. ${content.text ?? ""}`;
    case "link":
      return `A link to ${content.preview.title}. ${content.text ?? ""}`;
    case "voice":
      return `A voice note: ${content.transcript}`;
    case "image": {
      const what =
        content.art === "worksheet"
          ? "A photo of a worksheet: 2x + 3 = 11"
          : content.art === "poster"
            ? "A poster: Study group, Thursday 6pm"
            : "A video";
      return `${what}. ${content.caption ?? ""}`;
    }
  }
}

function Meta({ time, receipt, onImage = false }: { time: string; receipt?: Receipt; onImage?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute right-2 bottom-1 flex items-center gap-0.5 text-micro",
        onImage ? "rounded-full bg-device/40 px-1.5 text-on-bubble" : "text-wa-meta",
      )}
    >
      {time}
      {receipt === "read" ? <CheckCheck size={15} strokeWidth={2} className="text-wa-tick" /> : null}
      {receipt === "pending" ? <Clock3 size={11} strokeWidth={2} /> : null}
    </span>
  );
}

/** Room at the end of the last line for the time, as WhatsApp leaves it. */
const MetaRoom = ({ receipt }: { receipt?: Receipt }) => (
  <span aria-hidden="true" className={cn("inline-block", receipt ? "w-17" : "w-12")} />
);

/** The voice note's waveform: fixed bar heights, the same on every render. */
function Waveform({ seconds }: { seconds: number }) {
  const bars = Array.from({ length: 30 }, (_, i) => 3 + ((i * 7 + seconds * 13) % 11) + (i % 4 === 0 ? 4 : 0));
  return (
    <svg aria-hidden="true" viewBox="0 0 150 24" className="h-6 w-full" preserveAspectRatio="none">
      {bars.map((h, i) => (
        <rect key={i} x={i * 5} y={12 - h / 2} width="2.4" height={h} rx="1.2" className="fill-wa-meta" opacity="0.7" />
      ))}
      <circle cx="3" cy="12" r="5" className="fill-wa-tick" />
    </svg>
  );
}

function VoiceNote({ from, seconds }: { from: ChatActor; seconds: number }) {
  const duration = `0:${String(seconds).padStart(2, "0")}`;
  return (
    <span className="flex w-55 items-center gap-2 pr-1 pb-3">
      <span className="relative shrink-0">
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-full",
            from === "zox" ? "bg-accent-tint" : "bg-wa-bg text-wa-meta",
          )}
        >
          {from === "zox" ? <LogoMark alt="" className="size-6" /> : <User size={22} strokeWidth={1.8} />}
        </span>
        <Mic size={14} strokeWidth={2.4} className="absolute -right-0.5 -bottom-0.5 text-wa-green" />
      </span>
      <Play size={22} strokeWidth={0} className="shrink-0 fill-wa-icon" />
      <span className="relative min-w-0 flex-1">
        <Waveform seconds={seconds} />
        <span className="absolute top-full left-0 text-micro text-wa-meta">{duration}</span>
      </span>
    </span>
  );
}

/** The pictures: a photographed worksheet, a generated poster, a fetched video. */
function Picture({ art, video }: { art: "worksheet" | "poster" | "reel"; video?: boolean }) {
  return (
    <span className="relative block overflow-hidden rounded-sm">
      {art === "worksheet" ? (
        <svg viewBox="0 0 240 180" className="block h-auto w-full">
          <rect width="240" height="180" className="fill-wash" />
          <g transform="rotate(-3 120 90)">
            <rect x="18" y="14" width="204" height="152" rx="3" className="fill-card" />
            {[44, 68, 92, 116, 140].map((y) => (
              <path key={y} d={`M26 ${y}h188`} className="stroke-line" strokeWidth="1" />
            ))}
            <path d="M44 14v152" className="stroke-bubble-accent" strokeWidth="1" opacity="0.5" />
            <text x="54" y="40" className="fill-ink-2 font-sans" fontSize="12">
              Q4. Solve for x
            </text>
            <text x="62" y="88" className="fill-ink font-display" fontStyle="italic" fontSize="30">
              2x + 3 = 11
            </text>
          </g>
        </svg>
      ) : null}
      {art === "poster" ? (
        <svg viewBox="0 0 240 300" className="block h-auto w-full">
          <rect width="240" height="300" className="fill-accent-strong" />
          <circle cx="196" cy="58" r="64" className="fill-bubble-accent" />
          <circle cx="40" cy="262" r="80" className="fill-forest" />
          <rect x="22" y="104" width="44" height="6" rx="3" className="fill-on-accent" />
          <text x="22" y="150" className="fill-on-accent font-display" fontWeight="700" fontSize="34">
            Study
          </text>
          <text x="22" y="186" className="fill-on-accent font-display" fontWeight="700" fontSize="34">
            group
          </text>
          <text x="22" y="216" className="fill-on-accent font-sans" fontSize="14">
            Thursday · 6pm
          </text>
        </svg>
      ) : null}
      {art === "reel" ? (
        <svg viewBox="0 0 240 300" className="block h-auto w-full">
          <rect width="240" height="300" className="fill-forest" />
          <circle cx="60" cy="70" r="90" className="fill-bubble-forest-end" />
          <rect x="34" y="176" width="172" height="70" rx="12" className="fill-bubble-accent" />
          <rect x="52" y="196" width="110" height="8" rx="4" className="fill-on-bubble" opacity="0.9" />
          <rect x="52" y="214" width="76" height="8" rx="4" className="fill-on-bubble" opacity="0.6" />
        </svg>
      ) : null}
      {video ? (
        <>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-device/50">
              <Play size={22} strokeWidth={0} className="ml-0.5 fill-on-bubble" />
            </span>
          </span>
          <span className="absolute bottom-1.5 left-2 flex items-center gap-1 text-micro text-on-bubble">
            <Video size={13} strokeWidth={2} />
            0:24
          </span>
        </>
      ) : null}
    </span>
  );
}

function LinkPreview({ preview }: { preview: Extract<ChatContent, { kind: "link" }>["preview"] }) {
  return (
    <span className="-mx-1 mb-1.5 block overflow-hidden rounded-sm bg-wa-doc">
      {preview.image ? (
        <Image
          src={preview.image}
          alt=""
          width={480}
          height={360}
          sizes="240px"
          className="block aspect-video w-full object-cover"
        />
      ) : null}
      <span className="flex items-start gap-2 px-2.5 py-2">
        {preview.site === "instagram" ? (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-wa-in text-wa-icon">
            <InstagramIcon size={18} />
          </span>
        ) : null}
        <span className="min-w-0">
          <span className="line-clamp-2 font-medium">{preview.title}</span>
          <span className="block text-micro text-wa-meta">
            {preview.site === "youtube" ? "youtube.com" : "instagram.com"}
            {preview.byline && preview.site === "youtube" ? ` • ${preview.byline}` : ""}
          </span>
        </span>
      </span>
    </span>
  );
}

/**
 * One bubble. `time` is shown bottom-right; `receipt` adds the read ticks
 * or the "sending" clock.
 */
export function ChatBubble({
  from,
  content,
  time,
  receipt,
}: {
  from: ChatActor;
  content: ChatContent;
  time: string;
  receipt?: Receipt;
}) {
  const person = from === "person";
  const picture = content.kind === "image";
  const caption = picture ? content.caption : content.kind === "text" ? content.text : "text" in content ? content.text : undefined;

  return (
    <div
      className={cn(
        "relative rounded-md text-sm leading-snug text-wa-ink shadow-wa",
        picture ? "w-56 p-1" : content.kind === "link" || content.kind === "pdf" ? "w-60 px-2.5 pt-1.5 pb-2" : "px-2.5 pt-1.5 pb-2",
        person ? "rounded-tr-none bg-wa-out" : "rounded-tl-none bg-wa-in",
      )}
    >
      {/* The tail. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-0 h-3 w-2",
          person
            ? "-right-2 bg-wa-out [clip-path:polygon(0_0,100%_0,0_100%)]"
            : "-left-2 bg-wa-in [clip-path:polygon(0_0,100%_0,100%_100%)]",
        )}
      />
      <span className="sr-only">
        {person ? "You: " : "Zox: "}
        {spokenContent(content)}
      </span>

      <span aria-hidden="true" className="block">
        {content.kind === "pdf" ? (
          <span className="-mx-1 mb-1.5 flex items-center gap-2.5 rounded-sm bg-wa-doc px-2.5 py-2">
            <span className="flex h-8 w-6.5 shrink-0 items-end justify-center rounded-xs bg-wa-pdf pb-1 text-[0.5rem] font-bold text-on-bubble">
              PDF
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block truncate font-medium">{content.name}</span>
              <span className="block text-micro text-wa-meta">{content.detail}</span>
            </span>
          </span>
        ) : null}

        {content.kind === "link" ? (
          <>
            <LinkPreview preview={content.preview} />
            <span className="block break-all text-wa-link">{content.url || "instagram.com/samkiel_"}</span>
          </>
        ) : null}

        {content.kind === "voice" ? <VoiceNote from={from} seconds={content.seconds} /> : null}

        {picture ? <Picture art={content.art} video={content.video} /> : null}

        {caption ? (
          <span className={cn("block break-words", picture && "px-1.5 pt-1 pb-1")}>
            {caption}
            <MetaRoom receipt={receipt} />
          </span>
        ) : null}
      </span>

      <Meta time={time} receipt={receipt} onImage={picture && !caption} />
    </div>
  );
}
