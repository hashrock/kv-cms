import { JSX } from "preact";
import { User } from "@/utils/types.ts";

interface PageProps extends JSX.HTMLAttributes<HTMLDivElement> {
  current?: string;
}

export function Nav(props: PageProps) {
  const menu = [
    { name: "Dashboard", href: "/admin", current: props.current === "index" },
    { name: "Posts", href: "/admin/post", current: props.current === "post" },
    {
      name: "Images",
      href: "/admin/image",
      current: props.current === "image",
    },
  ];

  return (
    <div
      {...props}
    >
      <ul class="flex flex-col">
        {menu.map((item) => (
          <li class="bg-gray-800 text-white px-4 py-3">
            <a href={item.href}>{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
