export interface IPackage {
  id: number;
  created_at: string;
  updated_at: string;
  parent_id: number | null;
  title: string;
  types: string[] | null;
  benefit: string[] | null;
  description: string | null;
  children: IPackage[];
}
