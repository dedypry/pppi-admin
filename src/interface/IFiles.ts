export interface IFileData {
  id: number;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  name: string;
  url: string;
  size: number;
  extension: string;
  mime_type: string;
  parent_id: number;
  table: string;
}
