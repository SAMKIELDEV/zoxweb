import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  /** Also used as the input name unless `name` is given. */
  id: string;
  label: string;
  hint?: string;
  error?: string;
}

/** A labelled text input. The label is always visible, above the input. */
export function Field({ id, label, hint, error, className, name, ...rest }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={name ?? id}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={cn(
          "h-11 w-full rounded-md border bg-paper px-3 text-base text-ink",
          "transition-[border-color] duration-(--dur-fast) ease-zox placeholder:text-ink-3",
          error ? "border-danger" : "border-line hover:border-track",
        )}
        {...rest}
      />
      {hint ? (
        <p id={hintId} className="text-sm text-ink-2">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
