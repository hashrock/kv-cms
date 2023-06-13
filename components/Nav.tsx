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
    // {
    //   name: "Pages",
    //   href: "/admin/page",
    //   current: props.current === "page",
    // },
  ];

  return (
    <div
      {...props}
    >
      <ul class="flex flex-col bg-gray-800">
        {menu.map((item) => (
          <li
            class={"bg-gray-800 text-white hover:bg-gray-700 border-gray-700 border-r-8 " +
              (item.current ? "  border-blue-500" : "")}
          >
            <a class="block px-8 py-4" href={item.href}>{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
