export interface IScheduler {
  id: number;
  cover: string;
  title: string;
  slug: string;
  subtitle: string;
  color: string;
  start_at: string;
  end_at: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id: number;
}
