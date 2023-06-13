import { useEffect, useRef, useState } from "preact/hooks";
import { Post } from "@/utils/types.ts";

function PostRow(
  { collection, post, onUpdate }: {
    collection: string;
    post: Post;
    onUpdate: () => void;
  },
) {
  async function remove() {
    await fetch("/api/" + collection + "/" + post.id, {
      method: "DELETE",
    }).then((res) => res.json());
    onUpdate();
  }

  const tdStyle = "px-6 py-4 whitespace-nowrap";

  return (
    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td class="px-6 py-4">
        <a class="text-blue-500" href={`/admin/post/${post.id}`}>
          {post.title}
        </a>
      </td>
      <td class={tdStyle}>
        {prettyDate(post.updatedAt)}
      </td>

      <td class={tdStyle}>
        <button onClick={remove}>Delete</button>
      </td>
    </tr>
  );
}

export default function PostList(
  { collection }: { collection: string },
) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    (async () => {
      const post = await fetch("/api/" + collection).then((res) => res.json());
      setPosts(post);
    })();
  }, []);

  async function list() {
    const post = await fetch("/api/" + collection).then((res) => res.json());
    setPosts(post);
  }

  const thStyle =
    "px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400";

  return (
    <>
      <div>
        <table class="w-full text-left text-gray-800 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th width={360} class={thStyle}>Title</th>
              <th width={100} class={thStyle}>Updated</th>
              <th class={thStyle}>action</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <PostRow
                collection={collection}
                post={post}
                key={post.id}
                onUpdate={list}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function prettyDate(date: Date) {
  const d = new Date(date);
  return d.toLocaleDateString() + " " + d.toLocaleTimeString();
}
