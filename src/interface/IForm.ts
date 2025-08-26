import { IUser } from "./IUser";

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
export interface IFormValue {
  [key: string]: string;
}

export interface IFormResult {
  id: number;
  created_at: string; // bisa diganti Date kalau di-convert
  updated_at: string;
  form_id: number;
  nia: string;
  name: string;
  email: string;
  value: IFormValue;
  user: IUser;
}

export interface IFormList {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  member_required: boolean;
  description: string;
  status: string;
  required: boolean;
  result_total: number;
  form_headers: IFormHeader[];
  form_results: IFormResult[];
  created_by: IUser;
}
