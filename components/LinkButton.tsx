import { JSX } from "preact";
import { cx } from "twind/core";
export default function LinkButton(
  props: JSX.HTMLAttributes<HTMLAnchorElement>,
) {
  return (
    <a
      {...props}
      class={cx(
        "inline-block cursor-pointer px-3 py-2 bg-white rounded hover:bg-gray-100",
        props.class?.toString(),
      )}
    />
  );
}
