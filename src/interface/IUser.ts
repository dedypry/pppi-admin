export interface IRole {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}
export interface Province {
  id: number;
  name: string;
  code: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface City {
  id: number;
  province_id: number;
  name: string;
  code: string;
  created_at: string | null;
  updated_at: string | null;
  province: Province | null;
}

export interface District {
  id: number;
  city_id: number;
  name: string;
  code: string | null;
  created_at: string | null;
  updated_at: string | null;
  city: City | null;
}

export interface IUserProfile {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  nik: string;
  place_birth: string;
  date_birth: string;
  gender: "male" | "female" | string;
  citizenship: string;
  address: string;
  province_id: number;
  city_id: number;
  district_id: number;
  phone: string;
  last_education_nursing: string;
  last_education: string;
  workplace: string;
  hope_in: string;
  contribution: string;
  is_member_payment: boolean;
  member_payment_file: string;
  reason_reject: string;
  photo: string;
  province: Province;
  city: City;
  district: District;
}

export interface IUser {
  id: number;
  join_year?: number;
  sort?: number;
  front_title?: string;
  name: string;
  back_title?: string;
  nia: string;
  job_title?: string;
  email: string;
  last_login: string;
  is_active: boolean;
  is_organization: boolean;
  status?: string;
  approved_at?: string;
  approved_by?: number;
  rejected_at?: string;
  rejected_by?: number;
  rejected_note: string;
  profile: IUserProfile;
  created_at: string;
  roles: IRole[];
}

export interface ICreateMember {
  id: number | undefined;
  profile_id: number | undefined;
  join_year: string;
  front_title: string;
  back_title: string;
  sort: string;
  nik: string;
  name: string;
  email: string;
  place_birth: string;
  date_birth: string;
  gender: string;
  citizenship: string;
  address: string;
  province_id: number | undefined;
  city_id: number | undefined;
  district_id: number | undefined;
  phone: string;
  last_education_nursing: string;
  last_education: string;
  workplace: string;
  hope_in: string;
  contribution: string;
  is_member_payment: string;
  reason_reject: string;
  photo: string;
  member_payment_file: string;
}

export interface IApprove {
  approve: boolean;
  rejected_note?: string;
  user_id: number;
}
