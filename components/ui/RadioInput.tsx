import type { InputHTMLAttributes } from "react";

/**
 * A native radio with the Zox mark drawn beside it. The real input stays
 * in the page (visually hidden) so keyboard, forms and screen readers
 * behave exactly as a radio should.
 *
 * Use it as the first children of a <label>, and give that label
 * `radioLabelFocus` so the focus ring appears around the whole option.
 */
export function RadioInput(props: Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "className">) {
  return (
    <>
      <input type="radio" className="peer sr-only" {...props} />
      <span
        aria-hidden="true"
        className={
          "relative size-5 shrink-0 rounded-full border border-track transition-colors duration-(--dur-fast) ease-zox " +
          "after:absolute after:inset-1 after:rounded-full after:bg-accent-strong after:opacity-0 " +
          "after:transition-opacity after:duration-(--dur-fast) " +
          "peer-checked:border-accent-strong peer-checked:after:opacity-100 peer-disabled:opacity-40"
        }
      />
    </>
  );
}

/** Focus ring for the label that wraps a RadioInput. */
export const radioLabelFocus =
  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent";
