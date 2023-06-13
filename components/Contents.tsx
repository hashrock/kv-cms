import { JSX } from "preact";
import render from "../utils/markdown.ts";
import { Image, Post, User } from "🛠️/types.ts";

interface ContentsProps extends JSX.HTMLAttributes<HTMLDivElement> {
  user: User | null;
  posts: Post[];
  single?: boolean;
}

export function Contents(props: ContentsProps) {
  const user = props.user ?? null;
  const userId = user?.id ?? null;

  return (
    <>
      <div class={props.class}>
        <ul class="space-y-3">
          {props.posts.map((post) => {
            return (
              <li>
                <div
                  class={"mb-16 pb-8 border-gray-400" +
                    (props.single ? "" : " border-b-1")}
                >
                  <h2 class="text-4xl">
                    <a href={`/post/${post.id}`} class="hover:underline">
                      {post?.title}
                    </a>
                  </h2>

                  <div
                    class="text-lg text-gray-500 mt-8"
                    dangerouslySetInnerHTML={{ __html: render(post?.body) }}
                  >
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
