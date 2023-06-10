export interface State {
  session: string | undefined;
}

export interface User {
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
  editor: boolean;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Image {
  id: string;
  uid: string;
  name: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}
