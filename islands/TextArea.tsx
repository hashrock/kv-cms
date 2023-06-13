import { useEffect, useRef, useState } from "preact/hooks";
import { JSX } from "preact";
import render from "@/utils/markdown.ts";

export default function TextArea(
  props: JSX.HTMLAttributes<HTMLTextAreaElement>,
) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [dropOver, setDropOver] = useState(false);
  const [value, setValue] = useState(props.value);
  const [selectionStart, setSelectionStart] = useState(0);
  const [markdown, setMarkdown] = useState(
    render((props.value as string) ?? ""),
  );

  useEffect(() => {
    ref.current?.addEventListener("dragover", (e) => {
      e.stopPropagation();
      e.preventDefault();
      setDropOver(true);
    }, false);

    ref.current?.addEventListener("dragleave", (e) => {
      e.stopPropagation();
      e.preventDefault();
      setDropOver(false);
    }, false);

    ref.current?.addEventListener("drop", (e) => {
      e.stopPropagation();
      e.preventDefault();
      setDropOver(false);
      const files = e.dataTransfer?.files;

      const formData = new FormData();
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          formData.append("image", file);
        }
      }
      (async () => {
        const res = await fetch(`/api/image`, {
          method: "POST",
          body: formData,
          credentials: "include",
        });
        const url = await res.json();
        const markdown = `![Image](${url})`;

        setValue((prev) => {
          const start = selectionStart;
          const end = selectionStart;
          const before = prev.slice(0, start);
          const after = prev.slice(end);
          return before + markdown + after;
        });
      })();
    }, false);
  }, []);

  return (
    <div class="grid grid-cols-2">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown.min.css"
      />
      <textarea
        ref={ref}
        name="body"
        {...props}
        class={`px-3 py-2 h-[32rem] w-full border-1 rounded ${
          dropOver ? "border-2 border-blue-500" : ""
        }`}
        value={value}
        onInput={(e) => {
          const textarea = e.target as HTMLTextAreaElement;
          setValue(textarea.value);
          setMarkdown(render(textarea.value));
        }}
      />

      <div>
        <div
          class="markdown-body p-4 h-[32rem] overflow-y-scroll"
          dangerouslySetInnerHTML={{ __html: markdown }}
        >
        </div>
      </div>
    </div>
  );
}
