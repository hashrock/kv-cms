import { useEffect, useRef, useState } from "preact/hooks";
import { Post } from "@/utils/types.ts";

function PostRow(
  { collection, post, onUpdate }: {
    collection: string;
    post: Post;
    onUpdate: () => void;
  },
) {
  const [editing, setEditing] = useState<boolean>(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  async function remove() {
    await fetch("/api/" + collection + "/" + post.id, {
      method: "DELETE",
    }).then((res) => res.json());
    onUpdate();
  }

  function edit() {
    setEditing(true);
  }
  function cancel() {
    setEditing(false);
  }

  async function endEdit() {
    await fetch("/api/" + collection + "/" + post.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: textRef.current!.value,
    }).then((res) => res.json());
    setEditing(false);
    onUpdate();
  }

  return (
    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td class="px-6 py-4">{post.title}</td>
      <td class="px-6 py-4">
        {!editing && (
          <div
            class="editable"
            onClick={edit}
          >
            {post.body}
          </div>
        )}
        {editing && (
          <form onSubmit={endEdit}>
            <textarea cols={68} rows={5} ref={textRef}>
              {post.body}
            </textarea>
            <div>
              <input type="submit" value="Update" />
              <button
                type="button"
                onClick={cancel}
                style="margin-left: 0.5em;"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </td>
      <td class="px-6 py-4">
        <button onClick={remove}>Delete</button>
      </td>
    </tr>
  );
}

export default function PostList(
  { collection }: { collection: string },
) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<boolean>(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

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

  async function create(e: Event) {
    e.preventDefault();
    const json = textRef.current!.value;
    await fetch("/api/" + collection, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    }).then((res) => res.json());
    await list();
    setEditing(false);
  }

  return (
    <>
      {editing
        ? (
          <form onSubmit={create}>
            <div>
              <textarea cols={80} rows={10} ref={textRef}>
              </textarea>
            </div>
            <div>
              <input type="submit" value="Create" />
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )
        : <button onClick={() => setEditing(true)}>New {collection}</button>}

      <div>
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th width={360}>Title</th>
              <th width={500}>Body</th>
              <th>action</th>
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
