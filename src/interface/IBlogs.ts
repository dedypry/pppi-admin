import { IUser } from "./IUser";

// Interface untuk kategori blog
export interface ICategory {
  id: number;
  name: string;
  icon: string | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  blogs_count: number;
}
export interface IComment {
  id: number;
  parent_id: number | null;
  blog_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  website: string | null;
  user: IUser | null;
}

export interface IBlog {
  id: number;
  category_id: number;
  writer_id: number;
  writer: IUser;
  cover: string;
  title: string;
  subtitle: string;
  content: string;
  tags: string[]; // Jika ingin sebagai array: string[]
  status: string;
  view_count: number;
  share_count: number;
  created_at: string;
  updated_at: string;
  publish_at: string;
  schedule: string;
  category: ICategory;
  comments: IComment[];
}
