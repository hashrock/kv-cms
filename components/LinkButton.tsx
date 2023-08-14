import { JSX } from "preact";
import { cx } from "twind/core";
import { styles } from "🧱/Button.tsx";

interface ButtonProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  theme: "primary" | "danger";
}
export default function LinkButton(
  props: ButtonProps,
) {
  return (
    <a
      {...props}
      class={cx(
        "inline-block cursor-pointer px-3 py-2 bg-white rounded hover:bg-gray-100",
        styles[props.theme],
        props.class?.toString(),
      )}
    />
  );
}
