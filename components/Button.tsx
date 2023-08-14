import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { cx } from "twind/core";

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  theme?: "primary" | "danger";
}
export const styles = {
  primary: "bg-blue-600 text-blue-50 hover:bg-blue-500 active:bg-blue-500",
  danger: "bg-red-600 text-red-50 hover:bg-red-500 active:bg-red-500",
};
export default function Button(
  { theme = "primary", ...props }: ButtonProps,
) {
  return (
    <button
      {...props}
      class={cx(
        "px-3 py-2 rounded",
        styles[theme],
        props.class?.toString(),
      )}
    />
  );
}
