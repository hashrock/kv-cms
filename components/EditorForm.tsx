import TextArea from "@/islands/TextArea.tsx";

export interface EditorFormProps {
  id?: string;
  title: string;
  body: string;
}

export function EditorForm(props: { post: EditorFormProps }) {
  const { post } = props;
  const actionUrl = post.id ? `/admin/post/${post.id}` : "/admin/post/new";
  return (
    <form
      class="flex flex-col"
      action={actionUrl}
      method="POST"
    >
      <div>
        <input
          class="w-full px-3 py-2  border-1 rounded text-2xl"
          type="text"
          name="title"
          value={post.title}
        />
      </div>
      <div>
        <TextArea value={post.body} />
      </div>
      {post.id && <input type="hidden" name="_method" value="PUT" />}
      {post.id && <input type="hidden" value={post.id} />}
      <input
        type="submit"
        value="Update"
        class="mt-1 inline-block cursor-pointer px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
      />
    </form>
  );
}

export function EditorFormDelete({ id }: { id: string }) {
  return (
    <form
      action={`/admin/post/${id}`}
      method="POST"
      class="flex justify-center"
    >
      <input type="hidden" name="_method" value="DELETE" />
      <input type="hidden" value={id} />
      <input
        class="inline-block mt-8 cursor-pointer px-3 py-2 border-red-800 text-red-800 bg-transparent rounded"
        type="submit"
        value="Delete This Note"
      />
    </form>
  );
}
