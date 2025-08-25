export interface IFormOption {
  label: string;
}

export interface IFormHeader {
  id: number;
  created_at: string; // bisa diganti Date kalau mau langsung parse ke Date
  updated_at: string;
  form_id: number;
  sort: number;
  required: boolean;
  key: string;
  title: string;
  type: string; // kalau ada enum tipe field tertentu, bisa dijadikan union
  options: IFormOption[];
}

export interface IFormList {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  member_required: boolean;
  description: string;
  required: boolean; // typo? kalau maksudnya "required" nanti bisa disesuaikan
  form_headers: IFormHeader[];
}
