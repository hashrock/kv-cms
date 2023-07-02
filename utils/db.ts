/**
 * This module implements the DB layer for the Tic Tac Toe game. It uses Deno's
 * key-value store to store data, and uses BroadcastChannel to perform real-time
 * synchronization between clients.
 */

import { Image, Post, User } from "./types.ts";
import * as blob from "https://deno.land/x/kv_toolbox@0.0.2/blob.ts";
import { ulid } from "https://deno.land/x/ulid@v0.2.0/mod.ts";
const kv = await Deno.openKv();

export async function setUserWithSession(user: User, session: string) {
  await kv
    .atomic()
    .set(["users", user.id], user)
    .set(["users_by_login", user.login], user)
    .set(["users_by_session", session], user)
    .commit();
}

export async function getUserBySession(session: string) {
  const res = await kv.get<User>(["users_by_session", session]);
  return res.value;
}

export async function getUserById(id: string) {
  const res = await kv.get<User>(["users", id]);
  return res.value;
}

export async function getUserByLogin(login: string) {
  const res = await kv.get<User>(["users_by_login", login]);
  return res.value;
}

export async function deleteSession(session: string) {
  await kv.delete(["users_by_session", session]);
}

export function addImageData(uuid: string, data: ArrayBuffer) {
  const body = new Uint8Array(data);
  return blob.set(kv, ["imagedata", uuid], body);
}

export function removeImageData(uuid: string) {
  return blob.remove(kv, ["imagedata", uuid]);
}
export function getImageData(uuid: string) {
  return blob.get(kv, ["imagedata", uuid]);
}

export async function addImage(uid: string, data: File) {
  const uuid = ulid();
  const image: Image = {
    id: uuid,
    uid,
    name: data.name,
    type: data.type,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  try {
    await addImageData(uuid, await data.arrayBuffer());
  } catch (e) {
    console.log(e);
  }
  return { result: await kv.set(["images", uuid], image), id: uuid };
}

export async function listImage() {
  const iter = await kv.list<Image>({ prefix: ["images"] });
  const images: Image[] = [];
  for await (const item of iter) {
    images.push(item.value);
  }
  return images;
}

export async function getImage(id: string) {
  const res = await kv.get<Image>(["images", id]);
  const body = await getImageData(id);
  return { meta: res.value, body };
}

export async function deleteImage(id: string) {
  const res = await kv.get<Image>(["images", id]);
  if (res.value === null) throw new Error("image not found");
  await removeImageData(id);
  await kv.delete(["images", id]);
}

export async function addPost(
  title: string,
  body: string,
  authorId: string,
) {
  const uuid = ulid();
  const post: Post = {
    id: uuid,
    title,
    body,
    authorId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  await kv.set(["posts", uuid], post);
}

export async function listPost() {
  const iter = await kv.list<Post>({ prefix: ["posts"] });
  const posts: Post[] = [];
  for await (const item of iter) {
    posts.push(item.value);
  }
  return posts;
}

export async function getPost(id: string) {
  const res = await kv.get<Post>(["posts", id]);
  return res.value;
}

export async function updatePost(
  id: string,
  title: string,
  body: string,
) {
  const post = await getPost(id);
  if (!post) throw new Error("post not found");
  post.title = title;
  post.body = body;
  post.updatedAt = new Date();
  await kv.set(["posts", id], post);
}

export async function deletePost(id: string) {
  await kv.delete(["posts", id]);
}
