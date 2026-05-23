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

export interface IPartner {
  id: number;
  name: string;
  logo: string | null;
  website: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export type TPackageInterestStatus = "new" | "follow_up" | "closed";

export interface IPackageInterest {
  id: number;
  package_id: number | null;
  package_group: string;
  package_title: string;
  name: string;
  email: string;
  phone: string;
  institution: string | null;
  note: string | null;
  status: TPackageInterestStatus;
  created_at: string;
  updated_at: string;
}
